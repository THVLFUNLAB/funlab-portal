-- Thêm các cột mới vào bảng episode_scores
ALTER TABLE public.episode_scores
ADD COLUMN IF NOT EXISTS time_in_seconds INT,
ADD COLUMN IF NOT EXISTS level TEXT,
ADD COLUMN IF NOT EXISTS answers_log JSONB;

-- Gỡ bỏ Foreign Key để cho phép lưu điểm của Khách (người chưa đăng nhập) vào Từng Tập
-- Bỏ qua lỗi nếu constraint không tồn tại bằng cờ IF EXISTS (tùy cú pháp PostgreSQL)
ALTER TABLE public.episode_scores
DROP CONSTRAINT IF EXISTS episode_scores_user_id_fkey;

-- Gỡ luôn khóa ở Bảng Vàng (Năm) để Khách cũng được cộng điểm dài hạn
ALTER TABLE public.yearly_leaderboard
DROP CONSTRAINT IF EXISTS yearly_leaderboard_user_id_fkey;
