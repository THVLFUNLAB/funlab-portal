'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Medal, Clock, ShieldAlert } from 'lucide-react';

interface EpisodeScore {
  id: string;
  user_id: string;
  score: number;
  time_in_seconds?: number;
  created_at: string;
  profiles?: any;
}

export default function EpisodeLeaderboard({ episodeId }: { episodeId: number }) {
  const [scores, setScores] = useState<EpisodeScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      // Logic mới theo yêu cầu: Sắp xếp theo score DESC (ai điểm cao nhất), 
      // sau đó ưu tiên theo thời gian created_at ASC (ai hoàn thành trước)
      const { data, error } = await supabase
        .from('episode_scores')
        .select(`id, user_id, score, time_in_seconds, created_at`)
        .eq('episode_id', episodeId)
        .order('score', { ascending: false })
        .order('time_in_seconds', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(20);

      if (data && data.length > 0) {
        const realUserIds = data.map((d: any) => d.user_id).filter((id: string) => id && !id.startsWith('guest-'));
        let profilesData: any[] = [];
        
        if (realUserIds.length > 0) {
          const { data: profs } = await supabase.from('profiles').select('id, full_name, class_name').in('id', realUserIds);
          if (profs) profilesData = profs;
        }

        const formattedScores = data.map((item: any) => {
          const profile = profilesData.find(p => p.id === item.user_id);
          return {
            ...item,
            profiles: profile || null
          };
        });
        
        setScores(formattedScores);
      } else {
        setScores([]);
      }
      if (error) console.error("Lỗi lấy bảng xếp hạng tập:", error);
      setLoading(false);
    }
    
    fetchScores();
  }, [episodeId]);

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-cyan-900/50 p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h3 className="text-2xl font-black text-cyan-400 flex items-center gap-3">
          <Medal className="w-8 h-8 text-cyan-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
            XẾP HẠNG TẬP {episodeId}
          </span>
        </h3>
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full">
          Max: 50 HP <ShieldAlert className="w-3 h-3 text-cyan-400" />
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
      ) : scores.length === 0 ? (
        <p className="text-center text-slate-500 py-10 font-medium border border-dashed border-slate-700/50 rounded-2xl">
          Chưa có thuyền trưởng nào hoàn thành thành tích ở tập này.
        </p>
      ) : (
        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
          {scores.map((s, index) => {
            const isTop3 = index < 3;
            // Chỉ hiển thị điểm với style khác biệt tuỳ thuộc theo rank
            return (
              <div key={s.id} className="flex items-center justify-between p-4 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]' :
                    index === 1 ? 'bg-slate-300 text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.4)]' :
                    index === 2 ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="truncate">
                    <h4 className={`font-bold truncate ${isTop3 ? 'text-white' : 'text-slate-300'}`}>
                      {s.profiles?.full_name || s.user_id || "Tuyển thủ Funlab"} - {s.profiles?.class_name || "Khách"}
                    </h4>
                    <span className="text-[10px] text-slate-500 opacity-80 font-mono flex items-center gap-1 mt-0.5">
                       <Clock className="w-3 h-3" /> {new Date(s.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-black ${isTop3 ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-cyan-500'}`}>
                    {s.score} <span className="text-[10px] text-slate-500 ml-0.5 tracking-wider uppercase">HP</span>
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
