-- ============================================================
-- P3-05: USER BADGES TABLE
-- Lưu huy hiệu của học sinh vào DB — bền vững, không mất khi
-- clear cache, có thể hiển thị trên profile & leaderboard
-- ============================================================

CREATE TABLE IF NOT EXISTS user_badges (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id    TEXT NOT NULL,             -- 'explorer' | 'engineer' | 'master' | 'special'
  badge_label TEXT NOT NULL,             -- Tên hiển thị
  badge_icon  TEXT NOT NULL DEFAULT '🎖️',
  granted_at  TIMESTAMPTZ DEFAULT NOW(),
  granted_by  TEXT DEFAULT 'system',    -- 'system' hoặc 'admin'
  note        TEXT,                      -- Ghi chú từ admin (nếu cấp thủ công)
  UNIQUE (user_id, badge_id)            -- Mỗi user chỉ có 1 badge cùng loại
);

-- RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Học sinh tự đọc badge của mình
CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

-- System (service role) hoặc admin ghi badge
CREATE POLICY "Service role can manage badges"
  ON user_badges FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index để query nhanh
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);

-- ============================================================
-- Function: tự động cấp badge khi đạt mốc điểm
-- Được gọi từ Server Action sau khi lưu điểm
-- ============================================================
CREATE OR REPLACE FUNCTION grant_badge_if_eligible(
  p_user_id UUID,
  p_total_score INTEGER
) RETURNS TEXT AS $$
DECLARE
  v_badge_id    TEXT;
  v_badge_label TEXT;
  v_badge_icon  TEXT;
BEGIN
  -- Xác định badge phù hợp nhất
  IF p_total_score >= 301 THEN
    v_badge_id    := 'master';
    v_badge_label := 'Chuyên Gia Funlab';
    v_badge_icon  := '🏆';
  ELSIF p_total_score >= 151 THEN
    v_badge_id    := 'engineer';
    v_badge_label := 'Kỹ Sư Sáng Tạo';
    v_badge_icon  := '⚡';
  ELSIF p_total_score >= 1 THEN
    v_badge_id    := 'explorer';
    v_badge_label := 'Nhà Thám Hiểm Sơ Cấp';
    v_badge_icon  := '🔭';
  ELSE
    RETURN NULL;
  END IF;

  -- Upsert — nếu đã có badge thì không làm gì, nếu chưa thì thêm
  INSERT INTO user_badges (user_id, badge_id, badge_label, badge_icon, granted_by)
  VALUES (p_user_id, v_badge_id, v_badge_label, v_badge_icon, 'system')
  ON CONFLICT (user_id, badge_id) DO NOTHING;

  RETURN v_badge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
