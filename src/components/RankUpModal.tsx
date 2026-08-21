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
    badgeEN?: string;
    stars: number;
    badgeUrl: string | null;
    color: string;
    shadowColor: string;
    glowColor?: string;
  };
  scoreGained: number;
}

export default function RankUpModal({ isOpen, onClose, newRank, scoreGained }: RankUpModalProps) {
  const glowHex = newRank.glowColor ?? '#22d3ee';

  useEffect(() => {
    if (!isOpen) return;

    // Pháo hoa theo màu huy hiệu
    const colors = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff', glowHex];
    const duration = 3500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 6, angle: 60,  spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    const audio = new Audio('/funlab-intro.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, [isOpen, glowHex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.75, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 14, stiffness: 110 }}
            className="relative w-full max-w-sm bg-slate-900/95 border border-white/10 shadow-2xl rounded-3xl p-8 text-center overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient glow blobs */}
            <div
              className="absolute -top-24 -left-24 w-56 h-56 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ backgroundColor: glowHex }}
            />
            <div
              className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: glowHex }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400 mb-3 z-10 relative"
            >
              ⚡ THĂNG HẠNG ⚡
            </motion.p>

            {/* Badge – spring bounce in */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 200, damping: 13 }}
              className="mx-auto w-36 h-36 relative mb-5 z-10"
            >
              {/* Pulse glow */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: glowHex }}
              />
              {/* Spinning dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-[3px] border-dashed pointer-events-none"
                style={{ borderColor: glowHex, filter: `drop-shadow(0 0 6px ${glowHex})` }}
              />
              {newRank.badgeUrl ? (
                <Image
                  src={newRank.badgeUrl}
                  alt={newRank.badge}
                  fill
                  className="object-contain z-10"
                  style={{ filter: `drop-shadow(0 0 18px ${glowHex})` }}
                />
              ) : (
                <Trophy className={`w-full h-full ${newRank.color} ${newRank.shadowColor}`} />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10"
            >
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">DANH HIỆU MỚI</p>
              {newRank.badgeEN && (
                <h3
                  className="text-xl font-black mb-0.5"
                  style={{ color: glowHex, textShadow: `0 0 20px ${glowHex}` }}
                >
                  {newRank.badgeEN}
                </h3>
              )}
              <h4 className="text-sm font-semibold text-slate-300 mb-5">{newRank.badge}</h4>

              {/* Stars – pop in one by one */}
              <div className="flex justify-center gap-2 mb-5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.6 + i * 0.13,
                      type: "spring",
                      stiffness: 220,
                      damping: 11
                    }}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        i < newRank.stars
                          ? `fill-current ${newRank.color}`
                          : 'text-slate-700 fill-slate-800'
                      }`}
                      style={i < newRank.stars ? { filter: `drop-shadow(0 0 8px ${glowHex})` } : {}}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Score */}
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 mb-5 flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Điểm đạt được:</span>
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: "spring" }}
                  className="text-yellow-400 font-black text-xl flex items-center gap-1"
                >
                  +{scoreGained} <Sparkles className="w-4 h-4" />
                </motion.span>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="w-full py-4 rounded-xl font-black tracking-widest uppercase text-slate-950 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${glowHex}, white)`,
                  boxShadow: `0 0 24px ${glowHex}60`
                }}
              >
                Tiếp Tục Chinh Phục 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
