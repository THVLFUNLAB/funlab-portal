import React from 'react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  // Vì là Mock nên ta sẽ hiển thị chung cho mọi slug
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto space-y-12">
      <div className="space-y-6">
        <Link 
          href="/vom-khoa-hoc"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium border border-cyan-400/20 px-4 py-2 rounded-full hover:bg-cyan-400/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Trở về Vòm Khoa học
        </Link>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-tight">
          Chi tiết Sản phẩm: <span className="capitalize">{slug.replace(/-/g, ' ')}</span>
        </h1>
        
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white border border-cyan-700">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Tác giả ẩn danh</p>
              <p className="text-xs">Chuyên mục: Khoa học chung</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <span className="text-sm tracking-wider text-cyan-500 font-semibold">28/03/2026</span>
        </div>
      </div>
      
      <div className="aspect-[21/9] w-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" 
          alt="Cover"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
        />
        <div className="absolute bottom-6 left-6 z-20 text-slate-300 italic text-sm">
          Ảnh minh họa Vũ trụ - Bầu trời đêm
        </div>
      </div>
      
      <div className="prose prose-invert prose-cyan max-w-none prose-lg">
        <p className="lead text-xl text-slate-300 leading-relaxed font-light">
          Đây là nội dung mô phỏng cho sản phẩm bài viết. Trong thực tế, nội dung này sẽ được tải về từ cơ sở dữ liệu dựa trên đường dẫn hiện tại (<code>/vom-khoa-hoc/{slug}</code>).
        </p>
        
        <h2 className="text-2xl font-bold text-slate-100 mt-10 mb-4 inline-block relative">
          Khám phá Không gian
          <div className="h-1 w-1/2 bg-gradient-to-r from-cyan-500 to-transparent mt-2 rounded-full"></div>
        </h2>
        
        <p className="text-slate-400 mb-6 leading-loose">
          Mô hình và tư duy khoa học luôn thay đổi theo năm tháng. Nếu chúng ta chỉ đứng yên một chỗ, bầu trời đêm trên kia vĩnh viễn là một bức tranh tĩnh lặng không màu sắc. Bằng cách khám phá, ta liên tục bóc tách từng lớp sương mù của vũ trụ này.
        </p>
        
        <div className="bg-slate-900/50 border border-cyan-500/20 rounded-2xl p-8 my-10 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <p className="font-semibold text-lg text-slate-200 italic m-0 relative z-10">
            "Sức mạnh của khoa học không phải là cung cấp câu trả lời tuyệt đối, mà là liên tục đặt ra những câu hỏi sâu sắc hơn về thế giới xung quanh chúng ta."
          </p>
        </div>
        
        <h3 className="text-xl font-bold text-slate-100 mt-8 mb-4">Các điểm chính trong nghiên cứu</h3>
        <ul className="list-disc pl-6 text-slate-400 space-y-2 marker:text-cyan-500">
          <li>Nghiên cứu cấu trúc và nguyên lý vận hành cơ bản.</li>
          <li>Xây dựng mô hình 3D cho các phân tử và cấu trúc phức tạp.</li>
          <li>Đánh giá rủi ro và mô phỏng thực tiễn bằng máy tính.</li>
        </ul>
      </div>
      
      <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center">
        <p className="text-slate-500 text-sm">Cập nhật lần cuối: Hôm nay</p>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
          </svg>
          Chia sẻ
        </button>
      </div>
    </div>
  );
}
