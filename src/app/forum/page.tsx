import React from 'react';
import Link from 'next/link';
import { Search, Plus, MessageSquare, Filter, Clock, Flame, CheckCircle, ArrowBigUp } from 'lucide-react';

const MOCK_QUESTIONS = [
  {
    id: "q1",
    title: "Làm thế nào để đo gia tốc trọng trường g bằng con lắc đơn với độ chính xác cao nhất?",
    excerpt: "Nhóm mình đang làm bài tập thực hành về con lắc đơn nhưng kết quả g cứ ra khoảng 9.6 thay vì 9.8. Mọi người có mẹo nào giảm sai số do lực cản không khí hoặc xác định góc lệch chuẩn không?",
    author: "Nguyễn Văn A",
    time: "2 giờ trước",
    upvotes: 45,
    answers: 5,
    tags: ["#VatLy10", "#DongLucHoc", "#ThucHanh"],
    isResolved: true
  },
  {
    id: "q2",
    title: "Phản ứng giữa KMnO4 và H2O2 trong môi trường axit sinh ra khí gì?",
    excerpt: "Khi pha thuốc tím với Oxi già có nhỏ thêm vài giọt H2SO4 loãng thì thấy bọt khí sủi lên rất mạnh. Hiện tượng này màu dung dịch chuyển như thế nào và phương trình ion rút gọn viết sao ạ?",
    author: "Trần Hữu B",
    time: "Hôm qua",
    upvotes: 120,
    answers: 12,
    tags: ["#HoaHoc11", "#OxiHoaKhu", "#VomKhoaHoc"],
    isResolved: false
  },
  {
    id: "q3",
    title: "Giải thích hiện tượng Nhiễu xạ ánh sáng qua khe Young theo cách đơn giản?",
    excerpt: "Mình đọc sách giáo khoa nhưng vẫn hơi khó hình dung về vân sáng và vân tối giao thoa. Có bạn nào biết cách làm thí nghiệm mô phỏng tại nhà bằng đèn Laser hoặc vật dụng tiện lợi dễ kiếm không?",
    author: "Lê Thị C",
    time: "3 ngày trước",
    upvotes: 8,
    answers: 0,
    tags: ["#VatLy12", "#QuangHoc", "#ThiNghiem"],
    isResolved: false
  }
];

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 font-sans pb-24 relative overflow-hidden">
      {/* Nền phong cách Sci-Fi */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 relative z-10">
        {/* HEADER FORUM */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-800/60 pb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 drop-shadow-sm uppercase">
              Cộng Đồng Khoa Học
            </h1>
            <p className="text-cyan-400 mt-2 font-medium tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
              Nơi giải đáp mọi thắc mắc từ Funlab
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-full font-bold text-white tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1">
            <Plus className="w-5 h-5" /> Tạo câu hỏi mới
          </button>
        </header>

        {/* SEARCH & FILTER */}
        <section className="flex flex-col lg:flex-row gap-4 mb-10 w-full">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm câu hỏi, vấn đề, từ khóa..." 
              className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 text-sm md:text-base rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 backdrop-blur-md transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
            <button className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-800/60 font-medium whitespace-nowrap hover:bg-cyan-900/60 transition-colors cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <Clock className="w-4 h-4" /> Mới nhất
            </button>
            <button className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3 rounded-xl bg-slate-900/50 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-600 font-medium whitespace-nowrap transition-colors cursor-pointer">
              <Flame className="w-4 h-4 text-orange-400" /> Phổ biến
            </button>
            <button className="flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3 rounded-xl bg-slate-900/50 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-600 font-medium whitespace-nowrap transition-colors cursor-pointer">
              <Filter className="w-4 h-4" /> Chưa trả lời
            </button>
          </div>
        </section>

        {/* QUESTION LIST */}
        <section className="space-y-5">
          {MOCK_QUESTIONS.map(q => (
            <Link key={q.id} href={`/forum/${q.id}`} className="block group">
              <div className="flex flex-col sm:flex-row gap-5 bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-5 md:p-6 rounded-3xl hover:bg-slate-800/40 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(34,211,238,0.05)] cursor-pointer">
                
                {/* Cột trái: Stats (Upvote & Answer) */}
                <div className="flex sm:flex-col items-center sm:items-end justify-start gap-4 sm:gap-3 sm:w-28 shrink-0 py-1">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/50 text-slate-300 min-w-[60px] border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                    <ArrowBigUp className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors mb-0.5" />
                    <span className="font-bold text-lg leading-none">{q.upvotes}</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[60px] border ${q.isResolved ? 'bg-green-950/30 text-green-400 border-green-900/50' : q.answers > 0 ? 'bg-slate-800/50 text-slate-300 border-slate-700/50' : 'bg-transparent text-slate-500 border-slate-800/50'}`}>
                    {q.isResolved ? <CheckCircle className="w-5 h-5 mb-1" /> : <MessageSquare className="w-5 h-5 mb-1" />}
                    <span className="font-semibold text-sm leading-none">{q.answers}</span>
                  </div>
                </div>

                {/* Cột phải: Content */}
                <div className="flex-1 min-w-0 flex flex-col pt-1">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight mb-2 line-clamp-2">
                    {q.title}
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
                    {q.excerpt}
                  </p>
                  
                  <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-800/50">
                    <div className="flex flex-wrap items-center gap-2">
                      {q.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-slate-500 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {q.author.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-300">{q.author}</span>
                      </div>
                      <span>•</span>
                      <span>{q.time}</span>
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </section>

      </div>
    </div>
  );
}
