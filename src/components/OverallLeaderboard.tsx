'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface AggregatedUser {
  user_id: string;
  full_name: string;
  class_name: string;
  total_score: number;
}

export default function OverallLeaderboard() {
  const [leaders, setLeaders] = useState<AggregatedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverall() {
      setLoading(true);
      const { data, error } = await supabase
        .from('yearly_leaderboard')
        .select(`
          user_id,
          total_score,
          profiles (full_name, class_name)
        `)
        .order('total_score', { ascending: false })
        .limit(30);

      if (error) {
        console.error("Lỗi lấy tổng điểm:", error);
      } else if (data) {
        const sorted = data.map((row: any) => ({
          user_id: row.user_id,
          full_name: row.profiles?.full_name || "Tuyển thủ Funlab",
          class_name: row.profiles?.class_name || "Khách",
          total_score: row.total_score
        }));
        setLeaders(sorted);
      }
      setLoading(false);
    }
    
    fetchOverall();
  }, []);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-yellow-500/20 p-6 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/20 blur-[60px] rounded-full mix-blend-screen pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-8 border-b border-yellow-500/20 pb-6 relative z-10">
        <div>
          <h3 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
            <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600">
              BẢNG VÀNG CHUNG CUỘC
            </span>
          </h3>
          <p className="text-yellow-500/70 text-sm font-bold tracking-widest uppercase mt-2 pl-14">
            Đỉnh cao tri thức Funlab
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
      ) : leaders.length === 0 ? (
        <p className="text-center text-slate-500 py-10 font-medium">Chưa có dữ liệu tổng.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {leaders.map((s, index) => {
            const isTop3 = index < 3;
            return (
              <div 
                key={s.user_id} 
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                  isTop3 
                    ? 'bg-gradient-to-r from-yellow-900/40 to-slate-900/60 border-yellow-500/40 shadow-inner' 
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                    index === 0 ? 'bg-yellow-400 text-yellow-950 shadow-[0_0_20px_rgba(250,204,21,0.5)]' :
                    index === 1 ? 'bg-slate-300 text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.4)]' :
                    index === 2 ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-lg text-white truncate max-w-[150px] sm:max-w-[200px]">
                      {s.full_name}
                    </h4>
                    <span className="text-xs text-yellow-500/70 uppercase tracking-widest">{s.class_name}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-black tracking-tighter ${isTop3 ? 'text-yellow-400 text-2xl' : 'text-slate-300 text-xl'}`}>
                    {s.total_score}
                    {isTop3 && <Sparkles className="inline-block w-4 h-4 ml-1 text-yellow-500 animate-pulse" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
