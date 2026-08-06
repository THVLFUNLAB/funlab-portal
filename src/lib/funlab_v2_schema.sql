-- ==============================================================================
-- BẢN CẬP NHẬT DATABASE SCHEMA: FUNLAB ĐA MÙA GIẢI 2026-2027
-- ==============================================================================

-- 1. BẢNG QUẢN LÝ MÙA GIẢI (SEASONS)
CREATE TABLE IF NOT EXISTS public.seasons (
    id VARCHAR(50) PRIMARY KEY, -- vd: 'season_2025_1', 'season_2026_1'
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived'
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE
);

-- Khởi tạo 2 mùa giải (Năm cũ và Năm mới)
INSERT INTO public.seasons (id, name, status) 
VALUES 
('season_2025_1', 'Năm Học 2025-2026', 'archived'),
('season_2026_1', 'Năm Học 2026-2027', 'active')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- 2. CẬP NHẬT BẢNG PROFILES (RE-ONBOARDING)
-- Cột last_season_confirmed lưu trạng thái học sinh đã xác nhận lớp cho mùa mới chưa
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_season_confirmed VARCHAR(50) DEFAULT 'season_2025_1';

-- 3. CẬP NHẬT BẢNG EPISODE_SCORES (Gắn nhãn mùa giải)
ALTER TABLE public.episode_scores
ADD COLUMN IF NOT EXISTS season_id VARCHAR(50) DEFAULT 'season_2025_1' REFERENCES public.seasons(id);

CREATE INDEX IF NOT EXISTS idx_episode_scores_season_leaderboard 
ON public.episode_scores (season_id, user_id, score DESC, time_in_seconds ASC);

-- 4. BẢNG ĐIỂM CỐNG HIẾN VIDEO (Thêm season_id)
CREATE TABLE IF NOT EXISTS public.video_contributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id INT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    bonus_score INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    season_id VARCHAR(50) DEFAULT 'season_2025_1' REFERENCES public.seasons(id),
    UNIQUE(episode_id, user_id, role, season_id)
);

-- Nếu bảng đã tồn tại, hãy thêm cột season_id bằng ALTER
ALTER TABLE public.video_contributors
ADD COLUMN IF NOT EXISTS season_id VARCHAR(50) DEFAULT 'season_2025_1' REFERENCES public.seasons(id);

-- 5. CẬP NHẬT VIEW OVERALL_LEADERBOARD TÁCH BIỆT THEO SEASON
DROP VIEW IF EXISTS public.overall_leaderboard CASCADE;

CREATE OR REPLACE VIEW public.overall_leaderboard AS
WITH game_scores AS (
    SELECT 
        user_id,
        season_id,
        SUM(score) as total_game_score
    FROM public.episode_scores
    GROUP BY user_id, season_id
),
creator_scores AS (
    SELECT
        user_id,
        season_id,
        SUM(bonus_score) as creator_hp
    FROM public.video_contributors
    GROUP BY user_id, season_id
),
combined_seasons AS (
    SELECT user_id, season_id FROM game_scores
    UNION
    SELECT user_id, season_id FROM creator_scores
)
SELECT 
    p.id AS user_id,
    cs.season_id,
    p.full_name,
    p.class_name,
    COALESCE(g.total_game_score, 0) + COALESCE(c.creator_hp, 0) AS total_score,
    COALESCE(c.creator_hp, 0) AS creator_hp,
    RANK() OVER (
        PARTITION BY cs.season_id 
        ORDER BY COALESCE(g.total_game_score, 0) + COALESCE(c.creator_hp, 0) DESC
    ) as rank
FROM public.profiles p
JOIN combined_seasons cs ON p.id = cs.user_id
LEFT JOIN game_scores g ON (p.id = g.user_id AND cs.season_id = g.season_id)
LEFT JOIN creator_scores c ON (p.id = c.user_id AND cs.season_id = c.season_id)
WHERE (COALESCE(g.total_game_score, 0) + COALESCE(c.creator_hp, 0)) > 0;
