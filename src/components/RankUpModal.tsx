'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, Trophy, Sparkles, X } from 'lucide-react';
import Image from 'next/image';

interface RankUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newRank: {
    badge: string;
    stars: number;
    badgeUrl: string | null;
    color: string;
    shadowColor: string;
  };
  scoreGained: number;
}

export default function RankUpModal({ isOpen, onClose, newRank, scoreGained }: RankUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Bắn pháo hoa khi mở
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Play sound
      const audio = new Audio('/funlab-intro.mp3'); // Fallback
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio autoplay blocked', e));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl p-8 text-center overflow-hidden"
          >
            {/* Ambient background */}
            <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full mix-blend-screen filter blur-3xl opacity-30 ${newRank.color.replace('text-', 'bg-')}`}></div>
            <div className={`absolute -bottom-32 -right-32 w-64 h-64 rounded-full mix-blend-screen filter blur-3xl opacity-30 ${newRank.color.replace('text-', 'bg-')}`}></div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto w-32 h-32 relative mb-6 z-10"
            >
              {newRank.badgeUrl ? (
                <Image 
                  src={newRank.badgeUrl}
                  alt={newRank.badge}
                  fill
                  className={`object-contain filter ${newRank.shadowColor}`}
                />
              ) : (
                <Trophy className={`w-full h-full ${newRank.color} filter ${newRank.shadowColor}`} />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative z-10"
            >
              <h2 className="text-xl font-black text-slate-300 tracking-widest uppercase mb-1">
                CHÚC MỪNG THĂNG HẠNG
              </h2>
              <h3 className={`text-3xl font-black ${newRank.color} mb-4`}>
                {newRank.badge}
              </h3>

              <div className="flex justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <Star 
                      className={`w-8 h-8 ${i < newRank.stars ? `fill-current ${newRank.color} filter drop-shadow-[0_0_10px_currentColor]` : 'text-slate-700 fill-slate-800'}`} 
                    />
                  </motion.div>
                ))}
              </div>

              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 mb-6 flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-xs">Điểm đạt được:</span>
                <span className="text-yellow-400 font-black text-xl flex items-center gap-1">
                  +{scoreGained} <Sparkles className="w-4 h-4" />
                </span>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 rounded-xl font-black tracking-widest uppercase transition-all hover:scale-105 active:scale-95 bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Tiếp Tục Chinh Phục
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
