-- ============================================================
-- Migration: Tạo bảng đăng ký Paper Roller Coaster Showdown
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS roller_coaster_registrations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name     TEXT NOT NULL,
  slogan        TEXT,
  division      TEXT NOT NULL CHECK (division IN ('A', 'B', 'C')),

  -- Đội trưởng
  leader_name   TEXT NOT NULL,
  leader_class  TEXT NOT NULL,
  leader_email  TEXT NOT NULL,
  leader_phone  TEXT,

  -- Thành viên khác (tối đa 4 người còn lại)
  member2       TEXT NOT NULL,
  member3       TEXT NOT NULL,
  member4       TEXT,
  member5       TEXT,

  agreed        BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index để kiểm tra tên đội trùng nhanh hơn
CREATE INDEX IF NOT EXISTS idx_roller_coaster_team_name
  ON roller_coaster_registrations (LOWER(team_name));

-- Cho phép đọc public (xem danh sách đội đã đăng ký)
ALTER TABLE roller_coaster_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read registrations"
  ON roller_coaster_registrations FOR SELECT
  USING (true);

-- Chỉ service role mới được INSERT (API route dùng admin client)
-- INSERT sẽ được thực hiện qua service_role key trong API route
