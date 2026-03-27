-- Thêm cột stem_link vào bảng episode_scores để lưu minh chứng dự án STEM
ALTER TABLE public.episode_scores
ADD COLUMN IF NOT EXISTS stem_link TEXT;

-- Ghi chú: Cột này sẽ lưu link (Google Drive, Youtube, Facebook...) của học sinh nộp cho Tập 7
COMMENT ON COLUMN public.episode_scores.stem_link IS 'Đường link minh chứng dự án STEM (Xe đua phản lực) của học sinh';
