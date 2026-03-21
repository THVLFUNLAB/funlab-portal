-- 1. Create live_leaderboard table for granular score tracking
-- (episode_scores already exists but doesn't have time/level)
CREATE TABLE IF NOT EXISTS public.live_leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    episode_id INT NOT NULL,
    score INT NOT NULL CHECK (score >= 0 AND score <= 50),
    time_in_seconds INT,
    level TEXT, -- THCS / THPT
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Rule: 1 submission per episode per user
    UNIQUE(user_id, episode_id)
);

-- Enable RLS for live_leaderboard
ALTER TABLE public.live_leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view live_leaderboard" ON live_leaderboard FOR SELECT USING (true);
CREATE POLICY "Users can insert their own scores once" ON live_leaderboard FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Create yearly_leaderboard table for accumulated scores
CREATE TABLE IF NOT EXISTS public.yearly_leaderboard (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    total_score INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for yearly_leaderboard
ALTER TABLE public.yearly_leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view yearly_leaderboard" ON yearly_leaderboard FOR SELECT USING (true);

-- 3. Create increment_yearly_score RPC function
-- This allows atomic updates to the total score
CREATE OR REPLACE FUNCTION public.increment_yearly_score(
    p_user_id UUID,
    p_score INT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.yearly_leaderboard (user_id, total_score, updated_at)
    VALUES (p_user_id, p_score, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET 
        total_score = yearly_leaderboard.total_score + EXCLUDED.total_score,
        updated_at = NOW();
END;
$$;
