"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveLeaderboard } from "@/components/LiveLeaderboard";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { saveGameScore } from "@/app/actions/gameActions";
import { LogIn, Lock } from "lucide-react";
import dynamic from "next/dynamic";

import { episodes } from "@/data/episodes";

// [L-06] Lazy load game components — chỉ tải khi học sinh thực sự vào tập đó
//         Tiết kiệm ~200KB bundle size ban đầu
const GameLoading = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 12, color: "#22d3ee", fontFamily: "monospace" }}>
    <div style={{ width: 24, height: 24, border: "3px solid #22d3ee", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <span>Đang tải thử thách...</span>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const Tap1Suckmanhkhiquyen   = dynamic(() => import("@/components/games/Tap1Suckmanhkhiquyen"),   { loading: GameLoading, ssr: false });
const Tap1Game_v2            = dynamic(() => import("@/components/games/Tap1Game_v2"),            { loading: GameLoading, ssr: false });
const Tap2Game               = dynamic(() => import("@/components/games/Tap2Game"),               { loading: GameLoading, ssr: false });
const Tap3Game               = dynamic(() => import("@/components/games/Tap3Game"),               { loading: GameLoading, ssr: false });
const Tap4Game               = dynamic(() => import("@/components/games/Tap4Game"),               { loading: GameLoading, ssr: false });
const Tap5Game               = dynamic(() => import("@/components/games/Tap5Game"),               { loading: GameLoading, ssr: false });
const Tap6Bantayvohinh       = dynamic(() => import("@/components/games/Tap6Bantayvohinh"),       { loading: GameLoading, ssr: false });
const Tap7ChienDichCuuHoa    = dynamic(() => import("@/components/games/Tap7ChienDichCuuHoa"),    { loading: GameLoading, ssr: false });
const DynamicGameRenderer    = dynamic(() => import("@/components/DynamicGameRenderer"),          { loading: GameLoading, ssr: false });

// TỪ ĐIỂN MAPPER GAME - Thêm các tập khác vào đây
const GAME_COMPONENTS: Record<number, React.ElementType> = {
  1: Tap1Game_v2,
  2: Tap2Game,
  3: Tap3Game,
  4: Tap4Game,
  5: Tap5Game,
  6: Tap6Bantayvohinh,
  7: Tap7ChienDichCuuHoa,
};

export default function EpisodePage() {
  // [FIX T-01] useMemo cho supabase client
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const router = useRouter();
  const episodeId = Number(params.id) || 1;
  const [messages, setMessages] = useState<string[]>([]);
  const [badgeUnlock, setBadgeUnlock] = useState<string | null>(null);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState<{name: string, score: number} | null>(null);
  const [toast, setToast] = useState<{type: 'success' | 'error' | 'warning', message: string} | null>(null);
  // [P3-02] Auth state
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [dbEpisode, setDbEpisode] = useState<any>(null);

  const activeEpisode = episodes.find((e) => e.id === episodeId) || episodes[0];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({data}) => {
          if (data) setCurrentProfile(data);
        });
      }
      // [P3-02] Dù có user hay không cũng tắt loading
      setAuthLoading(false);
    });

    // Fetch live episode data from DB
    supabase.from('episodes').select('*').eq('id', episodeId).single().then(({data}) => {
      if (data) setDbEpisode(data);
    });
  }, [episodeId]);

  const getValidYoutubeId = (urlOrId: string) => {
    if (!urlOrId) return null;
    const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
    return match ? match[1] : urlOrId;
  };

  const finalVideoId = (dbEpisode?.video_url ? getValidYoutubeId(dbEpisode.video_url) : activeEpisode?.youtubeId) || 'RACbCcHf';

  // [FIX lỗi #4 – audit 2026-08-21] Trước đây hàm này tự query bảng `leaderboard`
  // (đã deprecated, không thuộc kiến trúc đa mùa), khớp theo student_name (dễ trùng
  // tên) và đoán "điểm cũ = điểm mới - 10" — sai lệch với ngưỡng badge thật sự trong
  // grant_badge_if_eligible (badge_schema.sql). Badge giờ được tính server-side ngay
  // trong saveGameScore() (cùng season, cùng user_id, cùng ngưỡng với DB) và trả về
  // qua res.badgeUnlocked — xem handleGameComplete bên dưới.

  // Helper hiển thị toast notification
  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleGameComplete = async (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => {
    const studentName = currentProfile?.full_name || "Tuyển thủ Funlab";
    const className = currentProfile?.class_name || "Khách";

    const { score, timeInSeconds, level, answersLog } = payload;

    const logMsg = `[Game Completed] Player: ${studentName}, Score: ${score}, Time: ${timeInSeconds}s, Level: ${level}`;
    setMessages(prev => [logMsg, ...prev].slice(0, 5));

    setShowSuccessCelebration({ name: studentName, score });
    setTimeout(() => setShowSuccessCelebration(null), 5000);

    // [P3-02] Chỉ submit nếu đã đăng nhập — không dùng guest ID nữa
    if (!currentUser?.id) {
      showToast('warning', '⚠️ Bạn cần đăng nhập để lưu điểm!');
      return;
    }
    const validUserId = currentUser.id;

    const res = await saveGameScore(validUserId, episodeId, payload);
    
    if (res.success) {
      const successMsg = `[Realtime] Đã gửi điểm số thành công về hệ thống Admin Funlab!`;
      setMessages(prev => [successMsg, ...prev].slice(0, 5));
      showToast('success', `🎉 ${res.message}`);
      if (res.badgeUnlocked) {
        setBadgeUnlock(res.badgeUnlocked);
        setTimeout(() => setBadgeUnlock(null), 7000);
      }
    } else if (res.alreadySubmitted) {
      setMessages(prev => [`[Blocked] ${res.error}`, ...prev].slice(0, 5));
      showToast('warning', `⚠️ ${res.error}`);
    } else {
      setMessages(prev => [`[Error] ${res.error}`, ...prev].slice(0, 5));
      showToast('error', `❌ Lỗi lưu điểm: ${res.error}`);
    }
  };

  const StaticGameComponent = GAME_COMPONENTS[episodeId];
  const hasDynamicGame = !StaticGameComponent && dbEpisode?.game_code;

  // [P3-02] Auth loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-mono text-sm tracking-widest animate-pulse">ĐANG XÁC THỰC...</p>
        </div>
      </div>
    );
  }

  // [P3-02] Auth gate — hiển thị màn hình khóa nếu chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_60%)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-sm w-full text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Lock className="w-9 h-9 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-2">Cần Đăng Nhập</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bạn cần có tài khoản Funlab để tham gia chơi game và ghi điểm vào bảng xếp hạng.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/login?next=/episode/${episodeId}`)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all shadow-[0_8px_24px_rgba(6,182,212,0.3)] hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              Đăng Nhập Ngay
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors border border-slate-700"
            >
              ← Về Trang Chủ
            </button>
          </div>
          <p className="text-xs text-slate-600 font-mono">FUNLAB CHALLENGE · VA SCIENCE CLUB</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Left Column: Video, Leaderboard & Debugger */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen flex flex-col bg-slate-900 border-r border-slate-800">
        <div className="p-5 md:p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shrink-0">
          <h1 className="text-lg md:text-2xl font-bold flex items-center gap-3 flex-1 min-w-0">
            <span className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xs md:text-sm shadow-lg shadow-purple-500/20 shadow-inner">
              ▶
            </span>
            <span className="truncate" title={dbEpisode?.title || activeEpisode?.title}>
              {dbEpisode?.title || activeEpisode?.title}
            </span>
          </h1>
          <a href="/" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition font-medium text-sm text-slate-300 border border-slate-700">
            Back to Home
          </a>
        </div>
        
        {/* Scrollable Main Area containing Video + Leaderboard + Logs */}
        <div className="flex-1 p-6 flex flex-col justify-start max-w-2xl mx-auto w-full overflow-y-auto overflow-x-hidden custom-scrollbar pb-20 md:pb-6">
          {/* YouTube Video Embed */}
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-slate-700 relative group bg-black mb-8 shrink-0">
            <iframe 
              className="w-full h-full absolute inset-0"
              src={`https://www.youtube.com/embed/${finalVideoId}?autoplay=0`} 
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
                  <span className="animate-pulse">_</span> Đang chờ lệnh từ hệ thống Game...
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

      {/* Right Column: Dynamic Game Component Mapper */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:h-screen bg-slate-950 flex flex-col relative shadow-[-10px_0_30px_rgba(0,0,0,0.8)] z-20 border-t md:border-t-0 border-slate-800">

        {/* Toast Notification */}
        {toast && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-xl border text-sm font-semibold shadow-2xl backdrop-blur-md max-w-xs text-center transition-all ${
            toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
            : toast.type === 'warning' ? 'bg-yellow-950/90 border-yellow-500 text-yellow-200'
            : 'bg-rose-950/90 border-rose-500 text-rose-200'
          }`}>
            {toast.message}
          </div>
        )}

        {StaticGameComponent ? (
          <div className="w-full h-full overflow-hidden flex flex-col rounded-tl-none md:rounded-tl-3xl border-l border-slate-800/50 bg-black/50 z-10 relative">
            {/* Static Game Component (Tập 1-7) */}
            <StaticGameComponent onGameComplete={handleGameComplete} />
          </div>
        ) : hasDynamicGame ? (
          <div className="w-full h-full overflow-hidden flex flex-col rounded-tl-none md:rounded-tl-3xl border-l border-slate-800/50 bg-black/50 z-10 relative">
            {/* Dynamic Game Component (Tập 8+ - render từ game_code trong DB) */}
            <DynamicGameRenderer gameCode={dbEpisode.game_code} onGameComplete={handleGameComplete} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 rounded-tl-none md:rounded-tl-3xl border-l border-slate-800/50 z-10 relative">
             <div className="absolute top-4 right-4 z-10 bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xl border border-slate-700 opacity-90 backdrop-blur flex items-center gap-2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div> Local Runtime
             </div>
             <div className="text-6xl mb-6 opacity-30">🚧</div>
             <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase tracking-widest text-center">Tập này chưa mở</h3>
             <p className="text-slate-500 text-sm text-center max-w-sm">
                Component Game của tập {episodeId} chưa được đăng ký trong hệ thống Game Mapper. Vui lòng quay lại sau!
             </p>
          </div>
        )}

        {/* --- Cảnh Báo Chúc Mừng Sau Khi Chơi Xong Game --- */}
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
                     HOÀN THÀNH TỐT!
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
                  <p className="mt-5 text-green-400 text-sm font-semibold animate-pulse z-10 relative">Điểm đã được ghim vào Bảng Vàng!</p>
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
                  <h2 className="text-xl font-bold text-slate-300 uppercase tracking-widest mb-2 z-10 relative">Mở khóa Danh Hiệu mới!</h2>
                  <div className="text-5xl my-6 z-10 relative drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] filter">🎖️</div>
                  <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 drop-shadow-sm z-10 relative">
                    {badgeUnlock}
                  </h3>
                  <p className="mt-4 text-cyan-300 font-medium z-10 relative">Chúc mừng bạn thăng hạng trên Bảng Vàng Thế Giới!</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
