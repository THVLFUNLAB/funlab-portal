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
    const validScore = Math.min(payload.score, 50);

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

    // --- STEP 2: Insert into episode_scores ---
    const { error: insertError } = await supabase
      .from('episode_scores')
      .insert({
        user_id: userId,
        episode_id: episodeId,
        score: validScore,
        time_in_seconds: payload.timeInSeconds,
        level: payload.level,
        answers_log: payload.answersLog,
        stem_link: payload.stemLink
      });

    if (insertError) {
      console.error('Insert Error:', insertError);
      return { success: false, error: `Lỗi DB: ${insertError.message || insertError.details || JSON.stringify(insertError)}` };
    }

    // --- STEP 3: Increment yearly_leaderboard ---
    const { error: rpcError } = await supabase.rpc('increment_yearly_score', {
      p_user_id: userId,
      p_score: validScore
    });

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      // We don't fail the whole action if yearly update fails, but we should log it.
      // The individual episode score IS saved.
      return { 
        success: true, 
        message: 'Điểm tập đã lưu, nhưng có lỗi khi cộng dồn vào BXH Năm.' 
      };
    }

    // --- STEP 4: Tự động cấp Badge nếu đủ điều kiện [P3-05] ---
    // Lấy tổng điểm mới nhất từ overall_leaderboard
    const { data: lb } = await supabase
      .from("overall_leaderboard")
      .select("total_score")
      .eq("user_id", userId)
      .maybeSingle();

    if (lb?.total_score != null) {
      // Gọi DB function để cấp badge (upsert — an toàn khi gọi nhiều lần)
      await supabase.rpc("grant_badge_if_eligible", {
        p_user_id: userId,
        p_total_score: lb.total_score,
      });
    }

    // --- STEP 5: Revalidate ---
    revalidatePath(`/episode/${episodeId}`);
    revalidatePath('/leaderboard');
    revalidatePath('/', 'layout');
    revalidatePath('/profile');

    return {
      success: true,
      message: `Chúc mừng! Bạn đạt ${validScore} điểm. Kết quả đã được ghi nhận.`
    };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi không xác định.';
    return { success: false, error: msg };
  }
}
