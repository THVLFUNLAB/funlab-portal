'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Loader2, Sparkles, GraduationCap, ChevronRight } from 'lucide-react';

const CLASS_GROUPS = [
  {
    label: "KHỐI THCS",
    blocks: [
      { name: "Khối 6", prefix: "6A", count: 7 },
      { name: "Khối 7", prefix: "7B", count: 7 },
      { name: "Khối 8", prefix: "8C", count: 7 },
      { name: "Khối 9", prefix: "9D", count: 7 },
    ]
  },
  {
    label: "KHỐI THPT",
    blocks: [
      { name: "Khối 10", prefix: "10A", count: 3 },
      { name: "Khối 11", prefix: "11B", count: 3 },
      { name: "Khối 12", prefix: "12C", count: 3 },
    ]
  }
];

export default function MandatoryProfileModal() {
  const supabase = createClient();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, class_name')
        .eq('id', user.id)
        .single();
      
      if (!profile || !profile.full_name || !profile.class_name) {
        setShow(true);
        if (profile) {
          if (profile.full_name) setFullName(profile.full_name);
          if (profile.class_name) setClassName(profile.class_name);
        }
      }
      
      setLoading(false);
    }

    checkProfile();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !className) {
      setError("Vui lòng điền đầy đủ Họ tên và chọn Lớp của em.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName.trim(),
        class_name: className,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      setError("Lỗi cập nhật: " + upsertError.message);
      setSubmitting(false);
    } else {
      setShow(false);
      // Có thể reload hoặc thông báo thành công
      window.location.reload();
    }
  };

  if (loading || !show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        {/* Backdrop lấp lánh và mờ ảo */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl pointer-events-auto"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl bg-slate-900/40 border border-cyan-500/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(34,211,238,0.2)] overflow-hidden"
        >
          {/* Neon Top Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)]"></div>
          
          <div className="p-8 md:p-12">
            <header className="text-center mb-10">
               <motion.div 
                 animate={{ rotate: [0, 5, -5, 0] }}
                 transition={{ duration: 5, repeat: Infinity }}
                 className="inline-flex w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl items-center justify-center mb-6 shadow-[0_10px_30px_rgba(6,182,212,0.4)] relative overflow-hidden group"
               >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <User className="w-10 h-10 text-white relative z-10" />
               </motion.div>
               
               <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white uppercase mb-4">
                 Ghi Danh Bảng Vàng
               </h2>
               <p className="text-slate-400 text-base md:text-lg font-medium max-w-md mx-auto leading-relaxed">
                 Chào mừng em đến với <span className="text-cyan-400 font-bold">Funlab Challenge</span>. Hãy hoàn thiện hồ sơ để bắt đầu cuộc đua khoa học nhé!
               </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  {error}
                </motion.div>
              )}

              {/* Họ và Tên */}
              <div className="space-y-3">
                 <label className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <ChevronRight className="w-3 h-3" /> Họ và tên chính xác
                 </label>
                 <div className="relative group">
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="VD: Nguyễn Thành Hậu"
                      className="w-full bg-slate-950/60 border border-slate-700/80 rounded-2xl py-5 px-6 text-lg text-white font-bold focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600 shadow-inner group-hover:border-slate-600"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-cyan-500 transition-colors">
                      <Sparkles className="w-5 h-5" />
                    </div>
                 </div>
              </div>

              {/* Lớp Hierarchy Dropdown */}
              <div className="space-y-3">
                 <label className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <GraduationCap className="w-4 h-4" /> Chọn lớp đang học
                 </label>
                 <div className="relative">
                    <select 
                      required
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl py-5 px-6 text-lg text-white font-bold appearance-none cursor-pointer focus:outline-none focus:border-cyan-500/60 transition-all hover:bg-slate-900"
                    >
                      <option value="" disabled className="text-slate-600 italic">-- Nhấp để chọn lớp của em --</option>
                      {CLASS_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label} className="bg-slate-900 text-cyan-400 font-black py-4">
                          {group.blocks.map((block) => (
                            Array.from({ length: block.count }).map((_, i) => (
                              <option 
                                key={`${block.prefix}${i+1}`} 
                                value={`${block.prefix}${i+1}`}
                                className="text-white font-bold py-2 bg-slate-950"
                              >
                                {block.name}: {block.prefix}{i+1}
                              </option>
                            ))
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                 </div>
              </div>

              {/* Submit Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="w-full py-6 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 rounded-3xl font-black tracking-[0.3em] text-white uppercase shadow-[0_15px_35px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-4 border border-cyan-400/20"
              >
                {submitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    XÁC NHẬN GHI DANH <ShieldCheck className="w-6 h-6" />
                  </>
                )}
              </motion.button>
            </form>

            <footer className="mt-10 pt-8 border-t border-slate-800/50">
               <p className="text-xs text-slate-500 text-center font-medium leading-relaxed italic">
                 Hệ thống Funlab sẽ tự động đồng bộ danh tính của em lên Bảng xếp hạng Thế giới ngay sau khi "Xác nhận".
               </p>
            </footer>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
