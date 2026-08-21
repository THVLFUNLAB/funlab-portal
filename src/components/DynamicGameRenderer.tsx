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
  Settings, Sun, Moon, ThumbsUp, Trophy, Volume2, Wifi, Wind, X,
  // Extra icons used in .tsx files
  Radar, CheckCircle2, XCircle, Users, Video, PartyPopper, IdCard,
  ChevronDown, ChevronUp, ArrowLeft, ArrowDown, ArrowUp,
  Info, HelpCircle, RefreshCw, Share2, Download, Upload,
  Camera, Mic, Bell, Tag, Bookmark, Filter, Grid, List,
  MoreHorizontal, MoreVertical, Minus, Plus, Divide, Equal,
  ZoomIn, ZoomOut, Maximize, Minimize, Move, CornerRightDown,
  Activity, BarChart, PieChart, TrendingUp, TrendingDown,
  Clipboard, File, Folder, Hash, Terminal, Code, Database,
  Package, Box, Archive, Trash, Edit, PenTool, Crop, Scissors,
  Navigation, MapPin, Phone, Mail, User, UserPlus, LogIn, LogOut,
} from 'lucide-react';

// =============================================================================
// DYNAMIC GAME RENDERER v2
// Render React component từ game_code string.
// Hỗ trợ:
//   • Code dán tay (format cũ: function Game / return Game;)
//   • File .tsx đầy đủ (có 'use client', import, TypeScript, export default)
// =============================================================================

interface DynamicGameRendererProps {
  gameCode: string;
  onGameComplete: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
  sandboxMode?: boolean;
}

// Tất cả icons có thể được dùng trong game code
const ALL_ICONS: Record<string, any> = {
  Flame, Droplets, Award, CheckCircle, ArrowRight, ShieldCheck, Play,
  RotateCcw, FileCheck, ExternalLink, Lock, Star, Zap, Target,
  Lightbulb, Atom, Search, Clock, Siren, AlertTriangle, ChevronRight,
  ChevronLeft, Heart, Shield, Sword, Sparkles, BookOpen, Beaker,
  Brain, Compass, Cpu, Eye, Gauge, Gem, Globe, Key, Layers,
  LinkIcon, Map, Medal, Music, Palette, Puzzle, Rocket, Send,
  Settings, Sun, Moon, ThumbsUp, Trophy, Volume2, Wifi, Wind, X,
  Radar, CheckCircle2, XCircle, Users, Video, PartyPopper, IdCard,
  ChevronDown, ChevronUp, ArrowLeft, ArrowDown, ArrowUp,
  Info, HelpCircle, RefreshCw, Share2, Download, Upload,
  Camera, Mic, Bell, Tag, Bookmark, Filter, Grid, List,
  MoreHorizontal, MoreVertical, Minus, Plus, Divide, Equal,
  ZoomIn, ZoomOut, Maximize, Minimize, Move, CornerRightDown,
  Activity, BarChart, PieChart, TrendingUp, TrendingDown,
  Clipboard, File, Folder, Hash, Terminal, Code, Database,
  Package, Box, Archive, Trash, Edit, PenTool, Crop, Scissors,
  Navigation, MapPin, Phone, Mail, User, UserPlus, LogIn, LogOut,
};

// Object Icons.X để tương thích với code dán tay cũ
const INJECTED_ICONS = ALL_ICONS;

/**
 * PRE-PROCESS: Chuyển đổi file .tsx đầy đủ → code sandbox-compatible
 *
 * Xử lý tự động:
 * 1. Xóa 'use client';
 * 2. Xóa tất cả import (single-line và multi-line)
 * 3. Xóa mọi export keyword (default hoặc named)
 * 4. Thêm `return <TênComponent>;` nếu chưa có
 */
function preprocessTsx(raw: string): string {
  let code = raw;

  // ── 1. Xóa 'use client' ──
  code = code.replace(/^\s*['"]use client['"]\s*;?\s*$/gm, '');

  // ── 2. Xóa multi-line imports ──
  // Xử lý từng block: import { ... } from '...';
  // Dùng loop để xóa từng phần vì regex lazy có thể bỏ sót
  let prevCode = '';
  while (prevCode !== code) {
    prevCode = code;
    // import type { ... } from '...'
    code = code.replace(/import\s+type\s*\{[^}]*\}\s*from\s*['"][^'"]*['"]\s*;?/g, '');
    // import { ... } from '...' (kể cả multi-line – dùng [\s\S] thay /s flag)
    code = code.replace(/import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]*['"]\s*;?/g, '');
    // import X from '...'
    code = code.replace(/import\s+\w+\s+from\s*['"][^'"]*['"]\s*;?/g, '');
    // import * as X from '...'
    code = code.replace(/import\s*\*\s*as\s+\w+\s+from\s*['"][^'"]*['"]\s*;?/g, '');
    // import '...' (side-effect)
    code = code.replace(/import\s*['"][^'"]*['"]\s*;?/g, '');
  }

  // ── 3. Xóa tất cả export keywords ──
  // Pass 1: export default function/class → function/class
  code = code.replace(/\bexport\s+default\s+(function|class)\b/g, '$1');
  // Pass 2: export function/class/const/let/var → function/class/const/let/var
  code = code.replace(/\bexport\s+(function|class|const|let|var)\b/g, '$1');
  // Pass 3: export default SomeName; (standalone) → xóa hẳn
  code = code.replace(/\bexport\s+default\s+\w+\s*;/g, '');
  // Pass 4: export { ... } → xóa hẳn
  code = code.replace(/\bexport\s*\{[^}]*\}\s*(?:from\s*['"][^'"]*['"])?\s*;?/g, '');
  // Pass 5: bất kỳ `export` nào còn sót
  code = code.replace(/\bexport\s+/g, '');

  // ── 4. Nếu chưa có `return Game;` ở bất kỳ đâu → tự detect và thêm ──
  // Dùng search toàn file thay vì chỉ check cuối (tránh bị comment trailing gây nhầm)
  if (!/\breturn\s+Game\s*;/.test(code)) {
    // Tìm tên function component (bắt đầu bằng chữ HOA)
    const fnMatches = [...code.matchAll(/^function\s+([A-Z][A-Za-z0-9_]*)\s*\(/gm)];
    if (fnMatches.length > 0) {
      const lastFnName = fnMatches[fnMatches.length - 1][1];
      code = code.trimEnd() + `\n\nreturn ${lastFnName};\n`;
    }
  }

  return code;
}


export default function DynamicGameRenderer({ gameCode, onGameComplete, sandboxMode = false }: DynamicGameRendererProps) {
  const [error, setError] = useState<string | null>(null);
  const [GameComponent, setGameComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (!gameCode || gameCode.trim().length === 0) {
      setError('Không có code game nào được cung cấp.');
      return;
    }

    try {
      // ── Bước 1: Pre-process (strip TS imports, export default, 'use client') ──
      const preprocessed = preprocessTsx(gameCode);

      // ── Bước 1.5: Khử trùng `return Game;` — chỉ giữ 1 cái cuối cùng ──
      let preprocessed2 = preprocessed;
      const returnMatches = [...preprocessed2.matchAll(/\breturn\s+Game\s*;/g)];
      if (returnMatches.length > 1) {
        // Xóa tất cả return Game; rồi thêm lại 1 cái ở cuối
        preprocessed2 = preprocessed2.replace(/\breturn\s+Game\s*;/g, '').trimEnd()
          + '\n\nreturn Game;\n';
      }

      // ── Bước 2: Tách `return Game;` ra khỏi phần Babel compile ──
      //
      // Pipeline tối ưu (không cần IIFE, không có vấn đề trailing semicolon):
      //
      // a. Trích tên component từ `return X;` cuối file, rồi XÓA dòng đó
      //    → code còn lại chỉ có function declarations hợp lệ, Babel parse bình thường
      //
      // b. Babel.transform(codeWithoutReturn) → compiled JSX/TS, không return top-level
      //    → compiled có thể có "use strict"; ở đầu → hoàn toàn hợp lệ trong function body
      //
      // c. new Function(...params, compiled + '\nreturn ComponentName;')
      //    → `return` nằm trong function body của new Function → valid 100%
      //    → Babel không cần flag đặc biệt, không cần IIFE, không cần string manipulation

      // a. Tách tên component và xóa `return X;` khỏi code trước khi compile
      let codeForBabel = preprocessed2;
      let componentName = 'Game';
      const returnStmtMatch = codeForBabel.match(/\breturn\s+([A-Z][A-Za-z0-9_]*)\s*;?\s*$/);
      if (returnStmtMatch) {
        componentName = returnStmtMatch[1];
        codeForBabel = codeForBabel.replace(/\breturn\s+[A-Z][A-Za-z0-9_]*\s*;?\s*$/, '').trimEnd();
      }

      // b. Babel compile — code không có top-level return → parse chuẩn ECMAScript
      let compiledCode = codeForBabel;
      try {
        compiledCode = Babel.transform(codeForBabel, {
          presets: [
            'react',
            ['typescript', { allExtensions: true, isTSX: true }],
          ] as any[],
          plugins: ['proposal-class-properties'],
          filename: 'game.tsx',
          sourceType: 'script' as const,
        }).code || codeForBabel;
      } catch (compileErr: any) {
        // Fallback: react preset only
        try {
          compiledCode = Babel.transform(codeForBabel, {
            presets: ['react'],
            sourceType: 'script' as const,
          }).code || codeForBabel;
        } catch {
          throw new Error(`Lỗi biên dịch JSX/TSX: ${compileErr?.message || compileErr}`);
        }
      }

      // c. Tạo sandbox: compiled code + return ở cuối (hợp lệ trong function body)
      const iconNames = Object.keys(ALL_ICONS);
      const sandboxBody = `${compiledCode}\nreturn ${componentName};`;
      const createGameComponent = new Function(
        'React',
        'useState',
        'useEffect',
        'useMemo',
        'useCallback',
        'useRef',
        'Icons',          // Icons.X — kiểu cũ
        'createClient',
        'motion',         // stub framer-motion
        'AnimatePresence',
        ...iconNames,     // Rocket, Star, ... — kiểu FGC mới
        sandboxBody       // compiled JSX + return ComponentName;
      );

      // Stub cho framer-motion (nếu code còn import nhưng đã bị xóa)
      const motionStub = new Proxy({}, {
        get: (_, tag) => {
          if (typeof tag !== 'string') return undefined;
          return ({ children, className, style, ...rest }: any) =>
            React.createElement(tag as string, { className, style }, children);
        },
      });
      const animatePresenceStub = ({ children }: any) => children;

      const Component = createGameComponent(
        React,
        useState,
        useEffect,
        useMemo,
        useCallback,
        useRef,
        INJECTED_ICONS,
        createClient,
        motionStub,
        animatePresenceStub,
        ...iconNames.map(k => ALL_ICONS[k])
      );

      if (typeof Component === 'function') {
        setGameComponent(() => Component);
        setError(null);
      } else {
        setError('Code game phải kết thúc bằng return Game; hoặc có export default function Game.');
      }
    } catch (err: any) {
      console.error('DynamicGameRenderer Error:', err);
      setError(`Lỗi biên dịch: ${err.message}`);
    }
  }, [gameCode]);

  const handleGameComplete = useCallback((payload: any) => {
    if (sandboxMode) {
      console.log('[SANDBOX] Game completed:', payload);
    }
    onGameComplete(payload);
  }, [onGameComplete, sandboxMode]);

  // ── Error ──
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
        <div className="mt-6 bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-xs text-slate-400 max-w-md space-y-1">
          <p className="font-bold text-slate-300 mb-2">💡 Hỗ trợ 2 định dạng:</p>
          <p>✅ <span className="text-cyan-400">File .tsx đầy đủ</span> — copy nguyên file, hệ thống tự xử lý</p>
          <p>✅ <span className="text-green-400">Code sandbox</span> — kết thúc bằng <code className="text-green-300">return Game;</code></p>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (!GameComponent) {
    return (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Đang biên dịch game component...</p>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="w-full h-full relative">
      {sandboxMode && (
        <div className="absolute top-3 right-3 z-50 bg-amber-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-pulse">
          <Eye className="w-3 h-3" />
          SANDBOX — Không ghi điểm thật
        </div>
      )}
      <GameComponent onGameComplete={handleGameComplete} />
    </div>
  );
}
