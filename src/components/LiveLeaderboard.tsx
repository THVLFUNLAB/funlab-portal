"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LeaderboardEntry } from "@/lib/database.types";
import { motion, AnimatePresence } from "framer-motion";

export function LiveLeaderboard({ episodeId }: { episodeId: number }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchLeaderboard = async () => {
      // Setup mock data fallback if Supabase url is placeholder
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase")) {
        setEntries([
          { id: 1, episode_id: episodeId, student_name: "Initial Player", score: 1000, created_at: new Date().toISOString() }
        ]);
        return;
      }

      const { data } = await supabase
        .from("leaderboard")
        .select("*")
        .eq("episode_id", episodeId)
        .order("score", { ascending: false })
        .limit(10);
      
      if (data) setEntries(data);
    };

    fetchLeaderboard();

    // Setup Local Mock Listener when real DB is unavailable
    const handleMockInsert = (e: any) => {
      const newEntry = e.detail;
      playSound();
      setEntries(prev => {
        const next = [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
        return next;
      });
    };
    window.addEventListener("mock_leaderboard_insert", handleMockInsert);

    // Realtime Supabase Subscription
    const channel = supabase
      .channel("leaderboard_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leaderboard",
          filter: `episode_id=eq.${episodeId}`,
        },
        (payload) => {
          const newEntry = payload.new as LeaderboardEntry;
          playSound();
          setEntries(prev => {
            const next = [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("mock_leaderboard_insert", handleMockInsert);
    };
  }, [episodeId]);

  const playSound = () => {
    // Free notification sound simulating leaderboard "level up / ting"
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.play().catch(e => console.log("Audio autoplay blocked by browser policy without user gesture", e));
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
                key={entry.id || entry.created_at}
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
                  <span className="font-bold text-xl">{entry.student_name}</span>
                </div>
                <div className="font-mono font-black text-3xl tracking-tighter">
                  {entry.score.toLocaleString()}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {entries.length === 0 && (
          <div className="text-center p-12 text-slate-500 font-medium bg-slate-800/30 rounded-2xl border border-slate-700/30 border-dashed">
            Waiting for players to submit scores...
          </div>
        )}
      </div>
    </div>
  );
}
