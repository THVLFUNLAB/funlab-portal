import React from 'react';
import Link from 'next/link';
import { ArrowBigUp, ArrowBigDown, CheckCircle, MessageSquare, CornerDownRight, Send, Clock, Share2, AlertCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

const MOCK_QUESTION_DETAIL = {
  id: "q1",
  title: "Làm thế nào để đo gia tốc trọng trường g bằng con lắc đơn với độ chính xác cao nhất?",
  content: "Chào mọi người, nhóm mình đang làm bài tập thực hành **Bài 4: Đo gia tốc trọng trường g bằng con lắc đơn dài 1m** trên hệ thống Funlab.\n\nTuy nhiên trong quá trình thả vật nặng và bấm giờ chu kì dao động, kết quả tính toán $g$ của báo cáo luôn ra con số nhỏ hơn thực tế (khoảng 9.6 m/s² thay vì 9.8 m/s²).\n\nMọi người cho mình hỏi:\n1. Sai số hệ thống lớn nhất có thể đến từ đâu (đồng hồ bấm giây hay thước đo)?\n2. Có mẹo thao tác nào để giảm ma sát ở trụ treo không?\n3. Góc lệch ban đầu $\\alpha_0$ nên để bao nhiêu độ là tối ưu nhất cho thí nghiệm này?\n\nCảm ơn mọi người nhiều!",
  author: "Nguyễn Văn A",
  className: "10A1",
  time: "2 giờ trước",
  upvotes: 45,
  views: 128,
  tags: ["#VatLy10", "#DongLucHoc", "#ThucHanh"]
};

const MOCK_ANSWERS = [
  {
    id: "a1",
    author: "Thầy Hậu",
    role: "Giáo viên Vật Lý",
    time: "1 giờ trước",
    upvotes: 89,
    content: "Chào nhóm em! Thầy thấy rất nhiều bạn gặp lỗi tương tự bài này. Sai số trong thí nghiệm chủ yếu đến từ **góc lệch thả ban đầu** ($\\alpha_0$).\n\nĐể đúng với công thức $T = 2\\pi\\sqrt{\\frac{l}{g}}$ (chứng minh dao động điều hòa), góc lệch ban đầu bắt buộc **phải thật nhỏ (thường nhỏ hơn 10 độ)**. Nếu em thả góc 20-30 độ, con lắc sẽ trở thành dao động tuần hoàn, công thức gần đúng bị phá vỡ và sai số sẽ lập tức xuất hiện làm giảm $g$.\n\nNgoài ra, dây cần mỏng, nhẹ và trụ treo cần cố định thật chặt bằng nút thòng lọng để sợi dây không bị trượt co giãn trong lúc lắc. Chúc các em làm lại thành công nhé!",
    isAccepted: true
  },
  {
    id: "a2",
    author: "Trần Hữu B",
    role: "Lớp 10A2",
    time: "30 phút trước",
    upvotes: 5,
    content: "Nhóm tớ đợt trước cũng bị y hệt vậy nè. Cậu nhớ kiểm tra việc đo chiều dài sợi dây. Chiều dài dây $l$ không phải đo từ điểm treo đến mét trên của viên bi, mà phải đo từ điểm treo cho đến **TRỌNG TÂM** của hòn bi sắt nha.\n\nTụi mình hay đo đến đỉnh bi nên bị hụt mất tầm 1-2 cm của bán kính bi, dẫn đến bình phương lên tính g sai lệch hẳn luôn đó.",
    isAccepted: false
  }
];

export default async function ForumDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 font-sans pb-24 relative">
      {/* Nền phong cách Sci-Fi mờ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 relative z-10">
        <Link 
          href="/forum"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-medium mb-8 text-sm"
        >
          <CornerDownRight className="w-4 h-4 rotate-90" />
          Trở về Diễn đàn
        </Link>
        
        {/* MAIN QUESTION SECTION */}
        <section className="flex gap-4 md:gap-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 md:p-8 shadow-2xl mb-12">
          {/* Cột Vote bên trái */}
          <div className="flex flex-col items-center gap-2 shrink-0 pt-2">
            <button className="p-2 bg-slate-800/50 hover:bg-cyan-900/50 text-slate-400 hover:text-cyan-400 border border-transparent hover:border-cyan-500/30 rounded-xl transition-all shadow-sm">
              <ArrowBigUp className="w-8 h-8" />
            </button>
            <span className="font-extrabold text-2xl text-slate-200 my-1">{MOCK_QUESTION_DETAIL.upvotes}</span>
            <button className="p-2 bg-slate-800/50 hover:bg-red-900/50 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/30 rounded-xl transition-all shadow-sm">
              <ArrowBigDown className="w-8 h-8" />
            </button>
          </div>

          {/* Nội dung Câu hỏi */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-100 leading-tight mb-4">
              {MOCK_QUESTION_DETAIL.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-400 mb-8 border-b border-slate-800/60 pb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white uppercase opacity-90">
                  {MOCK_QUESTION_DETAIL.author.charAt(0)}
                </div>
                <span className="font-semibold text-cyan-300">{MOCK_QUESTION_DETAIL.author}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">{MOCK_QUESTION_DETAIL.className}</span>
              </div>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {MOCK_QUESTION_DETAIL.time}</span>
              <span>Đã xem: {MOCK_QUESTION_DETAIL.views}</span>
            </div>

            <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed max-w-none text-base md:text-lg mb-8" style={{ whiteSpace: 'pre-wrap' }}>
              {MOCK_QUESTION_DETAIL.content}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                {MOCK_QUESTION_DETAIL.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-sm font-mono text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm px-3 py-1.5 transition-colors font-medium">
                  <Share2 className="w-4 h-4" /> Chia sẻ
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm px-3 py-1.5 transition-colors font-medium">
                  <AlertCircle className="w-4 h-4" /> Báo cáo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ANSWERS SECTION */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              {MOCK_ANSWERS.length} Câu Trả Lời
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4"></div>
          </div>

          <div className="space-y-6">
            {MOCK_ANSWERS.map((ans) => (
              <div key={ans.id} className={`flex gap-4 md:gap-6 bg-slate-900/40 p-5 md:p-8 rounded-3xl border transition-all ${ans.isAccepted ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-slate-800'}`}>
                {/* Vote Câu trả lời */}
                <div className="flex flex-col items-center gap-1 shrink-0 pt-2">
                  <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition-colors">
                    <ArrowBigUp className="w-6 h-6" />
                  </button>
                  <span className={`font-bold text-lg ${ans.isAccepted ? 'text-green-400' : 'text-slate-300'}`}>{ans.upvotes}</span>
                  <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors">
                    <ArrowBigDown className="w-6 h-6" />
                  </button>
                  {ans.isAccepted && (
                    <div className="mt-4 flex flex-col items-center gap-1" title="Câu trả lời được duyệt">
                      <div className="bg-green-500/20 text-green-400 p-2 rounded-full border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${ans.role.includes('Giáo viên') ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-slate-700'}`}>
                        {ans.author.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-semibold text-sm ${ans.role.includes('Giáo viên') ? 'text-amber-400' : 'text-slate-200'}`}>
                          {ans.author}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{ans.role}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {ans.time}</span>
                  </div>

                  {ans.isAccepted && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-400 bg-green-950/40 border border-green-900 px-3 py-1 rounded-full mb-4">
                      Giải pháp chính xác
                    </div>
                  )}

                  <div className="prose prose-invert prose-p:text-slate-300 max-w-none text-[15px] md:text-base" style={{ whiteSpace: 'pre-wrap' }}>
                    {ans.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INPUT MỚI */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group focus-within:border-cyan-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <h3 className="text-xl font-bold text-slate-100 mb-4">Câu trả lời của bạn</h3>
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden focus-within:ring-1 focus-within:ring-cyan-500/50 focus-within:border-cyan-500/50 transition-all">
            <textarea 
              rows={5} 
              placeholder="Chia sẻ kiến thức hoặc phương pháp giải bài của bạn..." 
              className="w-full bg-transparent text-slate-200 p-4 focus:outline-none resize-y placeholder:text-slate-600"
            ></textarea>
            <div className="bg-slate-900 border-t border-slate-800 p-3 flex justify-between items-center">
              <span className="text-xs text-slate-500 px-2 font-mono">Hỗ trợ Markdown cơ bản (**in đậm**, *nghiêng*, $toán$)</span>
              <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-5 rounded-xl transition-colors text-sm shadow-[0_0_15px_rgba(8,145,178,0.4)]">
                <Send className="w-4 h-4" /> Gửi
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
