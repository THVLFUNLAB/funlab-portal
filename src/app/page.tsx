"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Lightbulb, Atom, Target, Lock } from "lucide-react";
import { episodes } from "@/data/episodes";

// --- Particle Background Component ---
const Particles = () => {
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, size: number, duration: number, delay: number }>>([]);
  
  useEffect(() => {
    // Tự động giảm mật độ hạt trên thiết bị di động để mượt mà (chỉ 15 hạt thay vì 60)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 60;
    
    // Hủy bỏ hạt hoàn toàn nếu thiết bị bật chế độ giảm chuyển động
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const generated = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.8, 0.2, 0.8, 0],
            y: [-20, -150],
            x: p.x % 2 === 0 ? [-20, 20, -20] : [20, -20, 20],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// --- Badge Collection Gamification Section ---
const BadgeCollection = () => {
  const userPoints = 250; // Giả lập học sinh đạt 250 điểm

  const badges = [
    {
      id: "badge-1",
      title: "Nhà Thám Hiểm Sơ Cấp",
      points: "0 - 50đ",
      desc: "Đã hoàn thành nhiệm vụ đầu tiên, thể hiện tinh thần khám phá.",
      imgSrc: "/badge-explorer.png",
      Icon: Search,
      requiredMin: 0,
      gradient: "from-blue-400 to-cyan-500",
      glow: "#22d3ee" // Xanh lơ sáng
    },
    {
      id: "badge-2",
      title: "Kỹ Sư Sáng Tạo",
      points: "151 - 300đ",
      desc: "Bài dự thi có yếu tố sáng tạo, bứt phá giới hạn.",
      imgSrc: "/badge-engineer.png",
      Icon: Lightbulb,
      requiredMin: 151,
      gradient: "from-blue-500 to-indigo-500",
      glow: "#3b82f6" // Xanh điện (Electric Blue)
    },
    {
      id: "badge-3",
      title: "Chuyên Gia Funlab",
      points: "301+ đ",
      desc: "Kiến thức và kỹ năng vượt trội, thuộc TOP xuất sắc nhất.",
      imgSrc: "/badge-master.png",
      Icon: Atom,
      requiredMin: 301,
      gradient: "from-amber-400 to-yellow-500",
      glow: "#fbbf24" // Vàng kim (Gold)
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="mb-32 w-full relative z-20"
    >
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-black tracking-widest uppercase text-slate-100 flex items-center justify-center gap-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-cyan-500"></span>
          KHO BÁU HUY HIỆU
          <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-cyan-500"></span>
        </h3>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-visible group mx-2 sm:mx-4 md:mx-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none rounded-[2.5rem]"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 relative z-10 place-items-center">
          {badges.map((badge, idx) => {
            const isUnlocked = userPoints >= badge.requiredMin;
            const IconComponent = badge.Icon;

            return (
              <motion.div 
                key={badge.id}
                className="relative flex flex-col items-center group/badge cursor-pointer"
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                  delay: idx * 0.4 
                }}
              >
                {/* Khu vực năng lượng phát sáng chứa huy hiệu */}
                <div className={`relative w-40 h-40 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isUnlocked ? 'scale-100 group-hover/badge:scale-110' : 'grayscale opacity-50 scale-95 group-hover/badge:grayscale-0 group-hover/badge:opacity-100 border border-slate-700'}`}>
                  
                  {/* Vòng quay năng lượng viền đứt */}
                  <div className={`absolute inset-0 rounded-full border-[3px] border-dashed ${isUnlocked ? 'animate-[spin_10s_linear_infinite] opacity-100' : 'border-slate-500/50 opacity-0'} transition-all duration-700`}
                       style={{ borderColor: isUnlocked ? badge.glow : 'transparent', filter: isUnlocked ? `drop-shadow(0 0 8px ${badge.glow})` : 'none' }}
                  ></div>
                  
                  {/* Glow mờ Aura lan toả phía sau lõi khi hover */}
                  {isUnlocked && (
                    <div className="absolute inset-1 opacity-50 blur-xl rounded-full transition-all duration-500 group-hover/badge:opacity-80 group-hover/badge:blur-2xl"
                         style={{ backgroundColor: badge.glow }}
                    ></div>
                  )}

                  {/* Lõi Huy Hiệu chính chứa Hình Ảnh or Icon */}
                  <div className={`relative z-10 w-[7.5rem] h-[7.5rem] rounded-full flex items-center justify-center transition-all duration-500`}>
                    {badge.imgSrc ? (
                      <Image 
                        src={badge.imgSrc} 
                        alt={badge.title} 
                        width={120} 
                        height={120} 
                        className="object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" 
                      />
                    ) : (
                      <div className={`w-[6.5rem] h-[6.5rem] rounded-full flex items-center justify-center shadow-inner transition-all duration-500 border border-white/20 ${isUnlocked ? 'bg-gradient-to-br ' + badge.gradient : 'bg-slate-800 border-slate-700'}`}>
                        <IconComponent className={`w-12 h-12 ${isUnlocked ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'text-slate-500'}`} strokeWidth={isUnlocked ? 2.5 : 2} />
                      </div>
                    )}
                    
                    {/* Ổ Khóa Huyền Bí khi chưa đạt */}
                    {!isUnlocked && (
                      <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.9)] z-20">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    
                    {/* Hiệu ứng Shine Lấp Lánh (chỉ dành cho mode fallback SVG) */}
                    {isUnlocked && !badge.imgSrc && (
                      <>
                        <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-ping opacity-70"></div>
                        <div className="absolute bottom-4 right-3 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-70" style={{ animationDelay: "1.5s" }}></div>
                      </>
                    )}
                  </div>
                </div>

                <h4 className={`text-xl font-bold text-center mb-1 transition-colors drop-shadow-md ${isUnlocked ? 'text-slate-100 group-hover/badge:text-cyan-300' : 'text-slate-500'}`}>
                  {badge.title}
                </h4>
                <p className={`text-sm font-black tracking-widest uppercase transition-colors ${isUnlocked ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-slate-600'}`}>
                  {badge.points}
                </p>

                {/* Cyber Tooltip Giải thích */}
                <div className="absolute top-[110%] left-1/2 -translate-x-1/2 mt-4 w-64 opacity-0 group-hover/badge:opacity-100 group-hover/badge:translate-y-2 pointer-events-none transition-all duration-300 z-50">
                  <div className="bg-slate-900/95 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/95 border-t border-l border-white/10 rotate-45"></div>
                    <p className={`text-sm ${isUnlocked ? 'text-slate-200' : 'text-slate-400'} leading-relaxed font-medium`}>
                      {badge.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Thông điệp Cuộc đua */}
        <div className="mt-16 text-center relative z-10 border-t border-slate-700/50 pt-8">
          <p className="text-slate-300 text-lg font-medium tracking-wide flex items-center justify-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            Điểm tích lũy sẽ được reset vào tháng mới để bắt đầu cuộc đua mới!
          </p>
        </div>
      </div>
    </motion.section>
  );
};

// --- Premium 3D Slogan Component ---
const PremiumSlogan = ({ text }: { text: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative inline-block group mb-6"
    >
      {/* Base Layer: Beautiful Multi-Color Gradient matching the Logo + 3D Shadow Stack */}
      <h2 
        className="text-3xl md:text-5xl lg:text-[2.6rem] xl:text-5xl font-black tracking-tighter md:whitespace-nowrap bg-clip-text text-transparent relative z-10 leading-tight"
        style={{
          backgroundImage: "linear-gradient(to right, #FBBF24, #F97316, #22C55E, #3B82F6)",
          WebkitBackgroundClip: "text",
          // 3D Metal Depth using shadow stacks
          filter: "drop-shadow(0px 1px 0px rgba(120,53,15,0.8)) drop-shadow(0px 3px 2px rgba(0,0,0,0.5)) drop-shadow(0px 8px 12px rgba(0,0,0,0.6))"
        }}
      >
        {text}
      </h2>
      
      {/* Dynamic Layer: The Smooth Shiny Sweep */}
      <motion.h2 
        aria-hidden="true"
        className="absolute inset-0 z-20 text-3xl md:text-5xl lg:text-[2.6rem] xl:text-5xl font-black tracking-tighter md:whitespace-nowrap bg-clip-text text-transparent pointer-events-none leading-tight"
        style={{
          // A bright white diagonal beam to sweep across
          backgroundImage: "linear-gradient(75deg, transparent 40%, rgba(255,255,255,0.95) 50%, transparent 60%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
        }}
        animate={{
          backgroundPosition: ["200% center", "-200% center"]
        }}
        transition={{
          repeat: Infinity,
          repeatDelay: 3, // Pauses for 3 seconds before next sweep as requested
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        {text}
      </motion.h2>
    </motion.div>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100 selection:bg-cyan-500 selection:text-white pb-20 relative overflow-hidden font-sans">
      {/* Sci-fi Video Background */}
      <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-[6px]"
        >
          <source src="/bg-tech.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
      </div>

      <Particles />
      
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-cyan-900/20 via-purple-900/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
        <header className="flex justify-between items-center mb-24 drop-shadow-sm">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex items-center gap-4 relative group cursor-pointer"
          >
            {/* Glow Aura Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 blur-3xl opacity-0 group-hover:opacity-50 transition-all duration-700 rounded-[3rem] scale-100 group-hover:scale-110"></div>
            
            <Image 
              src="/logo.png" 
              alt="FUNLAB CHALLENGE Logo" 
              width={1000} 
              height={240} 
              className="h-[240px] w-auto object-contain relative z-10 transition-all duration-500 group-hover:-translate-y-2 drop-shadow-xl group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
              priority
            />
          </motion.div>
          <motion.nav
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="relative group flex items-center justify-end"
          >
            <Link href="/login">
              <button 
                className="relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900/40 backdrop-blur-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-500 overflow-hidden group/btn border border-white/5"
                aria-label="Hệ Thống Quản Trị"
              >
                {/* Rotating Border Beam */}
                <div className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_70%,rgba(34,211,238,1)_100%)] animate-[spin_2s_linear_infinite] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                {/* Inner Cutout */}
                <div className="absolute inset-[1px] rounded-full bg-slate-900/90 backdrop-blur-3xl flex items-center justify-center z-10 transition-colors group-hover/btn:bg-slate-900/70">
                  {/* Lock Icon */}
                  <svg className="w-5 h-5 text-slate-400 group-hover/btn:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    <circle cx="12" cy="15" r="1.5" fill="currentColor"></circle>
                  </svg>
                </div>
              </button>
            </Link>

            {/* Secret Entry Tooltip */}
            <div className="absolute right-0 top-full mt-4 w-max px-4 py-2 bg-slate-900/90 backdrop-blur-md text-cyan-50 text-sm font-medium rounded-xl border border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
              Chỉ dành cho Ban Tổ chức Funlab
              <div className="absolute -top-2 right-4 w-4 h-4 bg-slate-900/90 border-t border-l border-cyan-500/20 rotate-45 transform"></div>
            </div>
          </motion.nav>
        </header>

        <section className="text-center mb-32 mt-4 relative flex flex-col justify-center items-center">
          <PremiumSlogan text="HÃY LÀM CHO KHOA HỌC KHÔNG CHỈ ĐỂ HIỂU, MÀ CÒN ĐỂ NGẮM NHÌN" />
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative max-w-4xl mx-auto mt-6 px-4"
          >
            <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
            
            <p className="text-[15px] sm:text-base md:text-lg lg:text-xl text-slate-300 leading-[1.8] md:leading-loose font-medium tracking-wide drop-shadow-sm opacity-90 italic px-2">
              "Khám phá các hiện tượng tự nhiên qua lăng kính thí nghiệm thực tế.<br className="hidden md:block" />
              Tham gia <strong className="text-cyan-400 font-bold not-italic tracking-widest drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] px-1">FUNLAB CHALLENGE</strong> ngay để tự tay chứng minh những định luật diệu kỳ và ghi tên lên Bảng Vàng vinh danh!"
            </p>
            
            <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
          </motion.div>
        </section>

        {/* --- Phần Kho Báu Huy Hiệu Gamification --- */}
        <BadgeCollection />

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid lg:grid-cols-12 gap-8 lg:gap-10"
        >
          {/* Episodes Section - Glassmorphism */}
          <div className="lg:col-span-8 bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-cyan-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-slate-800/50 pb-4 md:pb-6 flex-wrap gap-4 shrink-0">
                <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-100">
                  <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">▶</span> Các Tập FUNLAB Mới
                </h3>
                <button className="text-cyan-400 text-xs sm:text-sm font-bold tracking-widest uppercase hover:text-cyan-300 transition-colors bg-cyan-500/10 px-4 md:px-5 py-2 md:py-3 rounded-full border border-cyan-500/20 min-h-[44px]">Xem Tất Cả</button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full auto-rows-max">
                {episodes.map((ep) => (
                  <Link href={`/episode/${ep.id}`} key={ep.id} className="block h-full">
                    <div className="relative h-full overflow-hidden rounded-2xl bg-slate-800/40 p-4 border border-slate-700/30 hover:bg-slate-800/80 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 items-center sm:items-stretch hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] group/item">
                       {/* Thumbnail Placeholder */}
                       <div className="w-full sm:w-24 h-32 sm:h-auto rounded-xl bg-slate-900 flex-shrink-0 overflow-hidden relative border border-slate-700/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/60 to-purple-600/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-600 text-[10px] sm:text-xs text-center p-2">Tập {ep.id} Ảnh minh họa</div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left w-full">
                        <h4 className="font-bold text-sm lg:text-base text-slate-200 group-hover/item:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                          {ep.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">{ep.desc}</p>
                        <div className="mt-2 pt-2 border-t border-slate-700/30 flex items-center justify-center sm:justify-start gap-3">
                           <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-1 rounded">TẬP {ep.id}</span>
                           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{ep.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard Section - Glassmorphism */}
          <div className="lg:col-span-4 bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-slate-800/50 pb-4 md:pb-6 flex-wrap gap-4 shrink-0">
                <h3 className="text-2xl md:text-2xl font-bold flex items-center gap-3 text-slate-100">
                  <span className="text-2xl drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">🏆</span> Bảng Vàng
                </h3>
                <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold tracking-widest uppercase">
                  Tuần Này
                </div>
              </div>
              
              <div className="space-y-3 flex-1">
                {[
                  { name: "Phạm Minh Anh", score: 9850 },
                  { name: "Trần Hữu Việt", score: 8420 },
                  { name: "Lê Ngọc Linh", score: 7900 },
                  { name: "Vũ Hải Đăng", score: 7150 },
                  { name: "Nguyễn Bảo", score: 6800 },
                  { name: "Hoàng Đức Nam", score: 6200 },
                ].map((student, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:bg-slate-800/60 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-sm shadow-inner border-2 ${
                        i === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-slate-900 border-yellow-300/50 drop-shadow-[0_0_10px_rgba(253,224,71,0.6)]' : 
                        i === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900 border-slate-300/50' : 
                        i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white border-amber-500/50' : 
                        'bg-slate-800/80 text-slate-400 border-slate-700'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="font-semibold text-sm text-slate-200 truncate pr-2">{student.name}</span>
                    </div>
                    <div className="font-mono text-cyan-300 font-bold text-sm bg-slate-900/50 px-3 py-1.5 shrink-0 rounded-lg border border-cyan-900/30 shadow-inner">
                      {student.score.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/30 hover:border-slate-600/50 text-slate-300 font-semibold transition-all duration-300 shadow-lg cursor-pointer shrink-0">
                Xem Toàn Bộ Bảng Vàng
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
