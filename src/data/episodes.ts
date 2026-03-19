export interface QuizQuestion {
  q: string;
  opt0: string;
  opt1: string;
  opt2: string;
  ans: 'A' | 'B' | 'C';
  explain: string;
  penalty: string;
}

export interface Episode {
  id: number;
  title: string;
  duration: string;
  desc: string;
  youtubeId: string;
  quizList: QuizQuestion[];
  canvasUrl?: string;
}

export const episodes: Episode[] = [
  {
    id: 1,
    title: "Tập 1 - GIỚI THIỆU VỀ FUNLAB CHALLENGE",
    duration: "12 phút",
    desc: "Giới thiệu về chương trình và hệ thống huy hiệu",
    youtubeId: "RACbCcHf",
    quizList: [
      {
        q: "Nếu thay nước nóng bằng nước lạnh trong thí nghiệm trứng chui chai, hiện tượng gì sẽ xảy ra?",
        opt0: "Trứng chui vào nhanh hơn",
        opt1: "Trứng không chui vào",
        opt2: "Không có gì thay đổi",
        ans: "B",
        explain: "Nước lạnh sẽ làm áp suất bên trong chai giảm chậm hoặc không đổi. Do đó lực hút chênh lệch áp suất không được tạo ra, và trứng không bị hút vào chai.",
        penalty: "Thí nghiệm Trứng chui chai cần sự chênh lệch áp suất bằng cách làm không khí nóng lên rồi lạnh đi."
      }
    ]
  },
  {
    id: 2,
    title: "TẬP 2: ÁP SUẤT CHẤT RẮN",
    duration: " phút",
    desc: "Bí mật đằng sau áp suất chất rắn",
    youtubeId: "2e2QNlARDVc",
    quizList: [
      {
        q: "Từ trường dọc theo Trái Đất thường tập trung sức định hướng từ tính lớn nhất ở khu vực nào?",
        opt0: "Khu vực Biển xích đạo",
        opt1: "Hai Cực từ (Bắc và Nam)",
        opt2: "Sâu trong Lõi Trái Đất",
        ans: "B",
        explain: "Các đường sức từ bao quanh Trái Đất hội tụ và tập trung dày đặc nhất ở hai cực từ (Bắc và Nam).",
        penalty: "Từ trường Trái Đất không phân bố đều. Hãy nhớ lại bài học về các đường sức từ vòng quanh trái đất tụ lại ở đâu nhé!"
      }
    ]
  },
  {
    id: 3,
    title: "TẬP 3  - FUNLAB - VIDEO TỔNG HỢP VÒNG 2 - OLYMPIC KHOA HỌC 2025",
    duration: "14 phút",
    desc: "Thử thách bẻ cong đường đi của ánh sáng qua khúc xạ.",
    youtubeId: "4vprfBeDNjg",
    quizList: [
      {
        q: "Hiện tượng khúc xạ ánh sáng (bẻ cong hướng truyền) sẽ xảy ra rõ rệt nhất khi nào?",
        opt0: "Khi truyền qua môi trường đồng tính trong suốt",
        opt1: "Khi ánh sáng đi qua mặt phân cách 2 môi trường có chiết suất khác nhau",
        opt2: "Khi tia sáng bị hấp thụ hoàn toàn vào vật thể",
        ans: "B",
        explain: "Sự thay đổi tốc độ truyền sáng khi đi qua mặt phân cách giữa hai môi trường (như từ không khí vào nước) làm tia sáng bị bẻ cong hướng.",
        penalty: "Ánh sáng chỉ 'đổi hướng' (khúc xạ) khi gặp một môi trường thay đổi tính chất vật lý. Thử chọn lại xem!"
      }
    ]
  },
  {
    id: 4,
    title: "TẬP 4: PHẢN ỨNG CHÁY - PHÁO HOA",
    duration: "16 phút",
    desc: "Phản ứng cháy - Màu sắc pháo hoa",
    youtubeId: "IsZx5BNChZY",
    quizList: [
      {
        q: "Chất khí nào được tạo ra góp phần làm núi lửa 'phun trào' mãnh liệt trong thí nghiệm Giấm kết hợp Bột nở?",
        opt0: "Khí Oxy (O2)",
        opt1: "Khí Cacbonic (CO2)",
        opt2: "Khí Hydro (H2)",
        ans: "B",
        explain: "Phản ứng hóa học giữa axit (giấm) và bazơ (bột nở) lập tức giải phóng bọt khí CO2 với thể tích lớn tạo hiện tượng trào bọt.",
        penalty: "Giấm và bột nở phản ứng với nhau để giải phóng một loại khí rất phổ biến trong nướng bánh giúp bánh xốp. Hãy nghĩ lại nhé!"
      }
    ]
  },
  {
    id: 5,
    title: "TẬP 5 FUNLAB - GIẢI MÃ BÍ ẨN CƠ THỂ NGƯỜI QUA LĂNG KÍNH VẬT LÝ",
    duration: "11 phút",
    desc: "Cơ thể chúng ta qua Vật lý sẽ như thế nào?",
    youtubeId: "vPHBAeEsQls",
    quizList: [
      {
        q: "Loại ma sát nào thực sự vô hình đóng vai trò giúp chúng ta có thể vững bước tiến lên phía trước mặt đất mà không bị tuột ngã?",
        opt0: "Ma sát Trượt",
        opt1: "Ma sát Lăn",
        opt2: "Ma sát Nghỉ",
        ans: "C",
        explain: "Ma sát nghỉ đóng vai trò điểm tựa, giữ cho bàn chân không bị trượt về phía sau khi chúng ta tạo lực đẩy cơ thể về phía trước.",
        penalty: "Mặc dù ta nhấc chân lên di chuyển liên tục, nhưng trong chính khoảnh khắc vô hình chạm đất, lực nào ngăn chân tuột đi?"
      }
    ]
  },
  {
    id: 6,
    title: 'FUNLAB TẬP 6 - AI ĐÃ BÓP NÁT CHIẾC LON NÀY ? - BÍ MẬT "BÀN TAY TÀNG HÌNH"',
    duration: "6 phút",
    desc: "Bí mật về áp suất khí quyển",
    youtubeId: "Ln034qg0c20",
    quizList: [
      {
        q: "Để tạo ra dòng điện cảm ứng thắp sáng bóng đèn trong một cuộn dây dẫn, ta bắt buộc phải cung cấp tác động gì?",
        opt0: "Luồn khối nam châm chuyển động liên tục quanh cuộn dây",
        opt1: "Đặt khối nam châm tiếp xúc đứng yên khít vào cuộn dây",
        opt2: "Nung nóng đoạn dây điện để đánh thức Electron",
        ans: "A",
        explain: "Chỉ khi có sự biến thiên (thay đổi luân phiên) của từ thông xuyên qua tiết diện cuộn dây mới sản sinh ra hiện tượng cảm ứng điện từ.",
        penalty: "Lực từ của nam châm rất quan trọng, nhưng năng lượng điện đòi hỏi một yếu tố không thể thiếu: động năng (sự di chuyển)!"
      }
    ]
  }
];
