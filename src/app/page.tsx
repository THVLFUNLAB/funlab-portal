"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Search, Lightbulb, Atom, Target, Lock, Star, LogOut, User as UserIcon, CheckCircle } from "lucide-react";
import YearlyLeaderboard from "@/components/YearlyLeaderboard";

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
const BadgeCollection = ({ userPoints }: { userPoints: number }) => {

  const badges = [
    {
      id: "badge-rookie",
      title: "Tân Binh Funlab",
      titleEN: "FUNLAB ROOKIE",
      points: "1 – 199đ",
      desc: "Ngọn lửa đam mê khoa học vừa được thắp sáng. Hãy tiếp tục khám phá!",
      imgSrc: "/badge-rookie.png",
      requiredMin: 1,
      requiredMax: 199,
      glow: "#f59e0b",
      color: "text-amber-400",
      starCount: 5,
    },
    {
      id: "badge-explorer",
      title: "Nhà Thám Hiểm",
      titleEN: "FUNLAB EXPLORER",
      points: "200 – 499đ",
      desc: "Bước vào hành trình khám phá vũ trụ khoa học rộng lớn!",
      imgSrc: "/badge-explorer.png",
      requiredMin: 200,
      requiredMax: 499,
      glow: "#10b981",
      color: "text-emerald-400",
      starCount: 5,
    },
    {
      id: "badge-innovator",
      title: "Nhà Cải Mới",
      titleEN: "FUNLAB INNOVATOR",
      points: "500 – 799đ",
      desc: "Kết hợp lý thuyết và thực hành – tư duy đột phá đang hình thành!",
      imgSrc: "/badge-innovator.png",
      requiredMin: 500,
      requiredMax: 799,
      glow: "#06b6d4",
      color: "text-cyan-400",
      starCount: 5,
    },
    {
      id: "badge-engineer",
      title: "Kỹ Sư Sáng Tạo",
      titleEN: "FUNLAB ENGINEER",
      points: "800 – 1199đ",
      desc: "Chế tạo tương lai bằng tư duy kỹ thuật xuất chúng!",
      imgSrc: "/badge-engineer.png",
      requiredMin: 800,
      requiredMax: 1199,
      glow: "#3b82f6",
      color: "text-blue-400",
      starCount: 5,
    },
    {
      id: "badge-master",
      title: "Chuyên Gia Funlab",
      titleEN: "FUNLAB MASTER",
      points: "1200 – 1599đ",
      desc: "Đứng trên đỉnh cao kiến thức – TOP Bảng Vàng toàn trường!",
      imgSrc: "/badge-master.png",
      requiredMin: 1200,
      requiredMax: 1599,
      glow: "#a855f7",
      color: "text-purple-400",
      starCount: 5,
    },
    {
      id: "badge-legend",
      title: "Huyền Thoại Funlab",
      titleEN: "FUNLAB LEGEND",
      points: "1600+ đ",
      desc: "Danh hiệu tối thượng – Huyền thoại khoa học của Funlab! Chưa ai đạt được!",
      imgSrc: "/badge-legend.png",
      requiredMin: 1600,
      requiredMax: 2000,
      glow: "#ef4444",
      color: "text-red-400",
      starCount: 5,
    },
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
        <p className="text-slate-400 mt-3 text-sm tracking-widest uppercase">Tổng điểm tối đa: <span className="text-yellow-400 font-black">2.000 điểm</span> · 6 Cấp độ</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-visible group mx-2 sm:mx-4 md:mx-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none rounded-[2.5rem]"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 relative z-10">
          {badges.map((badge, idx) => {
            const isUnlocked = userPoints >= badge.requiredMin;
            const range = badge.requiredMax - badge.requiredMin;
            const pointsIn = Math.max(0, userPoints - badge.requiredMin);
            const progressPct = isUnlocked ? Math.min(100, Math.round((pointsIn / range) * 100)) : 0;
            const starsEarned = isUnlocked ? Math.min(badge.starCount, Math.ceil((pointsIn / range) * badge.starCount)) : 0;

            return (
              <motion.div 
                key={badge.id}
                className="relative flex flex-col items-center group/badge cursor-pointer"
                animate={isUnlocked ? { y: [0, -8, 0] } : {}}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                  delay: idx * 0.35
                }}
              >
                {/* Huy hiệu image container */}
                <div className={`relative w-36 h-36 flex items-center justify-center mb-3 transition-all duration-500
                  ${isUnlocked ? 'scale-100 group-hover/badge:scale-110' : 'grayscale opacity-40 scale-90'}`}>

                  {/* Vòng quay năng lượng viền đứt */}
                  {isUnlocked && (
                    <div
                      className="absolute inset-0 rounded-full border-[3px] border-dashed animate-[spin_12s_linear_infinite]"
                      style={{ borderColor: badge.glow, filter: `drop-shadow(0 0 8px ${badge.glow})` }}
                    />
                  )}

                  {/* Glow aura */}
                  {isUnlocked && (
                    <div
                      className="absolute inset-4 blur-xl rounded-full opacity-40 group-hover/badge:opacity-70 transition-opacity duration-500"
                      style={{ backgroundColor: badge.glow }}
                    />
                  )}

                  {/* Hình ảnh huy hiệu */}
                  <Image
                    src={badge.imgSrc}
                    alt={badge.title}
                    width={130}
                    height={130}
                    style={{
                      width: 'auto', height: 'auto',
                      filter: isUnlocked
                        ? `drop-shadow(0 0 18px ${badge.glow}) drop-shadow(0 0 6px ${badge.glow})`
                        : 'grayscale(100%) brightness(0.4)'
                    }}
                    className="object-contain relative z-10 transition-all duration-300 group-hover/badge:brightness-125"
                  />

                  {/* Khoá khi chưa mở */}
                  {!isUnlocked && (
                    <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center z-20">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  )}

                  {/* Huy hiệu đã đạt: hiệu ứng lấp lánh */}
                  {isUnlocked && (
                    <>
                      <div className="absolute top-3 left-5 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-80" style={{ animationDelay: `${idx * 0.3}s` }} />
                      <div className="absolute bottom-5 right-4 w-1 h-1 bg-white rounded-full animate-ping opacity-60" style={{ animationDelay: `${idx * 0.3 + 0.8}s` }} />
                    </>
                  )}
                </div>

                {/* Tên huy hiệu */}
                <h4 className={`text-sm md:text-base font-black text-center mb-0.5 tracking-wider transition-colors
                  ${isUnlocked ? 'text-slate-100' : 'text-slate-600'}`}
                  style={{ textShadow: isUnlocked ? `0 0 10px ${badge.glow}` : 'none' }}
                >
                  {badge.titleEN}
                </h4>
                <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${isUnlocked ? badge.color : 'text-slate-700'}`}>
                  {badge.points}
                </p>

                {/* Sao rating */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(badge.starCount)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          i < starsEarned
                            ? `fill-current ${badge.color}`
                            : 'text-slate-700 fill-slate-800'
                        }`}
                        style={i < starsEarned ? { filter: `drop-shadow(0 0 4px ${badge.glow})` } : {}}
                      />
                    </motion.span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-[140px]">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${isUnlocked ? progressPct : 0}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 + 0.5 }}
                      style={{ backgroundColor: isUnlocked ? badge.glow : '#334155', boxShadow: isUnlocked ? `0 0 6px ${badge.glow}` : 'none' }}
                    />
                  </div>
                  <p className={`text-center text-[10px] mt-1 ${isUnlocked ? 'text-slate-400' : 'text-slate-700'}`}>
                    {isUnlocked ? `${Math.min(pointsIn, range)} / ${range} đ` : `Cần ${badge.requiredMin} điểm`}
                  </p>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 mb-2 w-56 opacity-0 group-hover/badge:opacity-100 pointer-events-none transition-all duration-300 z-50">
                  <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative">
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/95 border-b border-r border-white/10 rotate-45"></div>
                    <p className={`text-xs ${isUnlocked ? 'text-slate-200' : 'text-slate-400'} leading-relaxed`}>
                      {badge.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Thông điệp cuộc đua */}
        <div className="mt-10 text-center relative z-10 border-t border-slate-700/50 pt-6">
          <p className="text-slate-300 text-sm font-medium tracking-wide flex items-center justify-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]"></span>
            Điểm tích lũy theo mùa giải – Reset mỗi năm học để bắt đầu cuộc đua mới!
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" style={{animationDelay:'0.5s'}}></span>
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
        className="text-2xl sm:text-3xl md:text-5xl lg:text-[2.6rem] xl:text-5xl font-black tracking-tighter md:whitespace-nowrap bg-clip-text text-transparent relative z-10 leading-tight break-words overflow-hidden"
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
        className="absolute inset-0 z-20 text-2xl sm:text-3xl md:text-5xl lg:text-[2.6rem] xl:text-5xl font-black tracking-tighter md:whitespace-nowrap bg-clip-text text-transparent pointer-events-none leading-tight"
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
  const router = useRouter();
  const supabase = createClient();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [dbEpisodes, setDbEpisodes] = useState<any[]>([]);
  const [completedEpisodes, setCompletedEpisodes] = useState<number[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [activeEpisodeSeason, setActiveEpisodeSeason] = useState('season_2026_1');

  useEffect(() => {
    async function loadData() {
      // 1. Fetch User Session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          setUserProfile(profile);
        }

        // 1.5 Fetch Completed Episodes
        const { data: scores } = await supabase.from('episode_scores').select('episode_id').eq('user_id', session.user.id);
        if (scores) {
          setCompletedEpisodes(scores.map((s: any) => s.episode_id));
        }

        // 1.6 Fetch Achievement Score
        const { data: scoreData } = await supabase
          .from('overall_leaderboard')
          .select('total_score')
          .eq('user_id', session.user.id)
          .single();
        if (scoreData) setTotalScore(scoreData.total_score);
      }
      setIsAuthLoading(false);

      // 2. Fetch Active Episodes List from DB
      const { data: eps } = await supabase.from('episodes').select('*').order('id', { ascending: true });
      if (eps) setDbEpisodes(eps);
    }
    loadData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-transparent text-slate-100 selection:bg-cyan-500 selection:text-white pb-24 md:pb-20 main-safe-bottom relative overflow-hidden font-sans">
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
        <header className="flex justify-between items-center mb-16 md:mb-24 drop-shadow-sm w-full gap-2 md:gap-4 px-2 sm:px-0 relative">
          
          {/* TRÁI: Logo Trường */}
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex flex-1 justify-start items-center shrink-0 z-10"
          >
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/vietanh-logo.png" alt="Trường Việt Anh" className="h-20 sm:h-28 md:h-[110px] w-auto object-contain drop-shadow-2xl brightness-110" />
          </motion.div>

          {/* GIỮA: Logo Funlab Challenge */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex flex-[1.5] sm:flex-1 justify-center items-center relative group cursor-pointer z-20 shrink max-w-[60%] sm:max-w-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 blur-xl md:blur-3xl opacity-0 group-hover:opacity-50 transition-all duration-700 rounded-full scale-100 group-hover:scale-110"></div>
            <Image 
              src="/logo.png" 
              alt="FUNLAB CHALLENGE Logo" 
              width={600} 
              height={150} 
              style={{ width: 'auto', height: 'auto' }}
              className="h-20 sm:h-24 md:h-[120px] lg:h-[140px] w-auto object-contain relative z-10 transition-all duration-500 group-hover:-translate-y-1 drop-shadow-lg group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
              priority
            />
          </motion.div>

          {/* PHẢI: Navbar Authentication */}
          <motion.nav
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="flex flex-1 items-center justify-end gap-3 sm:gap-6 shrink-0 z-50 relative"
          >
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/science-club-logo.png" alt="Science Club" className="h-16 sm:h-20 md:h-[85px] w-auto object-contain drop-shadow-2xl hidden sm:block brightness-110" />

             {/* Nút DIỄN ĐÀN (TẠM ẨN ĐỂ HOÀN THIỆN) */}
             {/* <Link href="/forum" className="hidden md:flex items-center gap-2 text-fuchsia-400 hover:text-white font-bold text-sm tracking-wider uppercase transition-colors px-4 py-2 bg-slate-800/50 hover:bg-fuchsia-900/40 rounded-full border border-slate-700 hover:border-fuchsia-500 shadow-sm hover:shadow-[0_0_15px_rgba(232,121,249,0.4)]">
                Diễn Đàn
             </Link> */}

             {/* Nút VÒM KHOA HỌC (TẠM ẨN ĐỂ HOÀN THIỆN) */}
             {/* <Link href="/vom-khoa-hoc" className="hidden md:flex items-center gap-2 text-cyan-400 hover:text-white font-bold text-sm tracking-wider uppercase transition-colors px-4 py-2 bg-slate-800/50 hover:bg-cyan-900/40 rounded-full border border-slate-700 hover:border-cyan-500 shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                Vòm Khoa Học
             </Link> */}

            {isAuthLoading ? (
               <div className="w-32 h-10 bg-slate-800/50 rounded-full animate-pulse"></div>
            ) : userProfile ? (
               <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                 {/* Avatar với initials */}
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-[11px] shadow-inner shrink-0 select-none">
                   {userProfile.full_name?.split(' ').map((w: string) => w[0]).slice(-2).join('').toUpperCase() || '?'}
                 </div>
                 {/* Tên + lớp — truncate nếu quá dài */}
                 <div className="hidden sm:flex flex-col max-w-[90px] pr-2 border-r border-slate-700/50">
                   <span className="text-xs font-bold text-slate-100 leading-tight truncate">{userProfile.full_name}</span>
                   <span className="text-[10px] text-cyan-400 font-mono">{userProfile.class_name}</span>
                 </div>
                 {/* Nút Hồ Sơ rõ ràng hơn */}
                 <Link href="/profile" className="flex items-center gap-1 px-2.5 py-1.5 hover:bg-slate-800 rounded-full transition-colors text-cyan-400 hover:text-cyan-300" title="Hồ sơ cá nhân">
                   <UserIcon className="w-3.5 h-3.5" />
                   <span className="text-[11px] font-bold hidden md:inline">Hồ Sơ</span>
                 </Link>
                 {/* Nút đăng xuất */}
                 <button onClick={handleLogout} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors group" title="Đăng xuất">
                   <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 transition-colors" />
                 </button>
               </div>
            ) : (
               <div className="flex items-center gap-3">
                 <Link href="/login">
                   <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-5 py-2.5 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-cyan-400/30 text-white">
                     <UserIcon className="w-4 h-4" /> Đăng Nhập
                   </button>
                 </Link>
                 
                 {/* Admin Icon */}
                 <Link href="/admin/dashboard" className="hidden sm:block">
                   <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/40 backdrop-blur-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all overflow-hidden border border-white/5 group/btn" aria-label="Hệ Thống Quản Trị">
                     <div className="absolute inset-[1px] rounded-full bg-slate-900/90 flex items-center justify-center z-10 transition-colors group-hover/btn:bg-slate-900/70">
                       <Lock className="w-4 h-4 text-slate-400 group-hover/btn:text-cyan-300 transition-colors" />
                     </div>
                   </button>
                 </Link>
               </div>
            )}
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
        <BadgeCollection userPoints={totalScore} />

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid lg:grid-cols-12 gap-8 lg:gap-10"
        >
          {/* Episodes Section - Glassmorphism */}
          <div className="lg:col-span-12 bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-cyan-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 md:mb-8 border-b border-slate-800/50 pb-4 md:pb-6 gap-4 shrink-0">
                <h3 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-100">
                  <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">▶</span> Các Tập FUNLAB Mới
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
                  {/* Tabs Mùa Giải */}
                  <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-700/50 order-2 sm:order-1 w-full sm:w-auto">
                    <button 
                      onClick={() => setActiveEpisodeSeason('season_2026_1')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                        activeEpisodeSeason === 'season_2026_1' 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      Năm Học 26-27
                    </button>
                    <button 
                      onClick={() => setActiveEpisodeSeason('season_2025_1')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                        activeEpisodeSeason === 'season_2025_1' 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      Kho Lưu Trữ 25-26
                    </button>
                  </div>
                  
                  <Link href="/leaderboard" className="flex items-center justify-center gap-1.5 text-amber-400 text-xs sm:text-sm font-bold tracking-widest uppercase hover:text-amber-300 transition-colors bg-amber-500/10 px-4 md:px-5 py-2 md:py-3 rounded-full border border-amber-500/20 min-h-[44px] order-1 sm:order-2">
                    🏆 Bảng Vàng
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full auto-rows-max">
                {dbEpisodes.filter(ep => {
                  // Mặc định: tập mới không có season_id → thuộc mùa hiện tại (2026-27)
                  const epSeason = ep.season_id || 'season_2026_1';
                  return epSeason === activeEpisodeSeason;
                }).map((ep) => {
                  const isCompleted = completedEpisodes.includes(ep.id);
                  return (
                  <Link href={`/episode/${ep.id}`} key={ep.id} className="block h-full">
                    <div className={`relative h-full overflow-hidden rounded-2xl p-4 border transition-all cursor-pointer flex flex-col sm:flex-row gap-4 items-center sm:items-stretch group/item ${
                      isCompleted 
                        ? 'bg-slate-800/20 border-green-500/40 hover:bg-slate-800/40 hover:border-green-400/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] opacity-85 hover:opacity-100' 
                        : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/80 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                    }`}>
                       {/* Thumbnail / Image Map */}
                       <div className={`w-full sm:w-44 shrink-0 self-start rounded-xl flex-shrink-0 overflow-hidden relative border aspect-video ${isCompleted ? 'border-green-500/30 bg-slate-900/50' : 'border-slate-700/50 bg-slate-900'}`}>
                        {isCompleted && (
                          <div className="absolute top-1.5 right-1.5 bg-green-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 z-20 backdrop-blur-sm shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                            <CheckCircle className="w-2.5 h-2.5" /> XONG
                          </div>
                        )}
                        {ep.thumbnail_url ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={ep.thumbnail_url} alt={ep.title} className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isCompleted ? 'brightness-75 grayscale-[20%]' : ''}`} />
                        ) : (
                           <div className={`absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs text-center p-2 font-bold uppercase ${isCompleted ? 'text-green-600/50 bg-slate-900/80' : 'text-slate-600 bg-slate-800'}`}>Tập {ep.id}</div>
                        )}
                        {!isCompleted && (
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/60 to-purple-600/60 opacity-0 group/item:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Text Information */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left w-full">
                        <h4 className={`font-bold text-sm lg:text-base line-clamp-2 leading-snug transition-colors ${isCompleted ? 'text-slate-300 group-hover/item:text-green-400' : 'text-slate-200 group-hover/item:text-cyan-300'}`}>
                          {ep.title}
                        </h4>
                        <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed hidden sm:block ${isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>{ep.description || 'Chưa có thông tin mô tả chi tiết.'}</p>
                        <div className="mt-2 pt-2 border-t border-slate-700/30 flex items-center justify-center sm:justify-start gap-3">
                           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${isCompleted ? 'text-green-400 bg-green-500/10' : 'text-cyan-400 bg-cyan-500/10'}`}>TẬP {ep.id}</span>
                           <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isCompleted ? 'text-green-500' : 'text-slate-400'}`}>
                              <span className={`w-2 h-2 rounded-full inline-block ${isCompleted ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : ep.is_active ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-slate-600 animate-pulse'}`}></span>
                              {isCompleted ? 'ĐÃ HOÀN THÀNH' : ep.is_active ? 'ĐANG MỞ' : 'SẮP RA MẮT'}
                           </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="lg:col-span-12 mt-4">
            <YearlyLeaderboard />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
