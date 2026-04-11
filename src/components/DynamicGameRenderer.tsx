'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Babel from '@babel/standalone';
import { createClient } from '@/utils/supabase/client';
import {
  Flame, Droplets, Award, CheckCircle, ArrowRight, ShieldCheck, Play,
  RotateCcw, FileCheck, ExternalLink, Lock, Star, Zap, Target,
  Lightbulb, Atom, Search, Clock, Siren, AlertTriangle, ChevronRight,
  ChevronLeft, Heart, Shield, Sword, Sparkles, BookOpen, Beaker,
  Brain, Compass, Cpu, Eye, Gauge, Gem, Globe, Key, Layers,
  Link as LinkIcon, Map, Medal, Music, Palette, Puzzle, Rocket, Send,
  Settings, Sun, Moon, ThumbsUp, Trophy, Volume2, Wifi, Wind, X
} from 'lucide-react';

// ==========================================
// DYNAMIC GAME RENDERER
// Render React component từ game_code string
// ==========================================

interface DynamicGameRendererProps {
  gameCode: string;
  onGameComplete: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
  sandboxMode?: boolean; // true = không ghi điểm thật (dùng cho preview)
}

// Thư viện icons được inject sẵn cho game code
const INJECTED_ICONS = {
  Flame, Droplets, Award, CheckCircle, ArrowRight, ShieldCheck, Play,
  RotateCcw, FileCheck, ExternalLink, Lock, Star, Zap, Target,
  Lightbulb, Atom, Search, Clock, Siren, AlertTriangle, ChevronRight,
  ChevronLeft, Heart, Shield, Sword, Sparkles, BookOpen, Beaker,
  Brain, Compass, Cpu, Eye, Gauge, Gem, Globe, Key, Layers,
  LinkIcon, Map, Medal, Music, Palette, Puzzle, Rocket, Send,
  Settings, Sun, Moon, ThumbsUp, Trophy, Volume2, Wifi, Wind, X
};

export default function DynamicGameRenderer({ gameCode, onGameComplete, sandboxMode = false }: DynamicGameRendererProps) {
  const [error, setError] = useState<string | null>(null);
  const [GameComponent, setGameComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (!gameCode || gameCode.trim().length === 0) {
      setError('Không có code game nào được cung cấp.');
      return;
    }

    try {
      // 1. Dùng babel/standalone để transpile JSX sang React.createElement (JS thuần)
      let compiledCode = gameCode;
      try {
        compiledCode = Babel.transform(gameCode, { presets: ['react'] }).code || gameCode;
      } catch (compileErr) {
        console.warn('Lỗi biên dịch nội bộ JSX, sẽ thử chạy raw source mã nguồn gốc:', compileErr);
      }

      // 2. Tạo sandbox function với các dependency được inject
      const createGameComponent = new Function(
        'React',
        'useState',
        'useEffect',
        'useMemo',
        'useCallback',
        'useRef',
        'Icons',
        'createClient',
        compiledCode
      );

      const Component = createGameComponent(
        React,
        useState,
        useEffect,
        useMemo,
        useCallback,
        useRef,
        INJECTED_ICONS,
        createClient
      );

      if (typeof Component === 'function') {
        setGameComponent(() => Component);
        setError(null);
      } else {
        setError('Code game phải return một function component. VD: return function Game({ onGameComplete }) { ... }');
      }
    } catch (err: any) {
      console.error('DynamicGameRenderer Error:', err);
      setError(`Lỗi biên dịch code game: ${err.message}`);
    }
  }, [gameCode]);

  const handleGameComplete = useCallback((payload: any) => {
    if (sandboxMode) {
      console.log('[SANDBOX] Game completed (không ghi điểm thật):', payload);
      // Vẫn gọi callback nhưng parent sẽ biết là sandbox
    }
    onGameComplete(payload);
  }, [onGameComplete, sandboxMode]);

  // Error State
  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-red-950/20 border border-red-500/30 rounded-2xl">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-black text-red-400 uppercase tracking-widest mb-2">
          LỖI RENDER GAME
        </h3>
        <p className="text-red-300/80 text-sm text-center max-w-md font-mono bg-black/30 p-4 rounded-xl border border-red-500/20">
          {error}
        </p>
        <p className="text-slate-500 text-xs mt-4 max-w-sm text-center">
          Kiểm tra lại code game trong Admin Dashboard. Đảm bảo code kết thúc bằng <code className="text-cyan-400">return Game;</code>
        </p>
      </div>
    );
  }

  // Loading State
  if (!GameComponent) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm font-medium">Đang biên dịch game component...</p>
      </div>
    );
  }

  // Sandbox Badge
  return (
    <div className="w-full h-full relative">
      {sandboxMode && (
        <div className="absolute top-3 right-3 z-50 bg-amber-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-pulse">
          <Eye className="w-3 h-3" />
          SANDBOX MODE — Không ghi điểm thật
        </div>
      )}
      <GameComponent onGameComplete={handleGameComplete} />
    </div>
  );
}
