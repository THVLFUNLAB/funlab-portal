-- 1. Tạo bảng điểm từng tập
CREATE TABLE episode_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    episode_id INT NOT NULL,
    score INT NOT NULL CHECK (score >= 0 AND score <= 50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Đảm bảo mỗi học sinh chỉ có 1 row điểm mỗi tập
    UNIQUE(user_id, episode_id)
);

-- 2. Tạo FUNCTION để xử lý logic UPSERT (Lưu điểm cao nhất)
CREATE OR REPLACE FUNCTION submit_funlab_score(
    p_user_id TEXT,
    p_episode_id INT,
    p_score INT
) RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    INSERT INTO episode_scores (user_id, episode_id, score, created_at)
    VALUES (p_user_id, p_episode_id, p_score, NOW())
    ON CONFLICT (user_id, episode_id) 
    DO UPDATE SET 
        score = EXCLUDED.score,
        created_at = EXCLUDED.created_at
    -- Cực kì quan trọng: Chỉ cập nhật nếu ghi nhận được điểm cao hơn kỉ lục cũ
    WHERE EXCLUDED.score > episode_scores.score;

    -- Kiểm tra xem có Insert/Update thành công hay không (tức là điểm mới cao hơn điểm cũ / chơi lần đầu)
    IF FOUND THEN
        result = '{"success": true, "message": "Chúc mừng! Kỷ lục điểm mới đã được thiết lập."}'::JSONB;
    ELSE
        result = '{"success": false, "message": "Điểm mới của bạn chưa vượt quá kỉ lục hiện tại."}'::JSONB;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Tạo VIEW Bảng Vàng Tổng Kết (Tính tổng từ điểm cao nhất các tập)
CREATE OR REPLACE VIEW overall_leaderboard AS
SELECT 
    user_id, 
    SUM(score) as total_score
FROM 
    episode_scores
GROUP BY 
    user_id
ORDER BY 
    total_score DESC;
