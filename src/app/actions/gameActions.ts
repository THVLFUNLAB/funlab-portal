'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { ScoreResultV2, GamePayload } from '@/lib/scoreLogic';

/**
 * Server Action for submitting game scores with metadata.
 * Implements the one-shot rule and updates both episode and yearly leaderboards.
 */
export async function saveGameScore(
  userId: string,
  episodeId: number,
  payload: GamePayload
): Promise<ScoreResultV2> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const validScore = Math.max(0, Math.min(payload.score, 50));

    // --- STEP 1: One-shot Check ---
    const { data: existing, error: checkError } = await supabase
      .from('episode_scores')
      .select('id')
      .eq('user_id', userId)
      .eq('episode_id', episodeId)
      .maybeSingle();

    if (checkError) {
      console.error('Check Error:', checkError);
      return { success: false, error: `Lỗi Check DB: ${checkError.message || JSON.stringify(checkError)}` };
    }

    if (existing) {
      return {
        success: false,
        alreadySubmitted: true,
        error: `Bạn đã nộp điểm cho Tập ${episodeId} rồi. Hệ thống chỉ ghi nhận 1 lần duy nhất.`
      };
    }

    // --- STEP 2: Lấy season_id từ tập (để điểm vào đúng mùa giải) ---
    const { data: episodeData } = await supabase
      .from('episodes')
      .select('season_id')
      .eq('id', episodeId)
      .maybeSingle();

    let seasonId = episodeData?.season_id;

    // Fallback ĐỘNG: nếu tập không có season_id gắn sẵn, lấy mùa đang 'active'
    // từ bảng seasons — KHÔNG hardcode string, để không phải sửa code mỗi lần
    // chuyển mùa giải (đây từng là lỗi #2 trong bản audit 2026-08-21).
    if (!seasonId) {
      const { data: activeSeason } = await supabase
        .from('seasons')
        .select('id')
        .eq('status', 'active')
        .maybeSingle();

      seasonId = activeSeason?.id;

      if (!seasonId) {
        // Không tìm được mùa nào đang active — đây là lỗi cấu hình dữ liệu,
        // không nên âm thầm đoán bừa một mùa. Chặn nộp điểm và báo lỗi rõ ràng
        // để admin biết mà sửa bảng `seasons`, thay vì điểm rơi vào sai mùa.
        console.error(`[saveGameScore] Không có season nào đang 'active' và episode ${episodeId} cũng không có season_id.`);
        return {
          success: false,
          error: 'Lỗi cấu hình mùa giải: không xác định được mùa hiện tại. Vui lòng báo Admin.'
        };
      }
    }

    // --- STEP 3: Insert into episode_scores với đúng season ---
    const { error: insertError } = await supabase
      .from('episode_scores')
      .insert({
        user_id: userId,
        episode_id: episodeId,
        score: validScore,
        time_in_seconds: payload.timeInSeconds,
        level: payload.level,
        answers_log: payload.answersLog,
        stem_link: payload.stemLink,
        season_id: seasonId   // ← tập 10+ → season_2026_1, tập 1-9 → season_2025_1
      });

    if (insertError) {
      console.error('Insert Error:', insertError);
      return { success: false, error: `Lỗi DB: ${insertError.message || insertError.details || JSON.stringify(insertError)}` };
    }

    // --- STEP 4: Tự động cấp Badge nếu đủ điều kiện ---
    // Lấy tổng điểm từ overall_leaderboard — BẮT BUỘC filter season_id
    // (view này PARTITION BY season_id → không filter → .maybeSingle() crash nếu user có 2 mùa)
    const { data: lb } = await supabase
      .from("overall_leaderboard")
      .select("total_score")
      .eq("user_id", userId)
      .eq("season_id", seasonId)   // ← FIX CRITICAL: phải filter đúng mùa
      .maybeSingle();

    // Ngưỡng phải khớp CHÍNH XÁC với function grant_badge_if_eligible (badge_schema.sql)
    // để badge hiển thị cho học sinh luôn đúng với badge thật sự lưu trong DB.
    let badgeUnlocked: string | null = null;
    if (lb?.total_score != null) {
      const newTotal = lb.total_score;
      const oldTotal = newTotal - validScore; // tổng điểm TRƯỚC lần nộp này, cùng season

      if (newTotal >= 301 && oldTotal < 301) badgeUnlocked = 'Chuyên Gia Funlab';
      else if (newTotal >= 151 && oldTotal < 151) badgeUnlocked = 'Kỹ Sư Sáng Tạo';
      else if (newTotal >= 1 && oldTotal < 1) badgeUnlocked = 'Nhà Thám Hiểm Sơ Cấp';

      await supabase.rpc("grant_badge_if_eligible", {
        p_user_id: userId,
        p_total_score: newTotal,
      });
    }

    // --- STEP 5: Revalidate ---
    revalidatePath(`/episode/${episodeId}`);
    revalidatePath('/leaderboard');
    revalidatePath('/', 'layout');
    revalidatePath('/profile');

    return {
      success: true,
      message: `Chúc mừng! Bạn đạt ${validScore} điểm. Kết quả đã được ghi nhận.`,
      badgeUnlocked
    };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi không xác định.';
    return { success: false, error: msg };
  }
}
