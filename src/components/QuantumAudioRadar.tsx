'use client';

import React, { useState, useRef, useEffect } from 'react';

// Link đến file nhạc của thầy trên Vercel (ví dụ đặt trong thư mục public)
const AUDIO_SRC = '/funlab-intro.mp3'; 

const QuantumAudioRadar = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Trình duyệt chặn Autoplay:", error);
        // Có thể xử lý hiện thông báo nhẹ nhàng ở đây nếu cần
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-24 z-50 flex items-center gap-3 cursor-pointer group" onClick={toggleAudio}>
      {/* Hiệu ứng Radar nhấp nháy (Pulsing Effect) */}
      <div className="relative flex h-12 w-12 items-center justify-center">
        {/* Các vòng radar lan tỏa */}
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75 ${isPlaying ? 'running' : 'paused'}`}></span>
        <span className={`animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-400 opacity-80 delay-100 ${isPlaying ? 'running' : 'paused'}`}></span>
        
        {/* Tâm điểm Radar chứa Icon */}
        <div className="relative inline-flex rounded-full h-10 w-10 bg-cyan-950 border border-cyan-500 items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
          {isPlaying ? (
            // Icon Loa đang phát
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          ) : (
            // Icon Loa đang tắt
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9v6m-4.5-6v6m-4.5-6v6m-4.5-6v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )}
        </div>
      </div>

      {/* Label Text */}
      <span className="text-sm font-mono text-cyan-200 opacity-80 group-hover:opacity-100 transition-opacity">
        {isPlaying ? 'SOUND: ON' : 'SOUND: OFF'}
      </span>

      {/* Thẻ Audio ngầm */}
      <audio ref={audioRef} src={AUDIO_SRC} loop />

      {/* CSS Animation自定义 (Thêm vào globals.css hoặc style tag) */}
      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .paused {
          animation-play-state: paused;
        }
        .running {
          animation-play-state: running;
        }
      `}</style>
    </div>
  );
};

export default QuantumAudioRadar;
