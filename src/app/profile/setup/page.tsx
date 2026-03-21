'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

export default function ProfileSetup() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // States info
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUserId(user.id);

      // Fetch existing profile if any
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, class_name')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.class_name) setClassName(profile.class_name);
        
        // Nếu đã có tên rồi mà cố tình vô đây thì có thể sút về trang chủ
        // Tuy nhiên đôi khi họ muốn tự sửa tên.
      }
      
      setLoading(false);
    }
    checkUser();
  }, [router, supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !className.trim()) {
      setError("Hãy nhập đầy đủ thông tin để định danh Bảng Vàng.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        class_name: className.trim(),
      })
      .eq('id', userId);

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
    } else {
      // Thành công, đẩy về map chính
      router.push('/');
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden font-sans text-slate-200">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-slate-900/80 backdrop-blur-3xl border border-indigo-500/30 rounded-[2rem] shadow-[0_20px_60px_rgba(79,70,229,0.2)] overflow-hidden">
          
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center mb-8 text-center">
               <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  <User className="w-8 h-8 text-white relative z-10" />
               </div>
               <h2 className="text-2xl font-black tracking-tighter text-white">
                 THIẾT LẬP HỒ SƠ
               </h2>
               <p className="text-slate-400 text-sm mt-3 font-medium tracking-wide">
                 Hệ thống phát hiện bạn chưa ghi danh Tên và Lớp. Thông tin này vô cùng quan trọng để vinh danh trên Bảng Vàng.
               </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              {error && (
                 <div className="bg-red-500/10 border border-red-500/50 flex items-center gap-2 text-red-400 text-xs p-3 rounded-xl">
                   <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                 </div>
              )}

              <div className="space-y-2">
                 <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest pl-1">Họ và Tên lót + Tên</label>
                 <input 
                   type="text" 
                   required
                   maxLength={50}
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl py-3.5 px-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold"
                   placeholder="VD: Nguyễn Văn A"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest pl-1">Phân Hạm (Khối Lớp)</label>
                 <select 
                   required
                   value={className}
                   onChange={(e) => setClassName(e.target.value)}
                   className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl py-3.5 px-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold tracking-widest uppercase appearance-none cursor-pointer"
                   style={{ WebkitAppearance: 'none' }}
                 >
                   <option value="" disabled className="text-slate-500">-- Vui lòng chọn lớp --</option>
                   <optgroup label="Khối 6" className="text-indigo-400">
                     {[...Array(8)].map((_, i) => (
                       <option key={`6A${i+1}`} value={`6A${i+1}`} className="text-slate-200">6A{i+1}</option>
                     ))}
                   </optgroup>
                   <optgroup label="Khối 7" className="text-indigo-400">
                     {[...Array(8)].map((_, i) => (
                       <option key={`7B${i+1}`} value={`7B${i+1}`} className="text-slate-200">7B{i+1}</option>
                     ))}
                   </optgroup>
                   <optgroup label="Khối 8" className="text-indigo-400">
                     {[...Array(8)].map((_, i) => (
                       <option key={`8C${i+1}`} value={`8C${i+1}`} className="text-slate-200">8C{i+1}</option>
                     ))}
                   </optgroup>
                   <optgroup label="Khối 9" className="text-indigo-400">
                     {[...Array(8)].map((_, i) => (
                       <option key={`9D${i+1}`} value={`9D${i+1}`} className="text-slate-200">9D{i+1}</option>
                     ))}
                   </optgroup>
                   <optgroup label="Khối 10" className="text-indigo-400">
                     {[...Array(5)].map((_, i) => (
                       <option key={`10A${i+1}`} value={`10A${i+1}`} className="text-slate-200">10A{i+1}</option>
                     ))}
                   </optgroup>
                   <optgroup label="Khối 11" className="text-indigo-400">
                     {[...Array(5)].map((_, i) => (
                       <option key={`11B${i+1}`} value={`11B${i+1}`} className="text-slate-200">11B{i+1}</option>
                     ))}
                   </optgroup>
                   <optgroup label="Khối 12" className="text-indigo-400">
                     {[...Array(5)].map((_, i) => (
                       <option key={`12C${i+1}`} value={`12C${i+1}`} className="text-slate-200">12C{i+1}</option>
                     ))}
                   </optgroup>
                 </select>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black tracking-widest text-sm uppercase shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> 
                    Xác Nhận & Tiến Vào Funlab
                  </>
                )}
              </motion.button>
            </form>
          </div>
          
          <div className="bg-slate-950/80 backdrop-blur-sm px-8 py-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-2 leading-relaxed font-medium">
               <Sparkles className="w-3 h-3 text-yellow-500" />
               Vui lòng dùng thông tin thật để nhận được quà từ nhà trường.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
