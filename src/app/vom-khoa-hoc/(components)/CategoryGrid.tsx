import React from 'react';

const CATEGORIES = [
  {
    id: 'hien-vi',
    title: 'Thế giới hiển vi',
    desc: 'Vi sinh vật & Cấu trúc tế bào',
    color: 'from-emerald-400/20 to-teal-500/20',
    border: 'group-hover:border-teal-400/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(20,184,166,0.35)]',
  },
  {
    id: 'hoa-hoc',
    title: 'Sắc màu Hóa học',
    desc: 'Phản ứng & Nguyên tố kỳ thú',
    color: 'from-fuchsia-400/20 to-pink-500/20',
    border: 'group-hover:border-pink-400/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(236,72,153,0.35)]',
  },
  {
    id: 'anh-sang',
    title: 'Phép màu Ánh sáng',
    desc: 'Quang học & Vật lý lượng tử',
    color: 'from-amber-400/20 to-orange-500/20',
    border: 'group-hover:border-orange-400/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(249,115,22,0.35)]',
  },
  {
    id: 'su-song',
    title: 'Mật mã Sự sống',
    desc: 'Bí ẩn ADN & Di truyền học',
    color: 'from-indigo-400/20 to-blue-500/20',
    border: 'group-hover:border-blue-400/50',
    glow: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]',
  },
];

export default function CategoryGrid() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10 lg:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 inline-block">
          Chuyên đề nổi bật
        </h2>
        <div className="h-1 w-20 bg-cyan-500 rounded-full mt-3"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id}
            className={`group relative flex flex-col justify-end h-64 md:h-80 p-6 rounded-3xl overflow-hidden cursor-pointer bg-slate-900/50 border border-slate-800 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] ${cat.border} ${cat.glow}`}
          >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
            
            <div className="relative z-10 text-left">
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                {cat.title}
              </h3>
              <p className="text-slate-300 text-sm font-medium drop-shadow-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {cat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
