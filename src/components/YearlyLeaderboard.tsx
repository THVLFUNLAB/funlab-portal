'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Trophy, Star, Sparkles, ChevronUp, Zap, Compass, Lightbulb, Crown } from 'lucide-react';

interface OverallScore {
  user_id: string;
  full_name?: string;
  class_name?: string;
  total_score: number;
}

const getUserRankInfo = (score: number) => {
  if (score < 50) return { title: 'Chưa xếp hạng', stars: 0, badgeUrl: null, color: 'text-slate-500', shadowColor: '' };
  
  if (score <= 150) {
    const stars = Math.min(5, 1 + Math.floor((score - 50) / 20));
    return { title: 'Nhà Thám Hiểm Sơ Cấp', stars, badgeUrl: '/badges/explorer.png', color: 'text-blue-400', shadowColor: 'drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]' };
  }
  
  if (score <= 300) {
    const stars = Math.min(5, 1 + Math.floor((score - 151) / 30));
    return { title: 'Kỹ Sư Sáng Tạo', stars, badgeUrl: '/badges/crengineer.png', color: 'text-purple-400', shadowColor: 'drop-shadow-[0_0_15px_rgba(192,132,252,0.6)]' };
  }
  
  const stars = Math.min(5, 1 + Math.floor((score - 301) / 50));
  return { title: 'Chuyên Gia Funlab', stars, badgeUrl: '/badges/master.png', color: 'text-yellow-400', shadowColor: 'drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]' };
};

export default function YearlyLeaderboard() {
  const [leaders, setLeaders] = useState<OverallScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchOverall() {
      setLoading(true);
      // Truy vấn trực tiếp vào VIEW overall_leaderboard đã tạo trong CSDL
      const { data, error } = await supabase
        .from('overall_leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(30);

      if (error) {
        console.error("Lỗi lấy tổng điểm năm học:", error);
      } else if (data) {
        setLeaders(data);
      }
      setLoading(false);
    }
    
    fetchOverall();
  }, []);

  // Icon Huy Chương Sci-Fi
  const renderMedal = (index: number) => {
    if (index === 0) return (
      <div className="relative flex items-center justify-center w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-700 p-[2px] shadow-[0_0_30px_rgba(250,204,21,0.6)]">
        <div className="absolute -inset-2 rounded-full border border-yellow-400/30 animate-[spin_4s_linear_infinite]"></div>
        <div className="flex w-full h-full rounded-full bg-slate-950 items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-yellow-500/20"></div>
           <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
        </div>
      </div>
    );
    if (index === 1) return (
       <div className="relative flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 p-[2px] shadow-[0_0_20px_rgba(148,163,184,0.4)]">
           <div className="absolute -inset-2 rounded-full border border-slate-300/30 animate-[spin_5s_linear_infinite_reverse]"></div>
           <div className="flex w-full h-full rounded-full bg-slate-950 items-center justify-center">
              <Star className="w-5 h-5 text-slate-300 drop-shadow-[0_0_5px_rgba(203,213,225,0.8)]" />
           </div>
       </div>
    );
    if (index === 2) return (
       <div className="relative flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-rose-800 p-[2px] shadow-[0_0_20px_rgba(217,119,6,0.4)]">
           <div className="flex w-full h-full rounded-full bg-slate-950 items-center justify-center">
              <Star className="w-5 h-5 text-amber-500 drop-shadow-[0_0_5px_rgba(217,119,6,0.8)]" />
           </div>
       </div>
    );
    return (
       <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 font-black shadow-inner">
          {index + 1}
       </div>
    );
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] border border-yellow-500/30 p-6 md:p-10 shadow-2xl relative overflow-hidden group">
      {/* Sci-Fi Ambient Glows */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none group-hover:bg-amber-500/20 transition-all duration-1000"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-yellow-500/20 pb-6 relative z-10 gap-4">
        <div>
          <h3 className="text-3xl md:text-5xl font-black text-white flex items-center gap-3 tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              BẢNG VÀNG NĂM HỌC
            </span>
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
          </h3>
          <p className="text-yellow-500/80 text-xs md:text-sm font-black tracking-[0.2em] uppercase mt-2 md:pl-1 flex items-center gap-2">
             TỔNG CHIẾN DỊCH KHÁM PHÁ <Zap className="w-4 h-4 text-amber-400" />
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-950 rounded-lg border border-yellow-500/20 text-xs font-mono text-yellow-400 flex flex-col items-center shadow-inner">
           <span className="text-slate-500">MAX POSSIBLE</span>
           <span className="text-lg font-black tracking-widest text-white drop-shadow-[0_0_5px_yellow]">1200</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="relative w-16 h-16">
             <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
             <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500 animate-pulse" />
          </div>
        </div>
      ) : leaders.length === 0 ? (
        <div className="text-center bg-slate-950/50 py-16 rounded-3xl border border-slate-800/50 border-dashed">
          <ChevronUp className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-bounce" />
          <p className="text-slate-400 font-medium tracking-wide">Chưa có bảng báo cáo tổng kết nào được gửi về.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col relative z-10">
          {(showAll ? leaders : leaders.slice(0, 10)).map((s, index) => {
            const rank = getUserRankInfo(s.total_score);

            return (
              <div 
                key={s.user_id} 
                className="flex items-center justify-between bg-[#111827]/80 border border-yellow-500/20 rounded-xl p-4 my-2 sm:my-3 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-yellow-400/50 hover:bg-[#1f2937]/90 hover:shadow-[0_10px_30px_rgba(250,204,21,0.15)] group"
              >
                {/* Khu vực Trái (Thông tin user) */}
                <div className="flex items-center flex-1 min-w-0">
                  <div className="mr-4 sm:mr-5 shrink-0 hidden sm:block">
                    {renderMedal(index)}
                  </div>
                  <div className="mr-3 sm:hidden font-black text-slate-400 text-lg">#{index + 1}</div>
                  
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-baseline gap-2 truncate pr-2">
                      <h4 className={`font-black text-base sm:text-xl truncate tracking-wide ${index === 0 ? 'text-yellow-400' : 'text-slate-100'}`}>
                        {s.full_name || 'Học giả Ẩn danh'}
                      </h4>
                      <span className="text-xs sm:text-sm font-semibold text-slate-400 whitespace-nowrap">
                        ({s.class_name || 'Khách'})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
                      {rank.title !== 'Chưa xếp hạng' && <Compass className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${rank.color}`} />}
                      <span className={`text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.15em] ${rank.color}`}>
                        {rank.title}
                      </span>
                      {rank.stars > 0 && (
                        <div className="flex gap-0.5 ml-1 sm:ml-2">
                          {[...Array(rank.stars)].map((_, i) => (
                            <Star key={`star-${i}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Khu vực Giữa (Điểm số) */}
                <div className="flex flex-col items-center justify-center shrink-0 px-3 sm:px-8 border-l border-r border-slate-700/50 mx-2 sm:mx-4">
                  <div className="text-yellow-500 text-2xl sm:text-4xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    {s.total_score}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5 sm:mt-1">
                    ĐIỂM
                  </span>
                </div>

                {/* Khu vực Phải (Huy hiệu vinh danh) */}
                <div className="shrink-0 flex items-center justify-center w-14 h-14 sm:w-24 sm:h-24 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {rank.badgeUrl ? (
                    <Image 
                      src={rank.badgeUrl} 
                      alt={rank.title} 
                      width={96}
                      height={96}
                      style={{ width: 'auto', height: 'auto' }}
                      className={`w-full h-full object-contain filter ${rank.shadowColor} transition-all duration-300 group-hover:scale-110 group-hover:brightness-125 group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]`} 
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-slate-700/50 flex items-center justify-center text-slate-600 font-black opacity-50">
                      ?
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {leaders.length > 10 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="mt-6 py-4 w-full bg-slate-950/50 hover:bg-yellow-500/10 border border-dashed border-yellow-500/30 hover:border-yellow-500/60 rounded-2xl text-yellow-500 font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 group/btn"
            >
              <Zap className={`w-5 h-5 transition-transform duration-500 ${showAll ? 'rotate-180 text-yellow-600' : 'animate-pulse text-yellow-400'}`} />
              {showAll ? 'THU GỌN DANH SÁCH' : 'HIỂN THỊ THÊM SĨ TỬ'}
              <Zap className={`w-5 h-5 transition-transform duration-500 ${showAll ? 'rotate-180 text-yellow-600' : 'animate-pulse text-yellow-400'}`} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
