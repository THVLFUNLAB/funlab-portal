-- Thêm Tập 7 vào bảng episodes để hiện thị trên Dashboard Admin và Web học sinh
INSERT INTO public.episodes (id, title, description, thumbnail_url, video_url, is_active)
VALUES (
    7, 
    'TẬP 7: CHIẾN DỊCH CỨU HỎA - PHÙ THỦY HÓA HỌC', 
    'Khám phá phản ứng hóa học giữa Baking Soda và Giấm để tạo ra "Chiếc bơm tàng hình" và dập tắt đám cháy.',
    '', -- Thầy có thể cập nhật ảnh thumbnail sau trong Admin
    'https://www.youtube.com/watch?v=RACbCcHf', 
    true
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    video_url = EXCLUDED.video_url;
