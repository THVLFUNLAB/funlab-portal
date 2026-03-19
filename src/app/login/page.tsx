"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-100 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Sci-fi Video Background (Reused for consistency) */}
      <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden">
        <video 
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover blur-[8px]"
        >
          <source src="/bg-tech.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/75 pointer-events-none"></div>
      </div>

      {/* Decorative Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-yellow-500/10 via-green-500/5 to-blue-500/10 blur-[100px] -z-10 pointer-events-none rounded-full"></div>

      <div className="w-full max-w-md px-6 relative z-10 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative group overflow-hidden"
        >
          {/* Subtle Outer Glow linking to typing interaction */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Minimal Logo Display */}
            <div className="mb-10 text-center">
              <Link href="/">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mx-auto w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center mb-6 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FBBF24] via-[#F97316] to-[#22C55E] opacity-20"></div>
                  <Image src="/logo.png" alt="Funlab Icon" width={40} height={40} className="object-contain" />
                </motion.div>
              </Link>
              
              {/* 3D Multi-color Gradient Title matching Master Prompt */}
              <h1 
                className="text-4xl font-black tracking-tighter bg-clip-text text-transparent mb-2"
                style={{
                  backgroundImage: "linear-gradient(to right, #FBBF24, #F97316, #22C55E, #3B82F6)",
                  filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.8))"
                }}
              >
                SYSTEM ACCESS
              </h1>
              <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">
                Trung tâm điều hành Funlab
              </p>
            </div>

            <form className="space-y-6 w-full" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-widest ml-1 mb-2 block">
                  Clearance Code
                </label>
                <div className="relative group/input">
                  <input 
                    type="password" 
                    placeholder="Nhập mã truy cập..."
                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-5 py-4 text-cyan-50 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner font-mono tracking-widest text-lg"
                  />
                  {/* Blinking Pulse Light Indicator */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500/80 group-focus-within/input:bg-cyan-500 group-focus-within/input:shadow-[0_0_8px_rgba(34,211,238,0.8)] shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all duration-300"></div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative py-4 mt-2 rounded-xl font-bold text-white shadow-lg overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FBBF24] via-[#F97316] via-[#22C55E] to-[#3B82F6] opacity-90 group-hover/btn:opacity-100 transition-opacity"></div>
                {/* Button Shiny Sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <span className="relative z-10 tracking-widest drop-shadow-md uppercase">
                  Xác Thực
                </span>
              </motion.button>
            </form>
            
          </div>
        </motion.div>
        
        {/* Helper Links */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-medium tracking-wide text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Quay lại Cổng Thông Tin
          </Link>
        </div>
      </div>
    </main>
  );
}
