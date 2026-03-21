"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export function LiveLeaderboard({ episodeId }: { episodeId: number }) {
  const [entries, setEntries] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Hàm tải dữ liệu Leaderboard
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("episode_scores")
        .select("id, user_id, score, time_in_seconds, created_at")
        .eq("episode_id", episodeId)
        .order("score", { ascending: false })
        .order("time_in_seconds", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(10);
      
      if (error) {
        console.error("Lỗi lấy dữ liệu Leaderboard:", error);
        return;
      }

      if (data && data.length > 0) {
        // Lấy danh sách user_id thật (bỏ qua guest)
        const realUserIds = data.map((d: any) => d.user_id).filter((id: string) => id && !id.startsWith('guest-'));
        
        let profilesData: any[] = [];
        if (realUserIds.length > 0) {
          const { data: profs } = await supabase.from('profiles').select('id, full_name, class_name').in('id', realUserIds);
          if (profs) profilesData = profs;
        }

        const formatted = data.map((item: any) => {
          const profile = profilesData.find(p => p.id === item.user_id);
          return {
            id: item.id,
            score: item.score,
            created_at: item.created_at,
            full_name: profile?.full_name || 'Học giả Ẩn danh',
            class_name: profile?.class_name || 'Khách'
          };
        });
        setEntries(formatted);
      } else {
        setEntries([]);
      }
    };

    // Tải lần đầu tiên khi Component được mount
    fetchLeaderboard();

    // Thiết lập kênh Realtime lắng nghe thay đổi điểm số của Tập này
    const channel = supabase
      .channel(`live_leaderboard_${episodeId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Lắng nghe cả INSERT và UPDATE (do logic upsert cao điểm nhất)
          schema: "public",
          table: "episode_scores",
          filter: `episode_id=eq.${episodeId}`,
        },
        () => {
          // Bất cứ khi nào có thay đổi, lập tức fetch lại để lấy dữ liệu JOIN mới nhất
          playSound();
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [episodeId, supabase]);

  const playSound = () => {
    // Âm thanh thông báo khi có người mới lọt vào Top hoặc đổi điểm
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.play().catch(e => console.log("Trình duyệt chặn autoplay âm thanh", e));
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-3xl rounded-[2rem] border border-slate-700/50 p-6 md:p-8 shadow-2xl mb-8 flex-shrink-0">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-black text-white flex items-center gap-3">
          <span className="text-4xl drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">🏆</span> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Live Leaderboard</span>
        </h3>
        <div className="flex items-center gap-2 text-xs font-bold text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)] tracking-widest uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          Realtime
        </div>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence>
          {entries.map((entry, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;
            
            let bgClass = "bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800/80";
            if (isTop1) bgClass = "bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-slate-800/40 border-yellow-500/40 text-yellow-300 shadow-[0_4px_20px_rgba(234,179,8,0.15)]";
            else if (isTop2) bgClass = "bg-gradient-to-r from-slate-300/20 via-slate-400/10 to-slate-800/40 border-slate-400/40 text-slate-200 shadow-[0_4px_15px_rgba(148,163,184,0.1)]";
            else if (isTop3) bgClass = "bg-gradient-to-r from-amber-700/20 via-orange-800/10 to-slate-800/40 border-amber-700/40 text-amber-500 shadow-[0_4px_15px_rgba(180,83,9,0.15)]";

            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`flex items-center justify-between p-4 px-6 rounded-2xl border backdrop-blur-md transition-all duration-300 ${bgClass}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${
                    isTop1 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.6)]' : 
                    isTop2 ? 'bg-gradient-to-br from-slate-100 to-slate-400 text-slate-900 shadow-[0_0_15px_rgba(148,163,184,0.4)]' : 
                    isTop3 ? 'bg-gradient-to-br from-amber-500 to-amber-800 text-white shadow-[0_0_15px_rgba(180,83,9,0.4)]' : 
                    'bg-slate-800 text-slate-400 border border-slate-600'
                  }`}>
                    {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : index + 1}
                  </div>
                  <span className="font-bold text-lg sm:text-xl">
                    [Top {index + 1}] {entry.full_name} <span className="text-sm font-medium opacity-70">({entry.class_name})</span>
                  </span>
                </div>
                <div className="font-mono font-black text-2xl sm:text-3xl tracking-tighter shrink-0 ml-2">
                  {entry.score} <span className="text-sm font-bold opacity-60">Điểm</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {entries.length === 0 && (
          <div className="text-center p-12 text-slate-500 font-medium bg-slate-800/30 rounded-2xl border border-slate-700/30 border-dashed">
            Bảng Vàng đang chờ những cái tên đầu tiên khắc lên...
          </div>
        )}
      </div>
    </div>
  );
}
