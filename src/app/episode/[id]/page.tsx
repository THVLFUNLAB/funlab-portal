"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LiveLeaderboard } from "@/components/LiveLeaderboard";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

import { episodes } from "@/data/episodes";

export default function EpisodePage() {
  const params = useParams();
  const episodeId = Number(params.id) || 1;
  const [messages, setMessages] = useState<string[]>([]);
  const [badgeUnlock, setBadgeUnlock] = useState<string | null>(null);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState<{name: string, score: number} | null>(null);
  
  const activeEpisode = episodes.find((e) => e.id === episodeId) || episodes[0];
  const activeQuiz = activeEpisode.quizList?.[0];

  const checkBadgeUnlocks = async (studentName: string) => {
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase");
    if (isMock) {
       setBadgeUnlock('Nhà Thám Hiểm Sơ Cấp');
       setTimeout(() => setBadgeUnlock(null), 5000);
       return;
    }
    const { data } = await supabase.from("leaderboard").select("score").eq("student_name", studentName);
    if (!data) return;
    
    const totalScore = data.reduce((sum, row) => sum + row.score, 0);
    const oldScore = totalScore - 10;
    
    if (totalScore >= 301 && oldScore < 301) setBadgeUnlock("Chuyên Gia Funlab: Master");
    else if (totalScore >= 151 && oldScore < 151) setBadgeUnlock("Kỹ Sư Sáng Tạo");
    else if (totalScore >= 50 && oldScore < 50) setBadgeUnlock("Nhà Thám Hiểm Sơ Cấp");
    
    if (totalScore >= 50 && oldScore < 50 || totalScore >= 151 && oldScore < 151 || totalScore >= 301 && oldScore < 301) {
       setTimeout(() => setBadgeUnlock(null), 7000);
    }
  };

  useEffect(() => {
    // Hàm 'Listen for Score' lắng nghe kết quả từ Canvas game
    const listenForScore = async (event: MessageEvent) => {
      const data = event.data;
      
      // Chấp nhận nhiều định dạng message từ canvas iframe
      if (data && (data.type === 'GAME_OVER' || data.type === 'SUBMIT_SCORE' || typeof data.score === 'number')) {
        const studentName = data.studentName || data.name || "Tuyển thủ Funlab";
        const score = Number(data.score) || 10;

        const logMsg = `[Canvas Score Received] Student: ${studentName}, Score: ${score}`;
        console.log(logMsg);
        setMessages(prev => [logMsg, ...prev].slice(0, 5));

        // Hiện thông báo chúc mừng kịch tính ngay lập tức
        setShowSuccessCelebration({ name: studentName, score });
        setTimeout(() => setShowSuccessCelebration(null), 5000);

        const newEntry = {
          episode_id: episodeId,
          student_name: studentName,
          score: score
        };

        const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase");
        
        if (isMock) {
          const mockData = { id: Date.now(), ...newEntry, created_at: new Date().toISOString() };
          window.dispatchEvent(new CustomEvent("mock_leaderboard_insert", { detail: mockData }));
          setMessages(prev => [`[Mock Mode] Score saved locally to simulator!`, ...prev].slice(0, 5));
          checkBadgeUnlocks(studentName);
        } else {
          try {
            const { error } = await supabase.from('leaderboard').insert([newEntry]);
            if (error) {
              setMessages(prev => [`[Error] Failed to save score: ${error.message}`, ...prev].slice(0, 5));
            } else {
              setMessages(prev => [`[Success] Inserted into Supabase database!`, ...prev].slice(0, 5));
              checkBadgeUnlocks(studentName);
            }
          } catch(e) {
             console.error("Client Error", e);
          }
        }
      }
    };

    window.addEventListener('message', listenForScore);
    return () => window.removeEventListener('message', listenForScore);
  }, [episodeId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Left Column: Video, Leaderboard & Debugger */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen flex flex-col bg-slate-900 border-r border-slate-800">
        <div className="p-5 md:p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shrink-0">
          <h1 className="text-lg md:text-2xl font-bold flex items-center gap-3 flex-1 min-w-0">
            <span className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xs md:text-sm shadow-lg shadow-purple-500/20 shadow-inner">
              ▶
            </span>
            <span className="truncate" title={activeEpisode?.title}>
              {activeEpisode?.title}
            </span>
          </h1>
          <a href="/" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition font-medium text-sm text-slate-300 border border-slate-700">
            Back to Home
          </a>
        </div>
        
        {/* Scrollable Main Area containing Video + Leaderboard + Logs */}
        <div className="flex-1 p-6 flex flex-col justify-start max-w-2xl mx-auto w-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* YouTube Video Embed */}
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-slate-700 relative group bg-black mb-8 shrink-0">
            <iframe 
              className="w-full h-full absolute inset-0"
              src={`https://www.youtube.com/embed/${activeEpisode?.youtubeId}?autoplay=0`} 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>

          {/* Gamified Live Leaderboard */}
          <LiveLeaderboard episodeId={episodeId} />
          
          {/* Debugging Console */}
          <div className="w-full bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-inner flex flex-col shrink-0 mt-8 mb-4">
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <h3 className="text-xs font-semibold text-slate-400 ml-2 uppercase tracking-wider">System Logs (API Integration)</h3>
            </div>
            <div className="p-4 h-32 overflow-y-auto font-mono text-sm max-h-32">
              {messages.length === 0 ? (
                <span className="text-slate-500 flex items-center gap-2">
                  <span className="animate-pulse">_</span> Waiting for events from iframe...
                </span>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg, idx) => (
                    <div key={idx} className="text-green-400 bg-green-400/10 px-3 py-2 rounded border border-green-400/20">
                      <span className="text-slate-500 mr-2">{new Date().toLocaleTimeString()}</span>
                      {msg}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Game Iframe */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-screen bg-slate-950 flex flex-col relative shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-20 border-t md:border-t-0 border-slate-800">
        <div className="absolute top-4 right-4 z-10 bg-slate-800 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xl border border-cyan-500/30 opacity-90 backdrop-blur flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div> Thử Thách Canvas
        </div>
        
        <iframe 
          className="w-full h-full border-none bg-slate-950 rounded-tl-none md:rounded-tl-3xl shadow-inner border-l border-slate-800/50 z-10 relative"
          title="Interactive Canvas Game"
          sandbox="allow-scripts allow-same-origin allow-popups"
          src={activeEpisode?.canvasUrl || "https://html5.gamedistribution.com/b97669d67ba54dbbbad5579997fd6ff2/"} 
        />

        {/* --- Cảnh Báo Chúc Mừng Sau Khi Chơi Xong Canvas --- */}
        <AnimatePresence>
          {showSuccessCelebration && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.5, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
               transition={{ type: "spring", damping: 12, stiffness: 200 }}
               className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm pointer-events-none"
            >
               <div className="bg-slate-900 border border-green-400 p-8 rounded-[2.5rem] shadow-[0_0_80px_rgba(74,222,128,0.4)] text-center relative overflow-hidden w-full max-w-md pointer-events-auto">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-300 to-green-500"></div>
                  <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                     className="absolute -top-32 -left-32 w-64 h-64 bg-green-500/20 blur-[50px] rounded-full"
                  />
                  <div className="text-6xl mb-4 z-10 relative drop-shadow-[0_0_20px_rgba(74,222,128,0.8)] filter">🚀</div>
                  <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-emerald-600 uppercase tracking-tight mb-2 z-10 relative">
                     THÀNH CÔNG!
                  </h2>
                  <p className="mt-2 text-slate-300 text-lg font-medium z-10 relative">
                    Xuất sắc, <strong className="text-white">{showSuccessCelebration.name}</strong>!
                  </p>
                  <div className="mt-4 bg-slate-800/80 rounded-xl py-3 border border-slate-700 relative z-10 lg:mx-8">
                    <p className="text-sm text-slate-400">Bạn vừa ghi thêm</p>
                    <p className="text-4xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                      +{showSuccessCelebration.score} ĐIỂM
                    </p>
                  </div>
                  <p className="mt-5 text-green-400 text-sm font-semibold animate-pulse z-10 relative">Dữ liệu đã được lưu vào Bảng Vàng!</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Gamified Badge Unlock Alert Overlay --- */}
        <AnimatePresence>
          {badgeUnlock && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
               transition={{ type: "spring", damping: 15, stiffness: 200 }}
               className="absolute inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm pointer-events-none"
            >
               <div className="bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-cyan-400 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(34,211,238,0.3)] text-center relative overflow-hidden w-full max-w-sm pointer-events-auto shadow-inner">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-500"></div>
                  <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full"
                  />
                  <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest mb-2 z-10 relative">Mở khóa huy hiệu mới!</h2>
                  <div className="text-5xl my-6 z-10 relative drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] filter">🎖️</div>
                  <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 drop-shadow-sm z-10 relative">
                    {badgeUnlock}
                  </h3>
                  <p className="mt-4 text-cyan-300 font-medium z-10 relative">Chúc mừng bạn thăng hạng!</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
