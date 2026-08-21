'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import {
  Rocket,
  Radar,
  Trophy,
  Award,
  Star,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  RotateCcw,
  Send,
  Lock,
  Users,
  Video,
  Medal,
  PartyPopper,
  IdCard,
  Compass,
} from 'lucide-react';

/* ============================================================================
 * TYPES
 * ==========================================================================*/

type GameState = 'welcome' | 'simulation' | 'quiz' | 'result' | 'submitted';

interface Tap1GameProps {
  onGameComplete?: (payload: {
    score: number;
    timeInSeconds: number;
    level: string;
    answersLog: Array<{ qId: string; isCorrect: boolean }>;
  }) => void;
}

interface MCQQuestion {
  id: string;
  type: 'mcq';
  cogLevel: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  score: number;
}

interface OrderingQuestion {
  id: string;
  type: 'ordering';
  cogLevel: number;
  question: string;
  items: string[];
  correctOrders: string[][];
  explanation: string;
  score: number;
}

interface FillBlankQuestion {
  id: string;
  type: 'fill_blank';
  cogLevel: number;
  question: string;
  wordBank: string[];
  correctAnswers: string[];
  explanation: string;
  score: number;
}

type QuizQuestion = MCQQuestion | OrderingQuestion | FillBlankQuestion;

interface FloatToast {
  id: number;
  text: string;
  tone: 'good' | 'bad';
}

/* ============================================================================
 * STATIC DATA (nguồn: video khai mạc Funlab Challenge 2026–2027)
 * ==========================================================================*/

const BADGE_LEVELS = [
  { name: 'FUNLAB ROOKIE', full: 'Tân Binh', threshold: 1 },
  { name: 'FUNLAB EXPLORER', full: 'Nhà Thám Hiểm', threshold: 200 },
  { name: 'FUNLAB INNOVATOR', full: 'Nhà Cải Mới', threshold: 500 },
  { name: 'FUNLAB ENGINEER', full: 'Kỹ Sư Sáng Tạo', threshold: 800 },
  { name: 'FUNLAB MASTER', full: 'Chuyên Gia Funlab', threshold: 1200 },
  { name: 'FUNLAB LEGEND', full: 'Huyền Thoại Khoa Học', threshold: 1600 },
];

const HEX_GRID_BG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 0L56 16v34L28 66 0 50V16z' fill='none' stroke='%2306b6d4' stroke-opacity='0.35'/%3E%3C/svg%3E";

const QUESTION_BANK: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 'tap1_r1_a',
      type: 'mcq',
      cogLevel: 1,
      question:
        'Trong năm học 2026–2027, cứ bao nhiêu tuần thì Funlab Challenge phát sóng 1 tập mới?',
      options: ['1 tuần 1 tập', '2 tuần 1 tập', '1 tháng 1 tập', '4 tuần 1 tập'],
      correctIndex: 1,
      explanation:
        'Năm học 38 tuần, cứ 2 tuần phát sóng 1 tập → tổng cộng 19 tập trong năm!',
      score: 6,
    },
    {
      id: 'tap1_r1_b',
      type: 'mcq',
      cogLevel: 1,
      question:
        'Mỗi lần hoàn thành 1 tập Game Thử Thách, học sinh nhận được tối đa bao nhiêu điểm?',
      options: ['100 điểm', '20 điểm', '50 điểm', '10 điểm'],
      correctIndex: 2,
      explanation:
        'Mỗi tập game tối đa 50 điểm × 19 tập = 950 điểm từ con đường Người Chơi.',
      score: 6,
    },
  ],
  2: [
    {
      id: 'tap1_r2_a',
      type: 'mcq',
      cogLevel: 2,
      question:
        'Học sinh mới tham gia Funlab lần đầu năm nay có LỢI THẾ hay THIỆT THÒI so với thành viên cũ không?',
      options: [
        'Thiệt thòi vì chưa có kinh nghiệm',
        'Có lợi thế vì chưa bị trừ điểm',
        'Không ai có lợi thế – tất cả đã về 0 điểm',
        'Thành viên cũ có lợi thế vì được cộng điểm',
      ],
      correctIndex: 2,
      explanation:
        'Toàn bộ điểm số được reset về 0 – vạch xuất phát hoàn toàn công bằng cho tất cả!',
      score: 6,
    },
    {
      id: 'tap1_r2_b',
      type: 'mcq',
      cogLevel: 2,
      question: 'Để nhận huy hiệu FUNLAB ROOKIE, học sinh cần phải làm gì?',
      options: [
        'Đạt 200 điểm trở lên',
        'Hoàn thành ít nhất 5 tập game',
        'Chỉ cần đạt 1 điểm đầu tiên',
        'Gửi 1 video thí nghiệm STEM',
      ],
      correctIndex: 2,
      explanation:
        'Chỉ cần 1 điểm đầu tiên là ngay lập tức nhận FUNLAB ROOKIE! Rào cản rất thấp để ai cũng có thể bắt đầu.',
      score: 6,
    },
  ],
  3: [
    {
      id: 'tap1_r3_a',
      type: 'mcq',
      cogLevel: 3,
      question:
        'Một học sinh chơi game đầy đủ 19 tập (950đ) nhưng KHÔNG gửi video nào. Bạn đó có thể đạt tối đa được huy hiệu cấp mấy?',
      options: [
        'Cấp 4 – FUNLAB ENGINEER (cần 800đ) nhưng không lên được cấp 5',
        'Cấp 6 – FUNLAB LEGEND',
        'Cấp 5 – FUNLAB MASTER (cần 1200đ)',
        'Cấp 3 – FUNLAB INNOVATOR',
      ],
      correctIndex: 0,
      explanation:
        '950đ > 800đ (Engineer) nhưng < 1.200đ (Master). Muốn lên Master trở lên BẮT BUỘC phải gửi video sáng tạo!',
      score: 6,
    },
    {
      id: 'tap1_r3_b',
      type: 'mcq',
      cogLevel: 3,
      question:
        'Học sinh nào trong Top 10 năm 2025–2026 thuộc lớp 7B4 và đạt điểm cao nhất toàn trường?',
      options: [
        'Lê Nguyễn Minh Đan – 7B5',
        'Nguyễn Đăng Quang – 7B4',
        'Nguyễn Hoàng Thảo Quỳnh – 7B1',
        'Phí Văn An – 10A1',
      ],
      correctIndex: 1,
      explanation:
        'Quán Quân Nguyễn Đăng Quang – lớp 7B4 đạt 430 điểm, điểm cao nhất trong toàn bộ mùa giải 2025–2026!',
      score: 6,
    },
  ],
  4: [
    {
      id: 'tap1_r4_a',
      type: 'ordering',
      cogLevel: 4,
      question: 'Sắp xếp các cấp huy hiệu từ THẤP đến CAO theo đúng thứ tự:',
      items: ['ENGINEER', 'ROOKIE', 'LEGEND', 'EXPLORER', 'MASTER', 'INNOVATOR'],
      correctOrders: [
        ['ROOKIE', 'EXPLORER', 'INNOVATOR', 'ENGINEER', 'MASTER', 'LEGEND'],
      ],
      explanation:
        '6 cấp theo thứ tự điểm tăng dần: 1đ → 200đ → 500đ → 800đ → 1.200đ → 1.600đ',
      score: 6,
    },
    {
      id: 'tap1_r4_b',
      type: 'ordering',
      cogLevel: 4,
      question: 'Sắp xếp các học sinh Top 3 theo thứ tự từ THẤP đến CAO điểm số:',
      items: [
        'Nguyễn Đăng Quang – 430đ',
        'Nguyễn Thị Thúy Vy – 400đ',
        'Phí Văn An – 400đ',
      ],
      correctOrders: [
        ['Nguyễn Thị Thúy Vy – 400đ', 'Phí Văn An – 400đ', 'Nguyễn Đăng Quang – 430đ'],
        ['Phí Văn An – 400đ', 'Nguyễn Thị Thúy Vy – 400đ', 'Nguyễn Đăng Quang – 430đ'],
      ],
      explanation:
        'Vy và An đồng Á Quân với 400 điểm. Quang là Quán Quân với 430 điểm – điểm kỷ lục mùa giải!',
      score: 6,
    },
  ],
  5: [
    {
      id: 'tap1_r5_a',
      type: 'fill_blank',
      cogLevel: 5,
      question:
        'Năm học 2026–2027 có {BLANK_1} tuần học. Cứ 2 tuần phát 1 tập, nên tổng cộng có {BLANK_2} tập Funlab trong năm.',
      wordBank: ['38', '19', '40', '20'],
      correctAnswers: ['38', '19'],
      explanation: '38 tuần ÷ 2 tuần/tập = 19 tập. Đây là cơ sở tính tổng điểm tối đa!',
      score: 6,
    },
    {
      id: 'tap1_r5_b',
      type: 'fill_blank',
      cogLevel: 5,
      question:
        'Tổng điểm tối đa từ Game là {BLANK_1} điểm. Tổng điểm tối đa từ Video Sáng Tạo là {BLANK_2} điểm. Cộng lại bằng đúng 2.000 điểm.',
      wordBank: ['950', '1.050', '800', '1.200'],
      correctAnswers: ['950', '1.050'],
      explanation: '50đ × 19 tập = 950đ (Game) + 1.050đ (Creator) = 2.000đ tổng cộng!',
      score: 6,
    },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(): QuizQuestion[] {
  return [1, 2, 3, 4, 5].map((level) => {
    const pool = QUESTION_BANK[level];
    const picked = JSON.parse(
      JSON.stringify(pool[Math.floor(Math.random() * pool.length)])
    ) as QuizQuestion;
    if (picked.type === 'ordering') picked.items = shuffle(picked.items);
    return picked;
  });
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m} phút ${s.toString().padStart(2, '0')} giây`;
}

/* ============================================================================
 * SMALL PRESENTATIONAL PIECES
 * ==========================================================================*/

function HexBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{ backgroundImage: `url("${HEX_GRID_BG}")`, backgroundSize: '56px 100px' }}
    />
  );
}

function Confetti({ show }: { show: boolean }) {
  const colors = ['#06b6d4', '#f59e0b', '#34d399', '#a78bfa'];
  const particles = useRef(
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1 + Math.random() * 0.6,
      color: colors[i % colors.length],
      rotate: Math.random() * 360,
    }))
  ).current;

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute top-0 block h-2 w-2 rounded-sm"
              style={{ left: `${p.left}%`, backgroundColor: p.color }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{ y: 500, opacity: 0, rotate: p.rotate }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

function FloatToasts({ toasts }: { toasts: FloatToast[] }) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-24 z-50 -translate-x-1/2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -40, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
            className={`mb-1 rounded-full px-4 py-1 text-sm font-bold shadow-lg ${
              t.tone === 'good'
                ? 'bg-emerald-400/90 text-slate-900'
                : 'bg-red-400/90 text-slate-900'
            }`}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function MissionProgress({ step }: { step: number }) {
  return (
    <div className="mx-auto mb-6 w-full max-w-md">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-cyan-300">
        <span>Nhiệm vụ {Math.min(step, 4)}/4</span>
        <span className="flex items-center gap-1 text-amber-400">
          <Star className="h-3.5 w-3.5" /> Đại Sứ Funlab
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(step, 4) / 4) * 100}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        />
      </div>
    </div>
  );
}

function Astronaut({ step }: { step: number }) {
  const positions = ['4%', '32%', '62%', '88%'];
  return (
    <div className="relative mx-auto mb-4 h-14 w-full max-w-md">
      <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        animate={{ left: positions[Math.min(step - 1, 3)] }}
        transition={{ type: 'spring', stiffness: 70, damping: 16 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/60 bg-slate-800 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
        >
          <Rocket className="h-5 w-5 rotate-45 text-cyan-300" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ============================================================================
 * MAIN COMPONENT
 * ==========================================================================*/

export default function Tap1Game_v2({ onGameComplete }: Tap1GameProps) {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const startTimeRef = useRef<number>(0);
  const toastIdRef = useRef(0);
  const [toasts, setToasts] = useState<FloatToast[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const pushToast = (text: string, tone: 'good' | 'bad' = 'good') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 1200);
  };

  const burstConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
  };

  /* ---------------- SIMULATION ---------------- */
  const [missionStep, setMissionStep] = useState(1);
  const [simScore, setSimScore] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const [m1Activated, setM1Activated] = useState(false);
  const [callsign, setCallsign] = useState('');
  const [m2Selected, setM2Selected] = useState<number | null>(null);
  const [m2Answered, setM2Answered] = useState(false);
  const [m3Matches, setM3Matches] = useState<Record<string, number | null>>({
    ROOKIE: null,
    ENGINEER: null,
    LEGEND: null,
  });
  const [m3Confirmed, setM3Confirmed] = useState(false);
  const [m4Stamped, setM4Stamped] = useState(false);

  const completeMission = (points: number) => {
    setSimScore((s) => s + points);
    burstConfetti();
    pushToast(`+${points}đ`, 'good');
    setTimeout(() => setMissionStep((s) => s + 1), 900);
  };

  const handleM1Confirm = () => {
    if (m1Activated) return;
    setM1Activated(true);
    completeMission(5);
  };

  const handleM2Select = (idx: number) => {
    if (m2Answered) return;
    setM2Selected(idx);
    setM2Answered(true);
    const correct = idx === 2;
    if (correct) {
      completeMission(5);
    } else {
      pushToast('950 + 1.050 = 2.000 điểm nhé!', 'bad');
      setTimeout(() => setMissionStep((s) => s + 1), 1600);
    }
  };

  const THRESH_OPTIONS = [1, 200, 500, 800, 1200, 1600];

  const handleM3Pick = (badgeKey: string, value: number) => {
    if (m3Confirmed) return;
    setM3Matches((prev) => ({ ...prev, [badgeKey]: value }));
  };

  const handleM3Confirm = () => {
    if (m3Confirmed) return;
    setM3Confirmed(true);
    const correct =
      m3Matches.ROOKIE === 1 && m3Matches.ENGINEER === 800 && m3Matches.LEGEND === 1600;
    if (correct) {
      completeMission(5);
    } else {
      pushToast('ROOKIE=1 · ENGINEER=800 · LEGEND=1.600', 'bad');
      setTimeout(() => setMissionStep((s) => s + 1), 1800);
    }
  };

  const handleM4Stamp = () => {
    if (m4Stamped) return;
    setM4Stamped(true);
    setSimScore((s) => s + 5);
    burstConfetti();
    pushToast('+5đ', 'good');
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      const quiz = generateQuestions();
      setQuestions(quiz);
      setGameState('quiz');
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  /* ---------------- QUIZ ---------------- */
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [answersLog, setAnswersLog] = useState<Array<{ qId: string; isCorrect: boolean }>>(
    []
  );

  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [orderSelected, setOrderSelected] = useState<string[]>([]);
  const [blanksFilled, setBlanksFilled] = useState<string[]>([]);

  const currentQ = questions[qIndex];

  const resetPerQuestionState = () => {
    setMcqSelected(null);
    setOrderSelected([]);
    setBlanksFilled([]);
    setAnswered(false);
    setIsCorrect(false);
    setTimeLeft(30);
  };

  const submitAnswer = (correct: boolean) => {
    if (answered || !currentQ) return;
    setAnswered(true);
    setIsCorrect(correct);
    if (correct) setQuizScore((s) => s + currentQ.score);
    setAnswersLog((prev) => [...prev, { qId: currentQ.id, isCorrect: correct }]);
    if (correct) {
      burstConfetti();
      pushToast(`+${currentQ.score}đ`, 'good');
    } else {
      pushToast('Sai rồi!', 'bad');
    }
  };

  const handleMcqPick = (idx: number) => {
    if (answered || currentQ?.type !== 'mcq') return;
    setMcqSelected(idx);
    submitAnswer(idx === currentQ.correctIndex);
  };

  const handleOrderPick = (item: string) => {
    if (answered || currentQ?.type !== 'ordering') return;
    if (orderSelected.includes(item)) return;
    const next = [...orderSelected, item];
    setOrderSelected(next);
    if (next.length === currentQ.items.length) {
      const correct = currentQ.correctOrders.some(
        (order) => JSON.stringify(order) === JSON.stringify(next)
      );
      submitAnswer(correct);
    }
  };

  const handleBlankPick = (word: string) => {
    if (answered || currentQ?.type !== 'fill_blank') return;
    if (blanksFilled.includes(word)) return;
    const total = currentQ.correctAnswers.length;
    if (blanksFilled.length >= total) return;
    const next = [...blanksFilled, word];
    setBlanksFilled(next);
    if (next.length === total) {
      const correct = JSON.stringify(next) === JSON.stringify(currentQ.correctAnswers);
      submitAnswer(correct);
    }
  };

  const goNextQuestion = () => {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      resetPerQuestionState();
    } else {
      setGameState('result');
    }
  };

  // 30s per-question countdown
  useEffect(() => {
    if (gameState !== 'quiz' || answered) return;
    if (timeLeft <= 0) {
      submitAnswer(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, answered, timeLeft]);

  /* ---------------- RESULT ---------------- */
  const rawTotal = simScore + quizScore;
  const finalScore = Math.min(rawTotal, 50);
  const elapsedSeconds =
    startTimeRef.current > 0 ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;

  const [countUp, setCountUp] = useState(0);
  useEffect(() => {
    if (gameState !== 'result') return;
    setCountUp(0);
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCountUp(Math.round(p * finalScore));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const getComment = (score: number) => {
    if (score >= 45)
      return '⚡ XUẤT SẮC! Bạn đã nắm trọn luật chơi Funlab 2026–2027! Sẵn sàng leo Bảng Vàng rồi đó!';
    if (score >= 35)
      return '🔥 RẤT TỐT! Kiến thức vững chắc. Hãy xem lại các mốc huy hiệu để không bỏ lỡ nhé!';
    if (score >= 20)
      return '💡 KHÁ! Xem lại phần 6 cấp huy hiệu và 2 con đường tích điểm trong video nhé!';
    return '📺 Hãy xem lại video khai mạc Tập 1 một lần nữa để nắm vững luật chơi nào!';
  };

  const getBadgeImage = (score: number) => {
    if (score >= 45) return { src: '/badge-master.png', label: 'FUNLAB MASTER' };
    if (score >= 35) return { src: '/badge-engineer.png', label: 'FUNLAB ENGINEER' };
    if (score >= 20) return { src: '/badge-innovator.png', label: 'FUNLAB INNOVATOR' };
    return { src: '/badge-explorer.png', label: 'FUNLAB EXPLORER' };
  };

  const handleSubmitScore = () => {
    onGameComplete?.({
      score: finalScore,
      timeInSeconds: elapsedSeconds,
      level: 'THCS',
      answersLog,
    });
    setGameState('submitted');
  };

  const badge = getBadgeImage(finalScore);

  /* ==========================================================================
   * RENDER
   * ========================================================================*/

  return (
    <div className="relative min-h-[560px] w-full min-w-[375px] overflow-hidden rounded-2xl bg-slate-950 text-white">
      <HexBackdrop />
      <Confetti show={showConfetti} />
      <FloatToasts toasts={toasts} />

      <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-2xl flex-col justify-center px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {/* ---------------- WELCOME ---------------- */}
          {gameState === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_40px_rgba(6,182,212,0.5)]"
              >
                <Rocket className="h-10 w-10 text-cyan-300" />
              </motion.div>
              <h1 className="mb-2 text-2xl font-black tracking-wide text-cyan-300 sm:text-3xl">
                THÁM TỬ FUNLAB
              </h1>
              <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-amber-400">
                Tập 1 · Chinh Phục Luật Chơi 2026–2027
              </p>
              <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-300">
                Trở thành Đại Sứ Funlab! Hoàn thành 4 nhiệm vụ nhập môn để nhận Thẻ Chiến
                Binh, sau đó chinh phục 5 câu hỏi kiến thức để ghi tên lên Bảng Vàng.
              </p>
              <button
                onClick={() => {
                  startTimeRef.current = Date.now();
                  setGameState('simulation');
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
              >
                <Sparkles className="h-4 w-4" /> BẮT ĐẦU HÀNH TRÌNH
              </button>
            </motion.div>
          )}

          {/* ---------------- SIMULATION ---------------- */}
          {gameState === 'simulation' && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MissionProgress step={missionStep} />
              <Astronaut step={missionStep} />

              {/* MISSION 1 */}
              {missionStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-5 backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center gap-2 text-cyan-300">
                    <Radar className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Nhiệm vụ 1 · Đăng ký tên chiến binh
                    </span>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/60 p-4 font-mono text-sm leading-relaxed text-emerald-300">
                    <p>🛸 CHÀO MỪNG ĐẾN VỚI FUNLAB CHALLENGE 2026–2027!</p>
                    <p>Vạch xuất phát đã về 0 cho TẤT CẢ học sinh.</p>
                    <p>Đây là cơ hội bình đẳng cho mọi người – dù cũ hay mới!</p>
                    <div className="mt-3 flex items-center gap-1">
                      <span>&gt; Nhập MÃ CHIẾN BINH của bạn:</span>
                      <input
                        value={callsign}
                        onChange={(e) => setCallsign(e.target.value)}
                        disabled={m1Activated}
                        autoFocus
                        placeholder="..."
                        aria-label="Mã chiến binh"
                        className="min-w-0 flex-1 border-b border-emerald-700/50 bg-transparent font-mono text-emerald-300 caret-emerald-300 outline-none placeholder:text-emerald-800 disabled:opacity-50"
                      />
                      {!m1Activated && <span className="animate-pulse">▊</span>}
                    </div>
                  </div>
                  {!m1Activated ? (
                    <button
                      onClick={handleM1Confirm}
                      className="mt-4 w-full rounded-lg bg-cyan-500 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
                    >
                      XÁC NHẬN BẮT ĐẦU
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-400/10 p-3 text-center text-sm font-semibold text-emerald-300"
                    >
                      ✅ ĐÃ KÍCH HOẠT! Tuyệt! Điểm số của bạn đã về VẠCH XUẤT PHÁT 0. Mùa
                      giải bắt đầu!
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* MISSION 2 */}
              {missionStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-5 backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center gap-2 text-cyan-300">
                    <Compass className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Nhiệm vụ 2 · Chọn con đường tích điểm
                    </span>
                  </div>
                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 p-4">
                      <Users className="mb-2 h-6 w-6 text-cyan-300" />
                      <p className="text-sm font-bold text-cyan-300">NGƯỜI CHƠI</p>
                      <p className="mt-1 text-xs text-slate-300">Xem video → Chơi game tương tác</p>
                      <p className="mt-1 text-xs font-semibold text-cyan-200">Tối đa: 50đ/tập × 19 tập = 950đ</p>
                    </div>
                    <div className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-4">
                      <Video className="mb-2 h-6 w-6 text-amber-400" />
                      <p className="text-sm font-bold text-amber-400">TÁC GIẢ STEM</p>
                      <p className="mt-1 text-xs text-slate-300">Quay video thí nghiệm → Gửi về hệ thống</p>
                      <p className="mt-1 text-xs font-semibold text-amber-200">Tối đa: 1.050đ cả năm</p>
                    </div>
                  </div>
                  <p className="mb-3 text-sm font-semibold text-slate-200">
                    Tổng điểm tối đa khi kết hợp CẢ HAI con đường là bao nhiêu?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['800 điểm', '1.500 điểm', '2.000 điểm', '950 điểm'].map((opt, idx) => {
                      const isPicked = m2Selected === idx;
                      const isRight = idx === 2;
                      return (
                        <button
                          key={opt}
                          disabled={m2Answered}
                          onClick={() => handleM2Select(idx)}
                          className={`rounded-lg border p-3 text-sm font-bold transition ${
                            m2Answered && isPicked && isRight
                              ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                              : m2Answered && isPicked && !isRight
                              ? 'border-red-400 bg-red-400/20 text-red-300'
                              : m2Answered && isRight
                              ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300'
                              : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {m2Answered && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-xs text-slate-400">
                      950 + 1.050 = 2.000 điểm nhé!
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* MISSION 3 */}
              {missionStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-5 backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center gap-2 text-cyan-300">
                    <Medal className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Nhiệm vụ 3 · Định danh huy hiệu
                    </span>
                  </div>
                  <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {BADGE_LEVELS.map((b) => (
                      <motion.div
                        key={b.name}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2.4 }}
                        className={`flex flex-col items-center rounded-lg border p-2 text-center ${
                          b.name === 'FUNLAB ROOKIE'
                            ? 'border-amber-400/60 bg-amber-400/10'
                            : 'border-white/10 bg-white/5 grayscale'
                        }`}
                      >
                        <Award className={`h-5 w-5 ${b.name === 'FUNLAB ROOKIE' ? 'text-amber-400' : 'text-slate-500'}`} />
                        <p className="mt-1 text-[9px] font-bold text-slate-300">{b.name}</p>
                      </motion.div>
                    ))}
                  </div>
                  <p className="mb-2 text-sm font-semibold text-slate-200">Nối đúng 3 cặp Tên Huy Hiệu ↔ Ngưỡng Điểm:</p>
                  <div className="space-y-3">
                    {(['ROOKIE', 'ENGINEER', 'LEGEND'] as const).map((key) => (
                      <div key={key} className="rounded-lg border border-white/10 bg-white/5 p-3">
                        <p className="mb-2 text-xs font-bold text-cyan-300">FUNLAB {key}</p>
                        <div className="flex flex-wrap gap-2">
                          {THRESH_OPTIONS.map((v) => {
                            const picked = m3Matches[key] === v;
                            return (
                              <button
                                key={v}
                                disabled={m3Confirmed}
                                onClick={() => handleM3Pick(key, v)}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                  picked
                                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200'
                                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40'
                                }`}
                              >
                                {v.toLocaleString('vi-VN')} điểm
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {!m3Confirmed ? (
                    <button
                      onClick={handleM3Confirm}
                      disabled={m3Matches.ROOKIE === null || m3Matches.ENGINEER === null || m3Matches.LEGEND === null}
                      className="mt-4 w-full rounded-lg bg-cyan-500 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-40"
                    >
                      XÁC NHẬN
                    </button>
                  ) : (
                    <p className="mt-3 text-center text-xs text-slate-400">ROOKIE = 1 · ENGINEER = 800 · LEGEND = 1.600</p>
                  )}
                </motion.div>
              )}

              {/* MISSION 4 */}
              {missionStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center rounded-xl border border-cyan-500/30 bg-slate-900/80 p-5 backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center gap-2 text-cyan-300">
                    <IdCard className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Nhiệm vụ 4 · Nhận thẻ chiến binh</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-4 w-64 rounded-xl border border-amber-400/50 bg-gradient-to-b from-slate-800 to-slate-900 p-4 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
                  >
                    {m4Stamped && (
                      <motion.div
                        initial={{ opacity: 0, scale: 2, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: -12 }}
                        className="absolute right-3 top-3 rounded border-2 border-red-400 px-2 py-0.5 text-[10px] font-black text-red-400"
                      >
                        ĐÃ XÁC NHẬN
                      </motion.div>
                    )}
                    <p className="text-center text-xs font-bold text-amber-400">⚡ FUNLAB CHALLENGE</p>
                    <p className="mb-3 text-center text-[10px] text-slate-400">2026 – 2027</p>
                    <div className="space-y-1 border-t border-white/10 pt-3 text-[11px] text-slate-300">
                      <p>CẤP: ROOKIE 🌱</p>
                      <p>NĂM HỌC: 38 TUẦN</p>
                      <p>SỐ TẬP: 19 TẬP</p>
                      <p>ĐIỂM TỐI ĐA: 2.000</p>
                    </div>
                  </motion.div>
                  {!m4Stamped ? (
                    <button onClick={handleM4Stamp} className="w-full max-w-64 rounded-lg bg-amber-400 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110">
                      NHẬN THẺ CHIẾN BINH
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-semibold text-emerald-300">Bạn đã chính thức là Chiến Binh Funlab! Tổng điểm thực hành: 20/20!</p>
                      {countdown !== null && (
                        <p className="mt-2 text-3xl font-black text-cyan-300">{countdown > 0 ? countdown : 'GO!'}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ---------------- QUIZ ---------------- */}
          {gameState === 'quiz' && currentQ && (
            <motion.div
              key={`quiz-${qIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Câu {qIndex + 1}/5</span>
                <span className={`flex items-center gap-1 text-sm font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-slate-300'}`}>
                  <Clock className="h-4 w-4" /> {timeLeft}s
                </span>
              </div>
              <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full bg-gradient-to-r from-cyan-400 to-amber-400" animate={{ width: `${((qIndex + 1) / 5) * 100}%` }} />
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-slate-900/80 p-5 backdrop-blur-xl">
                <p className="mb-4 text-sm font-semibold leading-relaxed text-slate-100">
                  {currentQ.question.replace(/\{BLANK_\d\}/g, '_____')}
                </p>

                {currentQ.type === 'mcq' && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {currentQ.options.map((opt, idx) => {
                      const picked = mcqSelected === idx;
                      const right = idx === currentQ.correctIndex;
                      return (
                        <motion.button
                          key={opt}
                          disabled={answered}
                          onClick={() => handleMcqPick(idx)}
                          animate={answered && picked && !right ? { x: [0, -6, 6, -6, 0] } : { x: 0 }}
                          className={`rounded-lg border p-3 text-left text-sm font-medium transition ${
                            answered && right ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                              : answered && picked && !right ? 'border-red-400 bg-red-400/20 text-red-300'
                              : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/50'
                          }`}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === 'ordering' && (
                  <div>
                    <div className="mb-3 flex min-h-[2.5rem] flex-wrap gap-2 rounded-lg border border-dashed border-cyan-400/30 bg-black/30 p-2">
                      {orderSelected.length === 0 && <span className="text-xs text-slate-500">Bấm các mục bên dưới theo đúng thứ tự...</span>}
                      {orderSelected.map((item, i) => (
                        <span key={item} className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-200">{i + 1}. {item}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentQ.items.map((item) => {
                        const used = orderSelected.includes(item);
                        return (
                          <button
                            key={item}
                            disabled={used || answered}
                            onClick={() => handleOrderPick(item)}
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                              used ? 'border-white/5 bg-white/5 text-slate-600 opacity-40' : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/50'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    {!answered && orderSelected.length > 0 && (
                      <button onClick={() => setOrderSelected([])} className="mt-3 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
                        <RotateCcw className="h-3 w-3" /> Làm lại
                      </button>
                    )}
                    {answered && (
                      <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-2 text-xs text-slate-300">
                        Thứ tự đúng: {currentQ.correctOrders[0].join(' → ')}
                      </div>
                    )}
                  </div>
                )}

                {currentQ.type === 'fill_blank' && (
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {currentQ.correctAnswers.map((_, i) => (
                        <span key={i} className={`min-w-[3rem] rounded-lg border px-3 py-2 text-center text-sm font-bold ${
                          blanksFilled[i] ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200' : 'border-dashed border-white/20 text-slate-500'
                        }`}>
                          {blanksFilled[i] ?? `___${i + 1}`}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentQ.wordBank.map((word) => {
                        const used = blanksFilled.includes(word);
                        return (
                          <button
                            key={word}
                            disabled={used || answered}
                            onClick={() => handleBlankPick(word)}
                            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
                              used ? 'border-white/5 bg-white/5 text-slate-600 opacity-40'
                                : 'border-amber-400/40 bg-amber-400/10 text-amber-200 hover:border-amber-400'
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>
                    {!answered && blanksFilled.length > 0 && (
                      <button onClick={() => setBlanksFilled([])} className="mt-3 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
                        <RotateCcw className="h-3 w-3" /> Làm lại
                      </button>
                    )}
                    {answered && (
                      <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-2 text-xs text-slate-300">
                        Đáp án đúng: {currentQ.correctAnswers.join(' , ')}
                      </div>
                    )}
                  </div>
                )}

                <AnimatePresence>
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-4 flex items-start gap-2 rounded-lg border p-3 text-xs ${
                        isCorrect ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-red-400/40 bg-red-400/10 text-red-200'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                      <span>{currentQ.explanation}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={goNextQuestion}
                  disabled={!answered}
                  className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg bg-cyan-500 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {qIndex < 4 ? 'CÂU TIẾP' : 'XEM KẾT QUẢ'} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ---------------- RESULT ---------------- */}
          {gameState === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="mb-3 flex items-center justify-center gap-2 text-xl font-black text-amber-400">
                <PartyPopper className="h-6 w-6" /> HOÀN THÀNH TẬP 1!
              </div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 120 }} className="mx-auto mb-4 h-28 w-28">
                <Image src={badge.src} alt={badge.label} width={112} height={112} className="mx-auto h-28 w-28 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
              </motion.div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-cyan-300">{badge.label}</p>
              <div className="mx-auto mb-4 max-w-xs rounded-xl border border-amber-400/40 bg-amber-400/10 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Tổng điểm</p>
                <p className="text-4xl font-black text-amber-400">{countUp} / 50</p>
              </div>
              <div className="mx-auto mb-4 grid max-w-xs grid-cols-2 gap-3 text-left text-xs">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="flex items-center gap-1 font-bold text-cyan-300"><Rocket className="h-3.5 w-3.5" /> Thực hành</p>
                  <p className="mt-1 text-slate-200">{simScore}/20đ</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="flex items-center gap-1 font-bold text-cyan-300"><Trophy className="h-3.5 w-3.5" /> Kiến thức</p>
                  <p className="mt-1 text-slate-200">{quizScore}/30đ</p>
                </div>
              </div>
              <p className="mb-4 flex items-center justify-center gap-1 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" /> Thời gian: {formatTime(elapsedSeconds)}
              </p>
              <p className="mx-auto mb-6 max-w-sm text-sm font-medium leading-relaxed text-slate-200">{getComment(finalScore)}</p>
              <button
                onClick={handleSubmitScore}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 px-8 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> NỘP ĐIỂM LÊN BẢNG VÀNG
              </button>
            </motion.div>
          )}

          {/* ---------------- SUBMITTED ---------------- */}
          {gameState === 'submitted' && (
            <motion.div key="submitted" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 140 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/10"
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h2 className="mb-2 text-xl font-black text-emerald-300">Đã ghi nhận điểm!</h2>
              <p className="mx-auto max-w-sm text-sm text-slate-300">
                Điểm số {finalScore}/50 của bạn đã được gửi lên hệ thống Funlab Challenge 2026–2027. Hẹn gặp lại ở Tập 2!
              </p>
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5" /> Không thể chỉnh sửa sau khi nộp
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
