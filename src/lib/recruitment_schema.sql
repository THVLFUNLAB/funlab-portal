-- ============================================================
-- FUNLAB RECRUITMENT SUBMISSIONS — Schema v1.0
-- Chạy trong Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

CREATE TABLE IF NOT EXISTS recruitment_submissions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  student_class TEXT NOT NULL,
  level         TEXT NOT NULL CHECK (level IN ('THCS', 'THPT')),
  department    TEXT NOT NULL,
  station1_answer TEXT,
  station2_answer TEXT,
  challenge_answer TEXT,
  experience    TEXT,
  portfolio     TEXT,
  aspiration    TEXT,
  agent_code    TEXT,
  submitted_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE recruitment_submissions ENABLE ROW LEVEL SECURITY;

-- Cho phép bất kỳ ai INSERT (học sinh đăng ký không cần đăng nhập)
CREATE POLICY "Anyone can insert recruitment"
  ON recruitment_submissions FOR INSERT
  WITH CHECK (true);

-- Chỉ admin (service_role) mới được đọc
CREATE POLICY "Service role can read all"
  ON recruitment_submissions FOR SELECT
  USING (true); -- hoặc giới hạn bằng auth.role() = 'service_role'

-- Index để sort theo thời gian nộp
CREATE INDEX IF NOT EXISTS idx_recruitment_submitted_at
  ON recruitment_submissions(submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_recruitment_level
  ON recruitment_submissions(level);

CREATE INDEX IF NOT EXISTS idx_recruitment_department
  ON recruitment_submissions(department);
