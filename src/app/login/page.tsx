'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Hexagon, Loader2, Orbit, Fingerprint, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden font-sans text-slate-200">
      {/* Sci-Fi Background Elements */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none"></div>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30 pointer-events-none"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <div className="bg-slate-900/60 backdrop-blur-3xl border border-cyan-500/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden relative group">
          
          {/* Neon Top Bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)]"></div>
          
          <div className="p-10 md:p-14 flex flex-col items-center">
            
            {/* Sci-Fi Logo Lock */}
            <div className="flex flex-col items-center mb-10 text-center relative">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl -translate-y-2 translate-x-3"
               />
               <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-cyan-700/50 flex items-center justify-center shadow-[inset_0_0_20px_rgba(34,211,238,0.2)] relative mb-6">
                  <Hexagon className="w-10 h-10 text-cyan-400 relative z-10" />
                  <Orbit className="absolute w-full h-full text-cyan-500/40 animate-[spin_8s_linear_infinite]" />
               </div>
               
               <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 uppercase">
                 CỔNG ĐỊNH DANH
               </h2>
               <p className="text-cyan-500/70 text-sm mt-3 font-bold tracking-[0.2em] uppercase">
                 FUNLAB CHALLENGE
               </p>
            </div>

            {error && (
               <div className="w-full mb-6 bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl flex border-dashed items-center gap-2">
                 <ShieldAlert className="w-5 h-5 shrink-0" />
                 <span>{error}</span>
               </div>
            )}

            {/* Giant Google Button */}
            <motion.button 
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full py-5 bg-slate-950/80 border-2 border-cyan-500/50 hover:bg-cyan-950/40 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] group/btn relative overflow-hidden"
            >
              <span className="absolute w-1/4 h-full bg-cyan-400/20 skew-x-12 -left-20 group-hover/btn:animate-[shimmer_1s_ease-in-out_infinite]"></span>
              
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  <span className="text-cyan-300 font-bold tracking-widest uppercase">Đang KẾT NỐI...</span>
                </div>
              ) : (
                <>
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1Z"/>
                  </svg>
                  <span className="text-white font-black text-lg tracking-widest uppercase">Đăng nhập tài khoản Google</span>
                </>
              )}
            </motion.button>

            <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
              <Fingerprint className="w-4 h-4 text-cyan-500/50" />
              Chỉ dùng tài khoản thật sự để được vinh danh
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
