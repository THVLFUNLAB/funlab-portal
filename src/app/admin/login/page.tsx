'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyAdminCode } from '../actions';
import { ShieldAlert, Server, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('code', code);
    
    const result = await verifyAdminCode(formData);
    
    if (result.success) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Lỗi hệ thống');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 w-full h-full pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/10 blur-[100px] rounded-full"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-800/20 blur-[100px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden relative z-10"
      >
         <div className="p-8 pb-6 border-b border-white/5 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-cyan-950/50 rounded-2xl flex items-center justify-center border border-cyan-500/30 mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
               <ShieldAlert className="w-8 h-8 text-cyan-500 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black tracking-widest text-white mb-2 uppercase">Khu Vực Hạn Chế</h1>
            <p className="text-slate-400 text-sm">Vui lòng cung cấp mã thông quan (Clearance Code) để vận hành Trung tâm Điều khiển Máy chủ.</p>
         </div>

         <div className="p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" /> Root Password
                 </label>
                 <input 
                   type="password"
                   value={code}
                   onChange={e => setCode(e.target.value)}
                   className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center tracking-widest"
                   placeholder="Nhập mã truy cập..."
                   required
                 />
                 {error && (
                   <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cyan-400 text-xs mt-3 flex justify-center uppercase tracking-widest font-bold">
                     ⚠ {error}
                   </motion.p>
                 )}
               </div>

               <button 
                 type="submit"
                 disabled={loading}
                 className="w-full relative group overflow-hidden rounded-xl p-0.5 bg-gradient-to-r from-cyan-600 to-cyan-900 shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
               >
                 <div className="flex h-full w-full items-center justify-center bg-slate-950 px-5 py-3 rounded-[10px] transition-colors group-hover:bg-cyan-950/50">
                    <span className="font-bold uppercase tracking-widest text-cyan-100 flex items-center gap-3">
                       {loading ? 'Đang xác thực...' : 'KHỞI ĐỘNG HỆ THỐNG'} 
                       {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </span>
                 </div>
               </button>
            </form>
         </div>
      </motion.div>
    </div>
  );
}
