import { createClient } from '@/utils/supabase/client';

// Định nghĩa giao diện cho kết quả trả về
export interface ScoreResult {
  success: boolean;
  message?: string;
  error?: string;
  newRecord?: boolean;
}

/**
 * Gửi điểm hoàn thành tập với luật mới: Tối đa 50 điểm/tập, Lưu kỷ lục cao nhất.
 * @param userId - ID hoặc tên/định danh của người dùng
 * @param episodeId - Số thứ tự tập (ID tập)
 * @param score - Số điểm đạt được (tối đa 50)
 */
export async function submitEpisodeScore(userId: string, episodeId: number, score: number): Promise<ScoreResult> {
  const supabase = createClient();
  
  try {
    // Ràng buộc bảo vệ tối đa 50 điểm từ Client (ngoài ràng buộc DB)
    const validScore = Math.min(score, 50);

    // Gọi Remote Procedure Call (RPC) để giao cho Database xử lý atomic UPSERT logic (lưu điểm cao nhất)
    const { data, error } = await supabase
      .rpc('submit_funlab_score', {
        p_user_id: userId,
        p_episode_id: episodeId,
        p_score: validScore
      });

    if (error) {
      console.error("Lỗi gửi điểm qua RPC:", error);
      return { success: false, error: error.message };
    }

    // data lấy từ RPC trả về JSON: {"success": true/false, "message": "..."}
    if (data && data.success) {
      return { success: true, newRecord: true, message: data.message };
    } else {
      return { success: true, newRecord: false, message: data?.message || "Điểm chưa vượt kỷ lục cũ." };
    }

  } catch (err: any) {
    console.error("Lỗi hệ thống khi gửi điểm:", err);
    return { success: false, error: err.message };
  }
}

// ------------------------------------------------------------------------------------
// submitEpisodeScoreWithMeta – dùng cho các Game mới (Tập 5+)
// Nhận đầy đủ metadata: score, timeInSeconds, level (THCS/THPT)
// Thực hiện 3 tác vụ: One-shot rule, Insert live_leaderboard, Increment yearly_leaderboard
// ------------------------------------------------------------------------------------
export interface GamePayload {
  score: number;
  timeInSeconds: number;
  level: string;
  answersLog: any[];
  stemLink?: string;
}

export interface ScoreResultV2 {
  success: boolean;
  message?: string;
  error?: string;
  alreadySubmitted?: boolean;
}

export async function submitEpisodeScoreWithMeta(
  userId: string,
  episodeId: number,
  payload: GamePayload
): Promise<ScoreResultV2> {
  const supabase = createClient();

  try {
    const validScore = Math.min(payload.score, 50);

    // --- TÁC VỤ 1: Kiểm tra One-shot rule ---
    const { data: existing, error: checkError } = await supabase
      .from('episode_scores')
      .select('id')
      .eq('user_id', userId)
      .eq('episode_id', episodeId)
      .maybeSingle();

    if (checkError) {
      console.error('Lỗi kiểm tra dữ liệu cũ:', checkError);
      return { success: false, error: checkError.message };
    }

    if (existing) {
      return {
        success: false,
        alreadySubmitted: true,
        error: `Bạn đã nộp điểm cho Tập ${episodeId} rồi. Hệ thống chỉ cho phép nộp 1 lần.`,
      };
    }

    // --- TÁC VỤ 2: Insert vào episode_scores ---
    const { error: insertError } = await supabase
      .from('episode_scores')
      .insert({
        user_id: userId,
        episode_id: episodeId,
        score: validScore,
        time_in_seconds: payload.timeInSeconds,
        level: payload.level,
        answers_log: payload.answersLog,
      });

    if (insertError) {
      console.error('Lỗi insert live_leaderboard:', insertError);
      return { success: false, error: insertError.message };
    }

    // --- TÁC VỤ 3: Cộng dồn vào yearly_leaderboard ---
    // Thử upsert: nếu user chưa có row thì tạo mới với score, ngược lại cộng dồn qua RPC
    const { error: yearlyError } = await supabase
      .rpc('increment_yearly_score', {
        p_user_id: userId,
        p_score: validScore,
      });

    if (yearlyError) {
      console.error('Lỗi cập nhật yearly_leaderboard:', yearlyError);
      // Không rollback, chỉ cảnh báo – live_leaderboard đã lưu thành công
      return {
        success: true,
        message: `Đã lưu điểm Tập ${episodeId} (${validScore} điểm) nhưng BXH Năm chưa cập nhật được. Vui lòng liên hệ Admin.`,
      };
    }

    return {
      success: true,
      message: `Hoàn thành! Đã lưu ${validScore} điểm cho Tập ${episodeId} và cập nhật BXH Năm.`,
    };

  } catch (err: any) {
    console.error('Lỗi hệ thống submitEpisodeScoreWithMeta:', err);
    return { success: false, error: err.message };
  }
}
