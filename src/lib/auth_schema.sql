-- XÓA BẢNG / VIEW CŨ (Vì bạn vừa chạy script clear xác nhận chưa có DB, đây là lúc tạo lại chuẩn xác nhất)
DROP VIEW IF EXISTS overall_leaderboard;
DROP FUNCTION IF EXISTS submit_funlab_score(text, integer, integer);
DROP TABLE IF EXISTS episode_scores;
DROP TABLE IF EXISTS profiles;

-- 1. TẠO BẢNG PROFILES ĐỂ CHỨA THÔNG TIN SĨ TỬ TIẾNG VIỆT
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  class_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảo mật Row Level Security (RLS) để ngừa User khác có thể phá phách sửa dữ liệu
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cho phép tất cả đọc profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Cho phép tạo profile cá nhân" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Chỉ tài khoản chính chủ mới được sửa thông tin của mình" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. TRIGGER TỰ ĐỘNG TẠO DÒNG Ở BẢNG PROFILES NGAY KHI VỪA DUYỆT ĐĂNG KÝ
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gửi "Tai nghe" lắng nghe sự kiện Đăng ký trên Database
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. TẠO LẠI BẢNG ĐIỂM (Liên kết Chặt Chẽ với UID Auth)
CREATE TABLE episode_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    episode_id INT NOT NULL,
    score INT NOT NULL CHECK (score >= 0 AND score <= 50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Đảm bảo mỗi học sinh chỉ có 1 row điểm mỗi tập (Cần thiết cho UPSERT lưu điểm cao nhất)
    UNIQUE(user_id, episode_id)
);

-- RLS Bảng Điểm 
ALTER TABLE episode_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ai cũng có thể xem Bảng Xếp Hạng" ON episode_scores FOR SELECT USING (true);
CREATE POLICY "Học sinh tự gửi điểm thi của mình" ON episode_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Học sinh tự cập nhật kỷ lục mới" ON episode_scores FOR UPDATE USING (auth.uid() = user_id);


-- 4. FUNCTION GHI NHẬN ĐIỂM KỶ LỤC CỦA TỪNG TẬP THEO CHUẨN UUID MỚI
CREATE OR REPLACE FUNCTION submit_funlab_score(
    p_user_id UUID,
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

    -- IF FOUND = Đúng, có nghĩa Record đã được tạo mới hoàn toàn hoặc cập nhật vượt kỷ lục cũ
    IF FOUND THEN
        result = '{"success": true, "message": "Chúc mừng! Kỷ lục điểm mới đã được thiết lập."}'::JSONB;
    ELSE
        result = '{"success": false, "message": "Điểm mới của bạn chưa vượt quá kỉ lục hiện tại."}'::JSONB;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;


-- 5. VIEW BẢNG VÀNG NĂM HỌC (Phiên bản Upgrade: Nối Bảng Profiles để lấy Tên thật và Lớp)
CREATE OR REPLACE VIEW overall_leaderboard AS
SELECT 
    p.id as user_id, 
    p.full_name,
    p.class_name,
    p.avatar_url,
    SUM(e.score) as total_score
FROM 
    episode_scores e
JOIN profiles p ON e.user_id = p.id
GROUP BY 
    p.id, p.full_name, p.class_name, p.avatar_url
ORDER BY 
    total_score DESC;
