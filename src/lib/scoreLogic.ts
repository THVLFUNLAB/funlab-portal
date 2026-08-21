// ------------------------------------------------------------------------------------
// LƯU Ý (audit 2026-08-21): file này trước đây có 2 hàm `submitEpisodeScore` và
// `submitEpisodeScoreWithMeta` — cả hai đã được xác nhận KHÔNG còn được gọi ở bất kỳ
// đâu trong codebase (grep toàn repo ra 0 kết quả gọi thực tế, chỉ còn 1 import chết ở
// episode/[id]/page.tsx, đã xóa import đó luôn). Pipeline hiện tại nộp điểm 100% qua
// `saveGameScore()` trong `src/app/actions/gameActions.ts`, có lookup season_id đúng
// và filter theo mùa. Xóa hẳn 2 hàm cũ để tránh ai vô tình gọi lại nhánh insert thiếu
// season_id đúng (bug #3 trong bản audit). Chỉ giữ lại 2 type dưới đây vì
// gameActions.ts đang import chúng.
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
  /** Tên badge vừa được mở khóa trong lần nộp điểm này (null nếu không có). */
  badgeUnlocked?: string | null;
}
