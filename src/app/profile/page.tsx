import React from 'react';

// --- MOCK DATA ---
const STUDENT_MOCK_DATA = {
  name: "Nguyễn Văn A",
  class: "10A1",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150",
  rank: "Nhà khoa học tập sự",
  level: 5,
  currentXP: 450,
  maxXP: 1000,
  badges: [
    {
      id: "1",
      icon: "🏆",
      name: "Quán quân Động lực học",
      date: "12/03/2026",
      color: "from-amber-400 to-orange-600"
    },
    {
      id: "2",
      icon: "🦉",
      name: "Cú đêm chăm chỉ",
      date: "15/03/2026",
      color: "from-purple-400 to-indigo-600"
    },
    {
      id: "3",
      icon: "🔬",
      name: "Thành viên Vòm Khoa Học",
      date: "20/03/2026",
      color: "from-cyan-400 to-blue-600"
    }
  ],
  activities: [
    {
      id: "a1",
      title: "Đã hoàn thành chặng: Tập 1 - Sức mạnh Khí quyển",
      time: "2 giờ trước",
      type: "game" 
    },
    {
      id: "a2",
      title: "Đã đặt câu hỏi: Lực hấp dẫn hoạt động ra sao trong môi trường chân không ngoài vũ trụ?",
      time: "Hôm qua",
      type: "forum"
    },
    {
      id: "a3",
      title: "Đạt điểm tuyệt đối: Chọn đúng 10/10 câu hỏi Trắc nghiệm Nhanh",
      time: "3 ngày trước",
      type: "quiz"
    }
  ]
};

export default function StudentProfilePage() {
  const xpPercentage = (STUDENT_MOCK_DATA.currentXP / STUDENT_MOCK_DATA.maxXP) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 pt-24 pb-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/10 blur-[120px] rounded-full"></div>
        {/* Lớp nền nhiễu nhẹ tạo cảm giác không gian thực */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* HEADER & AVATAR SECTION */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/50 backdrop-blur-xl shadow-2xl">
          <div className="relative group shrink-0">
            {/* Glow effect behind avatar */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <img 
              src={STUDENT_MOCK_DATA.avatar} 
              alt={STUDENT_MOCK_DATA.name} 
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-900 shadow-xl"
            />
            {/* Level Badge */}
            <div className="absolute bottom-0 right-0 md:bottom-2 md:right-2 bg-slate-900 border border-cyan-500 rounded-full w-12 h-12 flex items-center justify-center text-cyan-400 font-bold text-base shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10">
              L{STUDENT_MOCK_DATA.level}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left md:mt-2 space-y-4 w-full">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                {STUDENT_MOCK_DATA.name}
              </h1>
              <p className="text-lg md:text-xl text-cyan-400 font-medium tracking-wide mt-2">
                {STUDENT_MOCK_DATA.rank} <span className="text-slate-600 mx-2">|</span> <span className="text-slate-300">Lớp {STUDENT_MOCK_DATA.class}</span>
              </p>
            </div>

            {/* XP PROGRESS BAR */}
            <div className="pt-4 max-w-lg mx-auto md:mx-0 w-full">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-300 uppercase tracking-widest text-xs">Kinh nghiệm (XP)</span>
                <span className="text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full text-xs border border-cyan-900/50">{STUDENT_MOCK_DATA.currentXP} / {STUDENT_MOCK_DATA.maxXP} XP</span>
              </div>
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full relative transition-all duration-1000 ease-out"
                  style={{ width: `${xpPercentage}%` }}
                >
                  {/* Dynamic stripes effect */}
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripes_1s_linear_infinite]"></div>
                  {/* Glowing end notch */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-full bg-cyan-300 blur-[4px] rounded-full"></div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="text-cyan-500/70">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
                Cần thêm <strong className="text-slate-300">{STUDENT_MOCK_DATA.maxXP - STUDENT_MOCK_DATA.currentXP} XP</strong> để lên cấp độ tiếp theo
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM HALF: BADGES & ACTIVITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* BADGES SHOWCASE - KOL 4 CỘT BÊN TRÁI */}
          <section className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-100">Kho báu Huy hiệu</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {STUDENT_MOCK_DATA.badges.map(badge => (
                <div key={badge.id} className="flex items-center gap-4 bg-slate-900/30 border border-slate-800 p-4 rounded-2xl hover:bg-slate-800/60 transition-all duration-300 hover:border-slate-700/80 group cursor-default">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${badge.color} text-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300 border border-white/10 shrink-0`}>
                    <span className="drop-shadow-md">{badge.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors truncate">{badge.name}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium bg-slate-950/50 inline-block px-2 py-0.5 rounded">Đạt: {badge.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RECENT ACTIVITY - KOL 8 CỘT BÊN PHẢI */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-100">Lịch sử Hoạt động</h2>
              </div>
              <span className="text-xs font-semibold text-cyan-500 tracking-wider uppercase px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                Gần đây
              </span>
            </div>

            <div className="relative border-l-2 border-slate-800/60 ml-5 pl-8 space-y-8 py-2">
              {STUDENT_MOCK_DATA.activities.map((activity, index) => (
                <div key={activity.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-500 group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300 z-10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:bg-slate-900 transition-colors"></div>
                  </div>
                  
                  <div className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-2xl backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-700/80 transition-all shadow-sm hover:shadow-lg">
                    <p className="font-semibold text-lg text-slate-200 leading-relaxed group-hover:text-cyan-50 transition-colors">
                      {activity.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {activity.time}
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700/80"></div>
                      <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50 uppercase tracking-widest">
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 text-sm font-semibold text-slate-400 border border-dashed border-slate-700 rounded-2xl hover:text-cyan-400 hover:border-cyan-500 hover:bg-cyan-950/20 transition-all duration-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
              Xem toàn bộ lịch sử (Load More)
            </button>
          </section>

        </div>
      </div>
      
      {/* Thêm CSS cho Animation của thanh XP */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress-stripes {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
      `}} />
    </div>
  );
}
