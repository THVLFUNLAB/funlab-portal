'use client';

import React, { useState } from 'react';
import { 
  Wand2, Copy, ChevronDown, ChevronUp, Plus, Trash2, Check, 
  Palette, Type, Sparkles, BookOpen, Settings
} from 'lucide-react';

// =============================================
// QUESTION TEMPLATE GENERATOR
// Giúp thầy tạo code game chỉ bằng cách nhập câu hỏi
// =============================================

interface QuestionInput {
  id: string;
  cogLevel: number;
  type: 'mcq' | 'ordering' | 'fill_blank';
  question: string;
  options: string[];
  correct: number | number[] | string[];
  explain: string;
}

interface TemplateConfig {
  themeName: string;
  themeColor: 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'pink';
  themeEmoji: string;
  stemFormLink: string;
  stemProjectName: string;
}

const COLOR_PRESETS: Record<string, { bg: string; accent: string; light: string; border: string }> = {
  red:    { bg: 'red-50',    accent: 'red-600',    light: 'red-100',    border: 'red-200' },
  blue:   { bg: 'blue-50',   accent: 'blue-600',   light: 'blue-100',   border: 'blue-200' },
  green:  { bg: 'green-50',  accent: 'green-600',  light: 'green-100',  border: 'green-200' },
  purple: { bg: 'purple-50', accent: 'purple-600', light: 'purple-100', border: 'purple-200' },
  orange: { bg: 'orange-50', accent: 'orange-600', light: 'orange-100', border: 'orange-200' },
  cyan:   { bg: 'cyan-50',   accent: 'cyan-600',   light: 'cyan-100',   border: 'cyan-200' },
  pink:   { bg: 'pink-50',   accent: 'pink-600',   light: 'pink-100',   border: 'pink-200' },
};

const EMOJI_OPTIONS = ['🔥', '⚡', '🧪', '🔬', '🧲', '💡', '🌊', '🎯', '🚀', '🌋', '🧊', '☀️', '🔋', '🧬', '🪐'];

const createEmptyQuestion = (level: number, prefix: string): QuestionInput => ({
  id: `${prefix}_${level}_${Date.now()}`,
  cogLevel: level,
  type: 'mcq',
  question: '',
  options: ['', '', '', ''],
  correct: 0,
  explain: ''
});

interface QuestionTemplateGeneratorProps {
  onCodeGenerated: (code: string) => void;
}

export default function QuestionTemplateGenerator({ onCodeGenerated }: QuestionTemplateGeneratorProps) {
  const [config, setConfig] = useState<TemplateConfig>({
    themeName: 'Thử Thách Mới',
    themeColor: 'blue',
    themeEmoji: '⚡',
    stemFormLink: '',
    stemProjectName: '',
  });

  const [thcsQuestions, setThcsQuestions] = useState<QuestionInput[]>([
    createEmptyQuestion(1, 'cs'),
    createEmptyQuestion(2, 'cs'),
    createEmptyQuestion(3, 'cs'),
    createEmptyQuestion(4, 'cs'),
    createEmptyQuestion(5, 'cs'),
  ]);

  const [thptQuestions, setThptQuestions] = useState<QuestionInput[]>([
    createEmptyQuestion(1, 'pt'),
    createEmptyQuestion(2, 'pt'),
    createEmptyQuestion(3, 'pt'),
    createEmptyQuestion(4, 'pt'),
    createEmptyQuestion(5, 'pt'),
  ]);

  const [expandedSections, setExpandedSections] = useState({ thcs: true, thpt: false, config: true });
  const [generated, setGenerated] = useState(false);

  const toggleSection = (key: 'thcs' | 'thpt' | 'config') => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateQuestion = (
    setter: React.Dispatch<React.SetStateAction<QuestionInput[]>>,
    index: number,
    field: string,
    value: any
  ) => {
    setter(prev => {
      const updated = [...prev];
      if (field === 'options') {
        updated[index] = { ...updated[index], options: value };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const updateOption = (
    setter: React.Dispatch<React.SetStateAction<QuestionInput[]>>,
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    setter(prev => {
      const updated = [...prev];
      const newOpts = [...updated[qIndex].options];
      newOpts[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: newOpts };
      return updated;
    });
  };

  // ============ CODE GENERATOR ============
  const generateGameCode = () => {
    const c = COLOR_PRESETS[config.themeColor];
    
    const formatQuestions = (questions: QuestionInput[], prefix: string) => {
      return questions.map((q, i) => {
        const level = i + 1;
        return `    [
      { id: '${prefix}_${level}_1', cogLevel: ${level}, type: 'mcq', question: ${JSON.stringify(q.question)}, options: ${JSON.stringify(q.options)}, correct: ${q.correct}, explain: ${JSON.stringify(q.explain)} }
    ]`;
      }).join(',\n');
    };

    const code = `// ═══════════════════════════════════════════════════════
// GAME TẬP MỚI - ${config.themeName.toUpperCase()}
// Auto-generated bằng Question Template Generator
// ═══════════════════════════════════════════════════════

var QUESTION_DB = {
  THCS: [
${formatQuestions(thcsQuestions, 'cs')}
  ],
  THPT: [
${formatQuestions(thptQuestions, 'pt')}
  ]
};

var stemFormLink = ${JSON.stringify(config.stemFormLink)};

function Game({ onGameComplete }) {
  var _state = useState('welcome');
  var gameState = _state[0], setGameState = _state[1];
  
  var _level = useState('THCS');
  var level = _level[0], setLevel = _level[1];
  
  var _name = useState('');
  var playerName = _name[0], setPlayerName = _name[1];
  
  var _class = useState('');
  var playerClass = _class[0], setPlayerClass = _class[1];
  
  var _questions = useState([]);
  var questions = _questions[0], setQuestions = _questions[1];
  
  var _idx = useState(0);
  var currentIndex = _idx[0], setCurrentIndex = _idx[1];
  
  var _score = useState(0);
  var score = _score[0], setScore = _score[1];
  
  var _time = useState(0);
  var timeElapsed = _time[0], setTimeElapsed = _time[1];
  
  var _attempts = useState(0);
  var currentAttempts = _attempts[0], setCurrentAttempts = _attempts[1];
  
  var _selected = useState(null);
  var mcqSelected = _selected[0], setMcqSelected = _selected[1];
  
  var _checked = useState(false);
  var isAnswerChecked = _checked[0], setIsAnswerChecked = _checked[1];
  
  var _correct = useState(false);
  var isCorrectCurrent = _correct[0], setIsCorrectCurrent = _correct[1];
  
  var _log = useState([]);
  var answersLog = _log[0], setAnswersLog = _log[1];

  // Auto detect grade level
  var allowedLevel = useMemo(function() {
    if (!playerClass) return null;
    var match = playerClass.match(/^(\\d+)/);
    if (!match) return null;
    var grade = parseInt(match[1], 10);
    if (grade >= 6 && grade <= 9) return 'THCS';
    if (grade >= 10 && grade <= 12) return 'THPT';
    return null;
  }, [playerClass]);

  useEffect(function() {
    if (allowedLevel) setLevel(allowedLevel);
  }, [allowedLevel]);

  // Load user profile
  useEffect(function() {
    var supabase = createClient();
    supabase.auth.getUser().then(function(res) {
      var user = res.data.user;
      if (user) {
        supabase.from('profiles').select('full_name, class_name').eq('id', user.id).single().then(function(r) {
          if (r.data) {
            setPlayerName(r.data.full_name || 'Học giả Funlab');
            setPlayerClass(r.data.class_name || 'Khách');
          }
        });
      }
    });
  }, []);

  // Timer
  useEffect(function() {
    var timer;
    if (gameState === 'playing') {
      timer = setInterval(function() { setTimeElapsed(function(p) { return p + 1; }); }, 1000);
    }
    return function() { clearInterval(timer); };
  }, [gameState]);

  var generateQuestions = function(selectedLevel) {
    var bank = QUESTION_DB[selectedLevel];
    return bank.map(function(pair) {
      return JSON.parse(JSON.stringify(pair[Math.floor(Math.random() * pair.length)]));
    });
  };

  var handleStart = function() {
    if (!playerName) return;
    setQuestions(generateQuestions(level));
    setCurrentIndex(0);
    setScore(0);
    setTimeElapsed(0);
    setAnswersLog([]);
    setMcqSelected(null);
    setIsAnswerChecked(false);
    setIsCorrectCurrent(false);
    setCurrentAttempts(0);
    setGameState('playing');
  };

  var checkAnswer = function() {
    var q = questions[currentIndex];
    var isCorrect = (mcqSelected === q.correct);
    if (isCorrect) {
      var points = Math.max(2, 10 - (currentAttempts * 2));
      setScore(function(p) { return p + points; });
      setIsCorrectCurrent(true);
      setIsAnswerChecked(true);
      setAnswersLog(function(p) { return p.concat([{ qId: q.id, attempts: currentAttempts + 1, isCorrect: true }]); });
    } else {
      setIsCorrectCurrent(false);
      setCurrentAttempts(function(p) { return p + 1; });
    }
  };

  var handleNext = function() {
    if (currentIndex < 4) {
      setCurrentIndex(function(p) { return p + 1; });
      setMcqSelected(null);
      setIsAnswerChecked(false);
      setIsCorrectCurrent(false);
      setCurrentAttempts(0);
    } else {
      setGameState('result');
    }
  };

  var submitFinal = function() {
    if (onGameComplete) {
      onGameComplete({ score: score, timeInSeconds: timeElapsed, level: level, answersLog: answersLog });
    }
    setGameState('submitted');
  };

  // ─── RENDER ─── 
  var e = React.createElement;

  if (gameState === 'welcome') {
    return e('div', { className: 'w-full h-full min-h-[600px] bg-${c.bg} text-slate-800 flex flex-col items-center p-4 sm:p-6 overflow-y-auto relative font-sans' },
      e('div', { className: 'absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-${c.light} blur-[80px] rounded-full pointer-events-none' }),
      e('div', { className: 'w-full max-w-2xl relative z-10 flex flex-col h-full flex-1' },
        e('div', { className: 'flex-1 flex flex-col items-center justify-center text-center py-10' },
          e('div', { className: 'text-6xl mb-4' }, '${config.themeEmoji}'),
          e('h1', { className: 'text-3xl sm:text-4xl font-black text-${c.accent} mb-2 uppercase tracking-tighter' }, ${JSON.stringify(config.themeName.toUpperCase())}),
          e('div', { className: 'bg-white p-6 sm:p-8 rounded-[2rem] border border-${c.border} w-full shadow-xl mt-6' },
            e('div', { className: 'bg-${c.light}/50 border border-${c.border} p-4 rounded-xl mb-6' },
              e('p', { className: 'text-xs font-bold text-${c.accent} uppercase tracking-widest mb-1' }, 'Thông tin sĩ tử'),
              e('p', { className: 'text-slate-800 font-black text-lg' }, playerName || 'Đang tải...'),
              e('p', { className: 'text-${c.accent} text-xs font-bold uppercase tracking-widest' }, playerClass || 'Khách')
            ),
            e('div', { className: 'grid grid-cols-2 gap-3 mb-6' },
              ['THCS', 'THPT'].map(function(l) {
                var isActive = level === l;
                var isLocked = allowedLevel !== null && allowedLevel !== l;
                return e('button', { 
                  key: l, 
                  onClick: function() { if (!isLocked) setLevel(l); },
                  className: 'p-3 rounded-xl border-2 font-black text-lg transition-all ' + 
                    (isActive ? 'border-${c.accent} bg-${c.light} text-${c.accent} shadow-md' : 'border-slate-100 bg-white text-slate-300') +
                    (isLocked ? ' opacity-40 grayscale cursor-not-allowed' : ' hover:border-${c.border}')
                }, l);
              })
            ),
            e('button', { 
              onClick: handleStart, 
              disabled: !playerName,
              className: 'w-full py-4 bg-${c.accent} hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-black text-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest'
            }, 'XUẤT PHÁT ▶')
          )
        )
      )
    );
  }

  if (gameState === 'playing') {
    var q = questions[currentIndex];
    return e('div', { className: 'w-full h-full min-h-[600px] bg-${c.bg} text-slate-800 flex flex-col items-center p-4 sm:p-6 overflow-y-auto relative font-sans' },
      e('div', { className: 'w-full max-w-2xl relative z-10 flex flex-col h-full flex-1' },
        // Header
        e('div', { className: 'flex justify-between items-center mb-6 py-4 border-b border-${c.border} shrink-0' },
          e('div', { className: 'flex items-center gap-3' },
            e('span', { className: 'text-2xl' }, '${config.themeEmoji}'),
            e('div', null,
              e('h2', { className: 'text-xs font-black text-${c.accent} uppercase tracking-widest' }, playerName.toUpperCase()),
              e('div', { className: 'text-[10px] text-slate-500 font-bold mt-1' }, 'Thời gian: ' + timeElapsed + 's | LVL: ' + level)
            )
          ),
          e('div', { className: 'flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-${c.border} shadow-sm' },
            e('span', { className: 'font-black text-lg text-slate-800' }, score),
            e('span', { className: 'text-[10px] text-slate-400 font-bold' }, '/ 50')
          )
        ),
        // Progress
        e('div', { className: 'mb-6 flex gap-1.5 shrink-0' },
          [0,1,2,3,4].map(function(idx) {
            return e('div', { key: idx, className: 'h-2 flex-1 rounded-full transition-all duration-500 ' + 
              (idx < currentIndex ? 'bg-${c.accent}' : idx === currentIndex ? 'bg-${c.accent} animate-pulse opacity-60' : 'bg-slate-200') });
          })
        ),
        // Question
        e('div', { className: 'mb-2 text-[10px] font-black bg-${c.light} text-${c.accent} px-3 py-1 rounded-md border border-${c.border} uppercase tracking-tighter shadow-sm inline-block' }, 'Câu ' + (currentIndex + 1) + '/5 — Mức ' + q.cogLevel),
        e('h3', { className: 'text-xl sm:text-2xl font-bold text-slate-800 mb-6 leading-relaxed' }, q.question),
        // Options
        e('div', { className: 'space-y-3 flex-1' },
          q.options.map(function(opt, idx) {
            var btnClass = 'w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-sm ';
            if (!isAnswerChecked) {
              btnClass += mcqSelected === idx ? 'border-${c.accent} bg-${c.light} text-${c.accent} shadow-md scale-[1.02]' : 'border-slate-200 bg-white text-slate-700 hover:border-${c.border} hover:bg-${c.light}/50';
            } else {
              if (idx === q.correct) btnClass += 'border-green-500 bg-green-50 text-green-800 shadow-md';
              else if (idx === mcqSelected) btnClass += 'border-red-500 bg-red-50 text-red-800';
              else btnClass += 'border-slate-200 bg-white opacity-40 text-slate-500';
            }
            return e('button', { key: idx, disabled: isAnswerChecked, onClick: function() { setMcqSelected(idx); }, className: btnClass }, opt);
          })
        ),
        // Action
        e('div', { className: 'mt-8 pt-6 border-t border-${c.border} shrink-0' },
          !isAnswerChecked 
            ? e('div', { className: 'space-y-3' },
                e('button', { onClick: checkAnswer, disabled: mcqSelected === null, className: 'w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.98]' }, 'Kiểm Tra Đáp Án'),
                currentAttempts > 0 && !isCorrectCurrent ? e('p', { className: 'text-center text-red-500 text-xs font-bold animate-bounce tracking-wide' }, 'Sai rồi! Thử lại nhé! (-2đ)') : null
              )
            : e('div', { className: 'space-y-4' },
                e('div', { className: 'p-4 rounded-xl border-2 ' + (isCorrectCurrent ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400') },
                  e('span', { className: 'text-sm font-black uppercase tracking-widest ' + (isCorrectCurrent ? 'text-green-600' : 'text-red-600') }, isCorrectCurrent ? '✅ Chính xác!' : '❌ Sai!'),
                  e('p', { className: 'text-sm text-slate-700 font-medium leading-relaxed mt-2' }, q.explain || 'Ghi nhớ kiến thức này nhé!')
                ),
                e('button', { onClick: handleNext, className: 'w-full py-4 bg-${c.accent} text-white hover:opacity-90 rounded-xl font-black uppercase tracking-widest shadow-md active:scale-[0.98]' }, currentIndex < 4 ? 'Câu Tiếp Theo ▶' : 'Xem Kết Quả 🏆')
              )
        )
      )
    );
  }

  if (gameState === 'result') {
    return e('div', { className: 'w-full h-full min-h-[600px] bg-${c.bg} text-slate-800 flex flex-col items-center p-4 sm:p-6 overflow-y-auto relative font-sans' },
      e('div', { className: 'w-full max-w-2xl relative z-10 flex flex-col items-center justify-start text-center py-4' },
        e('div', { className: 'text-6xl mb-4 mt-4' }, '🏆'),
        e('h1', { className: 'text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight' }, 'HOÀN THÀNH!'),
        e('p', { className: 'text-slate-500 text-sm mb-8' }, 'Bạn đã trả lời xong 5 câu hỏi.'),
        e('div', { className: 'grid grid-cols-2 gap-4 w-full mb-8' },
          e('div', { className: 'bg-white p-6 rounded-[1.5rem] border border-${c.border} shadow-sm' },
            e('p', { className: 'text-4xl font-black text-${c.accent}' }, score, e('span', { className: 'text-lg text-slate-400' }, '/50')),
            e('p', { className: 'text-slate-400 text-[10px] uppercase font-bold mt-1 tracking-widest' }, 'Điểm Số')
          ),
          e('div', { className: 'bg-white p-6 rounded-[1.5rem] border border-${c.border} shadow-sm' },
            e('p', { className: 'text-4xl font-black text-blue-500' }, timeElapsed, e('span', { className: 'text-lg text-slate-400' }, 's')),
            e('p', { className: 'text-slate-400 text-[10px] uppercase font-bold mt-1 tracking-widest' }, 'Thời gian')
          )
        ),
        stemFormLink ? e('div', { className: 'w-full bg-blue-50 p-6 rounded-2xl border border-blue-200 mb-8 text-left shadow-sm' },
          e('h3', { className: 'text-lg font-black text-blue-800 uppercase mb-2' }, '📋 Nhiệm Vụ STEM'),
          e('p', { className: 'text-sm text-slate-600 mb-4' }, 'Nộp minh chứng sản phẩm ' + ${JSON.stringify(config.stemProjectName || 'STEM')} + ' của bạn.'),
          e('a', { href: stemFormLink, target: '_blank', rel: 'noopener noreferrer', className: 'w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg' }, '🔗 NỘP SẢN PHẨM')
        ) : null,
        e('button', { onClick: submitFinal, className: 'w-full py-5 bg-${c.accent} hover:opacity-90 text-white rounded-xl font-black text-lg shadow-lg transition-all uppercase tracking-widest active:scale-[0.98]' }, '💾 LƯU ĐIỂM LÊN BẢNG VÀNG')
      )
    );
  }

  if (gameState === 'submitted') {
    return e('div', { className: 'w-full h-full min-h-[600px] bg-${c.bg} text-slate-800 flex flex-col items-center justify-center p-6 overflow-y-auto relative font-sans' },
      e('div', { className: 'text-6xl mb-6' }, '✅'),
      e('h2', { className: 'text-2xl font-black text-slate-800 mb-2 uppercase tracking-widest' }, 'ĐÃ GỬI THÀNH CÔNG!'),
      e('p', { className: 'text-slate-500 text-sm max-w-xs text-center' }, 'Điểm đã được lưu vào Bảng Vàng. Chúc mừng bạn!'),
      e('p', { className: 'mt-8 text-[10px] text-${c.accent} uppercase font-black tracking-[0.2em] bg-${c.light} px-4 py-2 rounded-full' }, 'Hệ thống đã khóa sau 1 lượt đấu')
    );
  }

  return null;
}

return Game;`;

    return code;
  };

  const handleGenerate = () => {
    const code = generateGameCode();
    onCodeGenerated(code);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  // ======== RENDER QUESTION FORM ========
  const renderQuestionForm = (
    questions: QuestionInput[],
    setter: React.Dispatch<React.SetStateAction<QuestionInput[]>>,
    prefix: string
  ) => (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={q.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded uppercase tracking-widest">
              Câu {i + 1} — Mức {i + 1}
            </span>
          </div>
          
          {/* Question Text */}
          <textarea
            rows={2}
            value={q.question}
            onChange={e => updateQuestion(setter, i, 'question', e.target.value)}
            className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-white text-sm mb-3 focus:border-cyan-500 focus:outline-none transition-colors"
            placeholder="Nhập nội dung câu hỏi..."
          />
          
          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {q.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2">
                <button
                  onClick={() => updateQuestion(setter, i, 'correct', optIdx)}
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-black transition-all ${
                    q.correct === optIdx 
                      ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                      : 'bg-slate-700 text-slate-500 hover:bg-slate-600'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </button>
                <input
                  type="text"
                  value={opt}
                  onChange={e => updateOption(setter, i, optIdx, e.target.value)}
                  className="flex-1 bg-black/30 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder={`Đáp án ${String.fromCharCode(65 + optIdx)}...`}
                />
              </div>
            ))}
          </div>
          
          {/* Explain */}
          <input
            type="text"
            value={q.explain}
            onChange={e => updateQuestion(setter, i, 'explain', e.target.value)}
            className="w-full bg-black/30 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-xs focus:border-cyan-500 focus:outline-none transition-colors"
            placeholder="Giải thích đáp án đúng..."
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl p-5 space-y-5">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-widest">TẠO ĐỀ THI TỰ ĐỘNG</h3>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest">Nhập câu hỏi → Auto-generate code game</p>
        </div>
      </div>

      {/* CONFIG SECTION */}
      <div className="border border-slate-700/50 rounded-xl overflow-hidden">
        <button onClick={() => toggleSection('config')} className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <Settings className="w-4 h-4 text-cyan-400" /> CẤU HÌNH CHUNG
          </span>
          {expandedSections.config ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>
        {expandedSections.config && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tên chủ đề</label>
              <input 
                type="text" value={config.themeName} 
                onChange={e => setConfig(prev => ({ ...prev, themeName: e.target.value }))} 
                className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Màu theme</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(COLOR_PRESETS).map(color => (
                  <button 
                    key={color} 
                    onClick={() => setConfig(prev => ({ ...prev, themeColor: color as any }))}
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${config.themeColor === color ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: color === 'red' ? '#dc2626' : color === 'blue' ? '#2563eb' : color === 'green' ? '#16a34a' : color === 'purple' ? '#9333ea' : color === 'orange' ? '#ea580c' : color === 'cyan' ? '#0891b2' : '#db2777' }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Biểu tượng</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map(emoji => (
                  <button 
                    key={emoji} 
                    onClick={() => setConfig(prev => ({ ...prev, themeEmoji: emoji }))}
                    className={`w-10 h-10 rounded-xl border-2 text-xl flex items-center justify-center transition-all ${config.themeEmoji === emoji ? 'border-white bg-slate-800 scale-110 shadow-lg' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Link Google Form STEM (Tùy chọn)</label>
                <input type="text" value={config.stemFormLink} onChange={e => setConfig(prev => ({ ...prev, stemFormLink: e.target.value }))} className="w-full bg-black/40 border border-slate-700 rounded-lg p-2 text-white text-sm focus:border-cyan-500 focus:outline-none" placeholder="https://forms.gle/..." />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tên dự án STEM (Tùy chọn)</label>
                <input type="text" value={config.stemProjectName} onChange={e => setConfig(prev => ({ ...prev, stemProjectName: e.target.value }))} className="w-full bg-black/40 border border-slate-700 rounded-lg p-2 text-white text-sm focus:border-cyan-500 focus:outline-none" placeholder="VD: Xe đua phản lực" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* THCS QUESTIONS */}
      <div className="border border-slate-700/50 rounded-xl overflow-hidden">
        <button onClick={() => toggleSection('thcs')} className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <BookOpen className="w-4 h-4 text-blue-400" /> 5 CÂU HỎI THCS (Lớp 6-9)
          </span>
          {expandedSections.thcs ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>
        {expandedSections.thcs && (
          <div className="p-4">
            {renderQuestionForm(thcsQuestions, setThcsQuestions, 'cs')}
          </div>
        )}
      </div>

      {/* THPT QUESTIONS */}
      <div className="border border-slate-700/50 rounded-xl overflow-hidden">
        <button onClick={() => toggleSection('thpt')} className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-300">
            <BookOpen className="w-4 h-4 text-purple-400" /> 5 CÂU HỎI THPT (Lớp 10-12)
          </span>
          {expandedSections.thpt ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>
        {expandedSections.thpt && (
          <div className="p-4">
            {renderQuestionForm(thptQuestions, setThptQuestions, 'pt')}
          </div>
        )}
      </div>

      {/* GENERATE BUTTON */}
      <button 
        onClick={handleGenerate}
        className={`w-full py-4 rounded-xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] ${
          generated 
            ? 'bg-green-600 text-white shadow-green-500/30' 
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/30 hover:from-purple-500 hover:to-pink-500'
        }`}
      >
        {generated ? (
          <><Check className="w-6 h-6" /> ĐÃ TẠO CODE THÀNH CÔNG!</>
        ) : (
          <><Wand2 className="w-6 h-6" /> GENERATE CODE GAME</>
        )}
      </button>
    </div>
  );
}
