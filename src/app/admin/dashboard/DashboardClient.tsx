'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getDashboardData, logoutAdmin, updateUserProfile, 
  addSystemScore, toggleEpisodeStatus, upsertEpisodeData,
  saveGameCode as serverSaveGameCode
} from '../actions';
import { supabase } from "@/lib/supabase";
import DynamicGameRenderer from '@/components/DynamicGameRenderer';
import QuestionTemplateGenerator from '@/components/admin/QuestionTemplateGenerator';
import { 
  Users, PlaySquare, BarChart, LogOut, Search, Settings, ShieldAlert,
  Edit2, PlusCircle, CheckCircle, XCircle, Activity, Trophy, Bot, Plus, Save, X, 
  Image as ImageIcon, Video, FileText, Trash2, Code2, Calculator, Eye, EyeOff,
  Wand2, ArrowUpDown, Star, Sparkles, ChevronDown, ChevronUp, Copy, Check, Play
} from 'lucide-react';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'episodes' | 'analytics'>('users');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [profiles, setProfiles] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [systemScores, setSystemScores] = useState<any[]>([]);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [classModal, setClassModal] = useState({ open: false, userId: '', userName: '', fullName: '', className: '' });
  const [scoreModal, setScoreModal] = useState({ open: false, userId: '', userName: '', score: 0, reason: '' });
  const [episodeModal, setEpisodeModal] = useState({ 
    open: false, 
    id: 0, 
    title: '', 
    thumbnail_url: '', 
    video_url: '', 
    description: '', 
    is_active: false,
    game_code: '' 
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // === NEW: Episode Config Panel States ===
  const [activeEpisodeTab, setActiveEpisodeTab] = useState<'info' | 'code' | 'simulate' | 'preview'>('info');
  const [codeSaving, setCodeSaving] = useState(false);
  const [codeSaved, setCodeSaved] = useState(false);
  const [showTemplateGen, setShowTemplateGen] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [simScore, setSimScore] = useState(30);
  const [simResult, setSimResult] = useState<any>(null);
  const [simLoading, setSimLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getDashboardData();
    if (data.profiles) setProfiles(data.profiles);
    if (data.episodes) setEpisodes(data.episodes);
    if (data.leaderboard) setLeaderboard(data.leaderboard);
    if (data.systemScores) setSystemScores(data.systemScores);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  const handleToggleEpisode = async (episodeId: number, currentStatus: boolean) => {
    const res = await toggleEpisodeStatus(episodeId, !currentStatus);
    if (res.success) loadData();
    else alert("Lỗi: " + res.error);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    // Live preview by creating temporary local URL
    const objectUrl = URL.createObjectURL(file);
    setEpisodeModal(prev => ({...prev, thumbnail_url: objectUrl}));

    // Standardize file name: id_timestamp.ext
    let ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    if (ext === 'jgp') ext = 'jpg'; // Fix common typo
    const fileName = `ep${episodeModal.id}_${Date.now()}.${ext}`;

    try {
       const { data, error } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

       if (error) {
          alert("Lỗi tải ảnh lên đám mây: " + error.message);
       } else {
          const { data: publicUrlData } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
          setEpisodeModal(prev => ({...prev, thumbnail_url: publicUrlData.publicUrl}));
       }
    } catch(err: any) {
       alert("Lỗi không xác định khi upload: " + err.message);
    } finally {
       setUploadingImage(false);
    }
  };

  // --- MODAL SUBMIT HANDLERS ---
  const submitClassChange = async () => {
    const res = await updateUserProfile(classModal.userId, classModal.className, classModal.fullName);
    if (res.success) {
      setClassModal({ ...classModal, open: false });
      loadData();
    } else alert("Lỗi: " + res.error);
  };

  const submitScoreChange = async () => {
    const res = await addSystemScore(scoreModal.userId, scoreModal.score, scoreModal.reason);
    if (res.success) {
      setScoreModal({ ...scoreModal, open: false });
      loadData();
    } else alert("Lỗi: " + res.error);
  };

  const submitEpisode = async () => {
    const res = await upsertEpisodeData({
      id: episodeModal.id,
      title: episodeModal.title,
      thumbnail_url: episodeModal.thumbnail_url,
      video_url: episodeModal.video_url,
      description: episodeModal.description,
      is_active: episodeModal.is_active
    });
    if (res.success) {
      // Also save game_code if present
      if (episodeModal.game_code) {
        await serverSaveGameCode(episodeModal.id, episodeModal.game_code);
      }
      setEpisodeModal({ ...episodeModal, open: false });
      loadData();
    } else alert("Lỗi: " + res.error);
  };

  // === NEW: Save Game Code ===
  const handleSaveGameCode = async () => {
    setCodeSaving(true);
    const res = await serverSaveGameCode(episodeModal.id, episodeModal.game_code);
    setCodeSaving(false);
    if (res.success) {
      setCodeSaved(true);
      setTimeout(() => setCodeSaved(false), 3000);
    } else {
      alert('Lỗi lưu code: ' + res.error);
    }
  };

  // === NEW: Score Simulator ===
  const runScoreSimulation = async () => {
    setSimLoading(true);
    try {
      // Fetch current episode scores for this episode
      const { data: epScores } = await supabase
        .from('episode_scores')
        .select('score')
        .eq('episode_id', episodeModal.id)
        .order('score', { ascending: false });

      // Fetch overall leaderboard
      const { data: overall } = await supabase
        .from('overall_leaderboard')
        .select('user_id, full_name, total_score')
        .order('total_score', { ascending: false })
        .limit(30);

      // Simulate episode ranking
      const allEpScores = (epScores || []).map(s => s.score);
      allEpScores.push(simScore);
      allEpScores.sort((a: number, b: number) => b - a);
      const epRank = allEpScores.indexOf(simScore) + 1;
      const epTotal = allEpScores.length;

      // Simulate overall ranking
      const demoCurrentTotal = 100; // Giả định user demo có 100 điểm
      const demoNewTotal = demoCurrentTotal + simScore;
      
      // Determine badge
      const getBadge = (score: number) => {
        if (score < 50) return { title: 'Chưa xếp hạng', color: 'text-slate-500' };
        if (score <= 150) return { title: 'Nhà Thám Hiểm Sơ Cấp', color: 'text-blue-400' };
        if (score <= 300) return { title: 'Kỹ Sư Sáng Tạo', color: 'text-purple-400' };
        return { title: 'Chuyên Gia Funlab', color: 'text-yellow-400' };
      };

      const oldBadge = getBadge(demoCurrentTotal);
      const newBadge = getBadge(demoNewTotal);
      const badgeChanged = oldBadge.title !== newBadge.title;

      // Calculate overall rank change
      const overallScores = (overall || []).map((o: any) => o.total_score);
      const oldRank = overallScores.filter((s: number) => s > demoCurrentTotal).length + 1;
      const newRank = overallScores.filter((s: number) => s > demoNewTotal).length + 1;

      setSimResult({
        epRank,
        epTotal,
        simScore,
        demoCurrentTotal,
        demoNewTotal,
        oldBadge,
        newBadge,
        badgeChanged,
        oldRank,
        newRank,
        rankChange: oldRank - newRank,
      });
    } catch (err: any) {
      console.error('Simulation Error:', err);
    }
    setSimLoading(false);
  };

  // === NEW: Handle Template Generator Output ===
  const handleTemplateCode = useCallback((code: string) => {
    setEpisodeModal(prev => ({ ...prev, game_code: code }));
    setShowTemplateGen(false);
    setActiveEpisodeTab('code');
  }, []);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Thầy có chắc muốn xóa tài khoản này và mọi kết quả thi của em ấy (${userName}) không? Thao tác này không thể hoàn tác!`)) {
      try {
        const res = await fetch('/api/admin/delete-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        const data = await res.json();
        if (data.success) {
          alert("Đã xóa sĩ tử thành công!");
          loadData();
        } else {
          alert("Lỗi khi xóa: " + data.error);
        }
      } catch (err: any) {
        alert("Lỗi kết nối API: " + err.message);
      }
    }
  };

  if (loading) return (
     <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-500 flex flex-col items-center animate-pulse">
           <ShieldAlert className="w-16 h-16 mb-4" />
           <p className="font-mono tracking-widest font-bold">LOADING SECURE DATA...</p>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8 overflow-x-hidden">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-6 h-6 text-red-500" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-widest">Admin Center</h1>
              <p className="text-xs text-red-400 font-mono tracking-widest">Funlab Operations Console</p>
           </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-red-950 hover:text-red-400 border border-slate-800 hover:border-red-900 rounded-lg transition-colors font-bold text-sm"
        >
          <LogOut className="w-4 h-4" /> TERMINATE SESSION
        </button>
      </header>

      {/* TABS MENU */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900/50 rounded-xl mb-8 w-fit border border-slate-800">
         <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${activeTab === 'users' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            <Users className="w-4 h-4" /> SĨ TỬ
         </button>
         <button onClick={() => setActiveTab('episodes')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${activeTab === 'episodes' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            <PlaySquare className="w-4 h-4" /> THỬ THÁCH
         </button>
         <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${activeTab === 'analytics' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            <BarChart className="w-4 h-4" /> THỐNG KÊ
         </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: SĨ TỬ */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <div className="mb-6 flex relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Tìm Tên hoặc Lớp..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
             </div>
             
             <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-x-auto block">
                <table className="w-full text-left border-collapse min-w-[700px]">
                   <thead>
                      <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-widest">
                         <th className="p-4 font-bold">Họ và Tên</th>
                         <th className="p-4 font-bold">Lớp</th>
                         <th className="p-4 font-bold">Tổng Điểm</th>
                         <th className="p-4 font-bold text-right">Thao tác Quyền lực</th>
                      </tr>
                   </thead>
                   <tbody>
                      {profiles
                        .filter(p => (p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.class_name?.toLowerCase().includes(searchTerm.toLowerCase())))
                        .map(p => {
                          const scoreObj = leaderboard.find(l => l.user_id === p.id);
                          return (
                            <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                              <td className="p-4 font-bold text-slate-200">{p.full_name || 'Vô danh'}</td>
                              <td className="p-4 text-slate-400">{p.class_name || 'Khách'}</td>
                              <td className="p-4 font-mono font-bold text-yellow-400">{scoreObj?.total_score || 0}</td>
                              <td className="p-4 flex gap-2 justify-end">
                                 <button 
                                   onClick={() => setClassModal({ open: true, userId: p.id, userName: p.full_name, fullName: p.full_name || '', className: p.class_name || '' })} 
                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/30 text-blue-400 border border-blue-900 hover:bg-blue-800 rounded-lg text-xs font-bold transition-colors"
                                 >
                                    <Edit2 className="w-3.5 h-3.5" /> SỬA LỚP / TÊN
                                 </button>
                                 <button 
                                   onClick={() => setScoreModal({ open: true, userId: p.id, userName: p.full_name, score: 0, reason: 'Thưởng/Phạt' })} 
                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 text-emerald-400 border border-emerald-900 hover:bg-emerald-800 rounded-lg text-xs font-bold transition-colors"
                                 >
                                    <PlusCircle className="w-3.5 h-3.5" /> PHẠT/THƯỞNG
                                 </button>
                                 <button 
                                   onClick={() => handleDeleteUser(p.id, p.full_name)} 
                                   className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 text-red-500 border border-red-900 hover:bg-red-800 rounded-lg text-xs font-bold transition-colors"
                                 >
                                    <Trash2 className="w-3.5 h-3.5" /> XÓA
                                 </button>
                              </td>
                            </tr>
                          );
                      })}
                   </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {/* TAB 2: EPISODES */}
        {activeTab === 'episodes' && (
          <motion.div key="episodes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <div className="flex justify-end mb-6">
                 <button 
                    onClick={() => { setEpisodeModal({ 
                      open: true, 
                      id: episodes.length > 0 ? Math.max(...episodes.map(e=>e.id)) + 1 : 1, 
                      title: 'Tập Mới', 
                      thumbnail_url: '', 
                      video_url: '', 
                      description: '', 
                      is_active: false,
                      game_code: '' 
                    }); setActiveEpisodeTab('info'); }}
                    className="flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all"
                 >
                    <Plus className="w-5 h-5" /> THÊM TẬP MỚI
                 </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {episodes.map(ep => (
                   <div key={ep.id} className={`p-6 rounded-2xl border transition-all flex flex-col ${ep.is_active ? 'bg-slate-900/80 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'bg-slate-900/40 border-slate-800 grayscale opacity-70'}`}>
                      <div className="flex justify-between items-start mb-4">
                         <h3 className="text-xl font-black text-white">{ep.title}</h3>
                         <button 
                            onClick={() => handleToggleEpisode(ep.id, ep.is_active)}
                            className={`p-2 rounded-lg border ${ep.is_active ? 'bg-cyan-950 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-600 text-slate-500'}`}
                         >
                            {ep.is_active ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                         </button>
                      </div>
                      
                      <div className="space-y-3 mb-6 flex-1">
                         <div className="flex items-center gap-2 text-sm text-slate-400"><Users className="w-4 h-4 shrink-0" /> ID Tập: <span className="font-bold text-yellow-400">{ep.id}</span></div>
                         <div className="flex items-center gap-2 text-sm text-slate-400 truncate"><ImageIcon className="w-4 h-4 shrink-0" /> Thumbnail: <span className="text-slate-500 font-mono text-xs truncate bg-black/30 px-2 py-1 rounded w-full">{ep.thumbnail_url || 'Chưa có ảnh'}</span></div>
                         <div className="flex items-center gap-2 text-sm text-slate-400 truncate"><Video className="w-4 h-4 shrink-0" /> Video URL: <span className="text-slate-500 font-mono text-xs truncate bg-black/30 px-2 py-1 rounded w-full">{ep.video_url || 'Chưa cấu hình'}</span></div>
                      </div>

                      <button onClick={() => { setEpisodeModal({ open: true, ...ep, game_code: ep.game_code || '' }); setActiveEpisodeTab('info'); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-600 transition-colors mt-auto">
                         <Settings className="w-4 h-4" /> CẤU HÌNH TẬP
                      </button>
                   </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* TAB 3: THỐNG KÊ */}
        {activeTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
                <Users className="w-12 h-12 text-indigo-400 mb-4 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2">Tổng Sĩ Tử</h4>
                <div className="text-5xl font-black text-white">{profiles.length}</div>
             </div>
             <div className="bg-gradient-to-br from-yellow-900/40 to-slate-900 border border-yellow-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
                <Trophy className="w-12 h-12 text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                <h4 className="text-sm font-bold text-yellow-500/80 uppercase tracking-widest mb-2">Trùm Máy Chủ</h4>
                <div className="text-3xl font-black text-white truncate w-full px-2">{leaderboard[0]?.full_name || 'Đang trống'}</div>
                <div className="text-yellow-400 font-mono mt-1 font-bold">{leaderboard[0]?.total_score || 0} điểm</div>
             </div>
             <div className="bg-gradient-to-br from-red-900/40 to-slate-900 border border-red-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Bot className="w-24 h-24 text-red-500" /></div>
                <Activity className="w-12 h-12 text-red-500 mb-4 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] relative z-10" />
                <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2 relative z-10">Lượt Gõ Cú -20 Điểm</h4>
                <div className="text-5xl font-black text-white relative z-10">{systemScores.filter(s => s.score === -20).length}</div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALS OVERLAYS --- */}
      <AnimatePresence>
        {/* SCORE MODAL */}
        {scoreModal.open && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-2"><PlusCircle className="text-emerald-400 w-5 h-5"/> Phạt/Thưởng</h3>
                    <button onClick={() => setScoreModal({...scoreModal, open: false})} className="text-slate-500 hover:text-white"><X className="w-6 h-6"/></button>
                 </div>
                 <div className="mb-4">
                    <p className="text-sm text-slate-400 mb-1">Đối tượng:</p>
                    <p className="font-bold text-lg text-emerald-400">{scoreModal.userName}</p>
                 </div>
                 <div className="space-y-4 mb-6">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Điểm số (Có thể âm)</label>
                       <input type="number" value={scoreModal.score} onChange={e => setScoreModal({...scoreModal, score: Number(e.target.value)})} className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white font-mono" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Lý do ghi chú</label>
                       <input type="text" value={scoreModal.reason} onChange={e => setScoreModal({...scoreModal, reason: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white" />
                    </div>
                 </div>
                 <button onClick={submitScoreChange} className="w-full p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors">
                    <Save className="w-5 h-5" /> THỰC THI
                 </button>
              </motion.div>
           </motion.div>
        )}

        {/* CLASS MODAL */}
         {classModal.open && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-2"><Edit2 className="text-blue-400 w-5 h-5"/> Sửa Thông Tin</h3>
                    <button onClick={() => setClassModal({...classModal, open: false})} className="text-slate-500 hover:text-white"><X className="w-6 h-6"/></button>
                 </div>
                 <div className="mb-4">
                    <p className="text-sm text-slate-400 mb-1">ID Học sinh:</p>
                    <p className="font-mono text-xs text-blue-400 bg-blue-900/20 p-2 rounded truncate">{classModal.userId}</p>
                 </div>
                 <div className="space-y-4 mb-6">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Họ và Tên</label>
                       <input autoFocus type="text" value={classModal.fullName} onChange={e => setClassModal({...classModal, fullName: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white" placeholder="VD: Nguyễn Văn A" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Đăng ký lớp mới</label>
                       <input type="text" value={classModal.className} onChange={e => setClassModal({...classModal, className: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white" placeholder="VD: 10A1" />
                    </div>
                 </div>
                 <button onClick={submitClassChange} className="w-full p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors">
                    <Save className="w-5 h-5" /> LƯU THAY ĐỔI
                 </button>
              </motion.div>
           </motion.div>
        )}

         {/* EPISODE MODAL — UPGRADED */}
         {episodeModal.open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex py-4 items-start justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl shadow-2xl my-auto">
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-20 rounded-t-2xl">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-950 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                           <Settings className="text-cyan-400 w-5 h-5"/>
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-white">Cấu Hình Tập {episodeModal.id}</h3>
                           <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Episode Configuration Console</p>
                        </div>
                     </div>
                     <button onClick={() => setEpisodeModal({...episodeModal, open: false})} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-lg transition-colors hover:bg-red-900/50">
                        <X className="w-5 h-5"/>
                     </button>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex gap-1 p-2 mx-6 mt-4 bg-slate-950/50 rounded-xl border border-slate-800 w-fit">
                     {[
                        { key: 'info', label: 'THÔNG TIN', icon: FileText },
                        { key: 'code', label: 'CODE GAME', icon: Code2 },
                        { key: 'simulate', label: 'MÔ PHỎNG ĐIỂM', icon: Calculator },
                        { key: 'preview', label: 'XEM THỬ GAME', icon: Eye },
                     ].map(tab => {
                        const Icon = tab.icon;
                        return (
                           <button 
                              key={tab.key} 
                              onClick={() => setActiveEpisodeTab(tab.key as any)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs tracking-wide transition-all ${
                                 activeEpisodeTab === tab.key 
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' 
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                              }`}
                           >
                              <Icon className="w-3.5 h-3.5" /> {tab.label}
                           </button>
                        );
                     })}
                  </div>
                  
                  <div className="p-6">
                     {/* ════════ TAB 1: THÔNG TIN ════════ */}
                     {activeEpisodeTab === 'info' && (
                        <div className="flex flex-col md:flex-row gap-8">
                           <div className="flex-1 space-y-5">
                              <div className="flex gap-4">
                                 <div className="w-1/3">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Settings className="w-3.5 h-3.5" /> ID Tập</label>
                                    <input type="number" readOnly value={episodeModal.id} className="w-full bg-black/80 border border-slate-700/50 rounded-lg p-3 text-yellow-400 font-mono font-black border-dashed" />
                                 </div>
                                 <div className="w-2/3">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Edit2 className="w-3.5 h-3.5" /> Tiêu đề Tập</label>
                                    <input type="text" value={episodeModal.title} onChange={e => setEpisodeModal({...episodeModal, title: e.target.value})} className="w-full bg-black/50 border border-slate-700 focus:border-cyan-500 rounded-lg p-3 text-white transition-colors" />
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Link Thumbnail</label>
                                 <div className="flex gap-2">
                                    <input type="text" readOnly value={episodeModal.thumbnail_url} className="w-full bg-black/30 border border-slate-700/50 rounded-lg p-3 text-slate-400 font-mono text-sm opacity-60 cursor-not-allowed" placeholder="URL ảnh sẽ hiện tự động..." />
                                    <input type="file" accept="image/*" id="thumbnail-upload" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                                    <label htmlFor="thumbnail-upload" className={`flex items-center gap-2 whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                       {uploadingImage ? <span className="animate-spin text-lg">🌀</span> : <ImageIcon className="w-4 h-4" />}
                                       <span className="hidden sm:inline">{uploadingImage ? 'ĐANG TẢI...' : 'TẢI ẢNH'}</span>
                                    </label>
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Video className="w-3.5 h-3.5" /> Link Video Youtube</label>
                                 <input type="text" value={episodeModal.video_url} onChange={e => setEpisodeModal({...episodeModal, video_url: e.target.value})} className="w-full bg-black/50 border border-slate-700 focus:border-cyan-500 rounded-lg p-3 text-slate-200 font-mono text-sm transition-colors" placeholder="https://youtube.com/watch?..." />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Mô tả</label>
                                 <textarea rows={3} value={episodeModal.description} onChange={e => setEpisodeModal({...episodeModal, description: e.target.value})} className="w-full bg-black/50 border border-slate-700 focus:border-cyan-500 rounded-lg p-3 text-slate-200 transition-colors" placeholder="Mô tả ngắn về tập..." />
                              </div>
                           </div>
                           <div className="w-full md:w-5/12 shrink-0 flex flex-col">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Live Preview</label>
                              <div className="w-full aspect-video rounded-xl bg-black border-2 border-slate-800 border-dashed overflow-hidden relative flex items-center justify-center group mb-4">
                                 {episodeModal.thumbnail_url ? (
                                    <>
                                       <div className="absolute inset-0 bg-cyan-500/20 blur-2xl"></div>
                                       {/* eslint-disable-next-line @next/next/no-img-element */}
                                       <img src={episodeModal.thumbnail_url} alt="Preview" className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                    </>
                                 ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-600 p-6 text-center">
                                       <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                                       <span className="font-black text-lg text-slate-500 uppercase tracking-widest">Tập {episodeModal.id}</span>
                                    </div>
                                 )}
                              </div>
                              <button onClick={submitEpisode} className="w-full mt-auto p-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-black text-lg tracking-widest flex justify-center items-center gap-3 transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                                 <Save className="w-6 h-6" /> LƯU CHÍNH THỨC
                              </button>
                           </div>
                        </div>
                     )}

                     {/* ════════ TAB 2: CODE GAME ════════ */}
                     {activeEpisodeTab === 'code' && (
                        <div className="space-y-6">
                           <div className="flex flex-wrap gap-3 items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <Code2 className="w-5 h-5 text-cyan-400" />
                                 <h4 className="text-lg font-black text-white uppercase tracking-widest">Game Component Code</h4>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => setShowTemplateGen(!showTemplateGen)} className="flex items-center gap-2 px-4 py-2 bg-purple-900/40 text-purple-400 border border-purple-700 hover:bg-purple-800 rounded-lg text-xs font-bold transition-colors">
                                    <Wand2 className="w-3.5 h-3.5" /> {showTemplateGen ? 'ẨN FORM' : 'TẠO ĐỀ TỰ ĐỘNG'}
                                 </button>
                                 <button onClick={handleSaveGameCode} disabled={codeSaving} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${codeSaved ? 'bg-green-600 text-white' : 'bg-cyan-900/40 text-cyan-400 border border-cyan-700 hover:bg-cyan-800'} ${codeSaving ? 'opacity-50' : ''}`}>
                                    {codeSaved ? <><Check className="w-3.5 h-3.5" /> ĐÃ LƯU!</> : codeSaving ? <>⏳ ĐANG LƯU...</> : <><Save className="w-3.5 h-3.5" /> LƯU CODE</>}
                                 </button>
                              </div>
                           </div>

                           {showTemplateGen && <QuestionTemplateGenerator onCodeGenerated={handleTemplateCode} />}

                           <div className="relative">
                              <div className="absolute top-3 right-3 z-10">
                                 <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-1 rounded">{(episodeModal.game_code || '').length} chars</span>
                              </div>
                              <textarea
                                 value={episodeModal.game_code}
                                 onChange={e => setEpisodeModal(prev => ({ ...prev, game_code: e.target.value }))}
                                 rows={20}
                                 className="w-full bg-black/80 border border-slate-700 rounded-xl p-4 text-green-400 font-mono text-sm leading-relaxed focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-colors resize-y"
                                 placeholder={'// Dán code game vào đây...\n// Hoặc bấm "TẠO ĐỀ TỰ ĐỘNG" để generate.\n//\n// Các biến có sẵn:\n// React, useState, useEffect, useMemo, useCallback, useRef\n// Icons (Flame, Award, Play, Star, Trophy, ...)\n// createClient (Supabase client)\n//\n// Code phải kết thúc bằng: return Game;\n\nfunction Game({ onGameComplete }) {\n  // ... logic game ...\n  return React.createElement(\'div\', null, \'Hello!\');\n}\n\nreturn Game;'}
                                 spellCheck={false}
                              />
                           </div>

                           <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                              <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Hướng dẫn nhanh</h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-500">
                                 <div className="bg-black/30 p-3 rounded-lg">
                                    <p className="font-bold text-cyan-400 mb-1">1. Dán code</p>
                                    <p>Copy code game, dán vào ô trên. Kết thúc bằng <code className="text-green-400">return Game;</code></p>
                                 </div>
                                 <div className="bg-black/30 p-3 rounded-lg">
                                    <p className="font-bold text-cyan-400 mb-1">2. Template</p>
                                    <p>Bấm <span className="text-purple-400">TẠO ĐỀ TỰ ĐỘNG</span> → nhập câu hỏi → GENERATE</p>
                                 </div>
                                 <div className="bg-black/30 p-3 rounded-lg">
                                    <p className="font-bold text-cyan-400 mb-1">3. Test</p>
                                    <p>Chuyển tab <span className="text-cyan-400">XEM THỬ GAME</span> để chạy thử trước.</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* ════════ TAB 3: MÔ PHỎNG TÍNH ĐIỂM ════════ */}
                     {activeEpisodeTab === 'simulate' && (
                        <div className="space-y-6">
                           <div className="flex items-center gap-3 mb-2">
                              <Calculator className="w-6 h-6 text-amber-400" />
                              <h4 className="text-lg font-black text-white uppercase tracking-widest">Mô Phỏng Tính Điểm</h4>
                           </div>
                           <p className="text-sm text-slate-400">Nhập điểm giả định để xem tác động lên Bảng Xếp Hạng.</p>

                           <div className="flex flex-col sm:flex-row gap-4 items-end">
                              <div className="flex-1">
                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Điểm game giả định</label>
                                 <div className="flex items-center gap-3">
                                    <input type="range" min={0} max={50} value={simScore} onChange={e => setSimScore(Number(e.target.value))} className="flex-1 accent-amber-500 h-2" />
                                    <div className="bg-black/60 border border-amber-500/30 rounded-xl px-4 py-2 text-amber-400 font-mono font-black text-2xl min-w-[80px] text-center">{simScore}</div>
                                    <span className="text-slate-500 text-sm font-bold">/ 50</span>
                                 </div>
                              </div>
                              <button onClick={runScoreSimulation} disabled={simLoading} className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50">
                                 {simLoading ? <>⚙️ ĐANG TÍNH...</> : <><ArrowUpDown className="w-4 h-4" /> MÔ PHỎNG</>}
                              </button>
                           </div>

                           {simResult && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                 <div className="bg-slate-800/50 border border-cyan-500/20 rounded-2xl p-6">
                                    <h5 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Trophy className="w-4 h-4" /> BXH Hàng Tập {episodeModal.id}</h5>
                                    <div className="space-y-3">
                                       <div className="flex justify-between items-center">
                                          <span className="text-slate-400 text-sm">Điểm:</span>
                                          <span className="text-cyan-400 font-mono font-bold text-lg">{simResult.simScore} HP</span>
                                       </div>
                                       <div className="flex justify-between items-center">
                                          <span className="text-slate-400 text-sm">Vị trí:</span>
                                          <span className="text-white font-black text-xl">#{simResult.epRank} <span className="text-slate-500 text-sm font-normal">/ {simResult.epTotal}</span></span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="bg-slate-800/50 border border-yellow-500/20 rounded-2xl p-6">
                                    <h5 className="text-sm font-black text-yellow-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Star className="w-4 h-4" /> BXH Tổng Năm Học</h5>
                                    <div className="space-y-3">
                                       <div className="flex justify-between items-center">
                                          <span className="text-slate-400 text-sm">Tổng cũ → mới:</span>
                                          <span className="text-yellow-400 font-mono font-bold">{simResult.demoCurrentTotal} + {simResult.simScore} = {simResult.demoNewTotal}</span>
                                       </div>
                                       <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                                          <span className="text-slate-400 text-sm">Danh hiệu:</span>
                                          <div className="text-right">
                                             <span className={`font-bold ${simResult.newBadge.color}`}>{simResult.newBadge.title}</span>
                                             {simResult.badgeChanged && (
                                                <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-1">
                                                   <Sparkles className="w-3 h-3" /> THĂNG HẠNG!
                                                </div>
                                             )}
                                          </div>
                                       </div>
                                       {simResult.rankChange > 0 && (
                                          <div className="bg-green-950/50 border border-green-500/30 rounded-xl p-3 text-center">
                                             <span className="text-green-400 font-black text-sm">📈 Tăng {simResult.rankChange} bậc</span>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           )}

                           {!simResult && (
                              <div className="text-center p-12 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700/50">
                                 <Calculator className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                 <p className="text-slate-500 font-medium">Kéo thanh điểm và bấm <span className="text-amber-400 font-bold">MÔ PHỎNG</span>.</p>
                              </div>
                           )}
                        </div>
                     )}

                     {/* ════════ TAB 4: XEM THỬ GAME ════════ */}
                     {activeEpisodeTab === 'preview' && (
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <Eye className="w-6 h-6 text-green-400" />
                                 <h4 className="text-lg font-black text-white uppercase tracking-widest">Live Preview</h4>
                              </div>
                              <button onClick={() => setPreviewActive(!previewActive)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${previewActive ? 'bg-red-900/40 text-red-400 border border-red-700 hover:bg-red-800' : 'bg-green-900/40 text-green-400 border border-green-700 hover:bg-green-800'}`}>
                                 {previewActive ? <><EyeOff className="w-4 h-4" /> TẮT PREVIEW</> : <><Play className="w-4 h-4" /> CHẠY THỬ GAME</>}
                              </button>
                           </div>

                           {!episodeModal.game_code ? (
                              <div className="text-center p-16 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700/50">
                                 <Code2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                 <p className="text-slate-500 font-medium">Chưa có code. Chuyển tab <span className="text-cyan-400 font-bold">CODE GAME</span> để dán code trước.</p>
                              </div>
                           ) : previewActive ? (
                              <div className="bg-black border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.1)]" style={{ minHeight: 600 }}>
                                 <DynamicGameRenderer 
                                    gameCode={episodeModal.game_code} 
                                    onGameComplete={(payload) => {
                                       alert(`[SANDBOX] Game hoàn thành!\n\nĐiểm: ${payload.score}\nThời gian: ${payload.timeInSeconds}s\nLevel: ${payload.level}\n\n(Điểm này KHÔNG được ghi vào DB)`);
                                    }}
                                    sandboxMode={true}
                                 />
                              </div>
                           ) : (
                              <div className="text-center p-16 bg-slate-800/20 rounded-2xl border border-dashed border-green-700/30">
                                 <Play className="w-12 h-12 text-green-700 mx-auto mb-3" />
                                 <p className="text-slate-500 font-medium">Bấm <span className="text-green-400 font-bold">CHẠY THỬ GAME</span> để xem thử.</p>
                                 <p className="text-slate-600 text-xs mt-2">Sandbox: không ghi vào CSDL thật.</p>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
