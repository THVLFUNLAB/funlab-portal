import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[50vh] flex flex-col items-center justify-center pt-24 pb-16 px-6">
      {/* Background Animated Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-cyan-600/20 blur-[100px] md:blur-[140px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm uppercase">
          VÒM KHOA HỌC
        </h1>
        <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
          Khám phá không gian vô tận của tri thức. Nơi những điều kì diệu của khoa học được đánh thức và lan tỏa.
        </p>
        
        <div className="pt-8">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950">
            Khám phá ngay
          </button>
        </div>
      </div>
    </section>
  );
}
