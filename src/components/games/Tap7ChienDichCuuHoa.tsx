'use client';

import React, { useState, useEffect } from 'react';
import { 
  Flame, Droplets, Siren, Award, CheckCircle, ArrowRight, ShieldCheck, Play, 
  RotateCcw, Link as LinkIcon, FileCheck, ExternalLink, Lock 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// --- PHẦN 1: NGÂN HÀNG ĐỀ TẬP 7 (HÓA HỌC & ÁP SUẤT) ---
const QUESTION_DB: Record<string, any[][]> = {
  THCS: [
    [
      { id: 't7_cs_1_1', cogLevel: 1, type: 'mcq', question: "Bột trắng được dùng để làm 'Chiếc bơm tàng hình' thổi bóng bay là gì?", options: ["Muối ăn", "Baking Soda (Natri Bicarbonat)", "Đường cát", "Bột năng"], correct: 1, explain: "Baking Soda phản ứng với acid trong giấm tạo ra khí CO2." },
      { id: 't7_cs_1_2', cogLevel: 1, type: 'mcq', question: "Khí được sinh ra trong thí nghiệm khiến quả bóng căng phồng là khí gì?", options: ["Oxy", "Nitơ", "Carbon Dioxide (CO2)", "Hydro"], correct: 2, explain: "Phản ứng giữa Baking Soda và giấm sinh ra khí CO2." }
    ],
    [
      { id: 't7_cs_2_1', cogLevel: 2, type: 'mcq', question: "Tại sao ngọn nến lại tắt khi Trang 'rót' khí từ bình vào?", options: ["Vì khí đó rất lạnh", "Vì CO2 nặng hơn không khí và ngăn Oxy tiếp xúc với lửa", "Vì Trang đã thổi mạnh", "Vì hơi nước làm ướt nến"], correct: 1, explain: "Khí CO2 nặng hơn nên chìm xuống, bao phủ ngọn nến và chiếm chỗ của Oxy (duy trì sự cháy)." },
      { id: 't7_cs_2_2', cogLevel: 2, type: 'mcq', question: "Hiện tượng gì xảy ra ngay khi Baking Soda rơi xuống bình đựng giấm?", options: ["Dung dịch đóng băng", "Dung dịch đổi sang màu xanh", "Sủi bọt khí cực mạnh", "Không có hiện tượng gì"], correct: 2, explain: "Đó là phản ứng hóa học tạo ra chất khí thoát ra ngoài." }
    ],
    [
      { id: 't7_cs_3_1', cogLevel: 3, type: 'mcq', question: "Ứng dụng nào sau đây KHÔNG dựa trên phản ứng tạo khí CO2 của Baking Soda?", options: ["Làm bánh mì nở xốp", "Bình chữa cháy", "Viên sủi vitamin C", "Làm sạch vết dầu mỡ"], correct: 3, explain: "Làm sạch dầu mỡ là tính chất tẩy rửa, không liên quan đến việc tạo khí nở hay dập lửa." },
      { id: 't7_cs_3_2', cogLevel: 3, type: 'mcq', question: "Nếu bạn muốn thổi quả bóng to hơn trong thí nghiệm này, bạn nên làm gì?", options: ["Cho thêm nhiều nước lạnh", "Tăng lượng Baking Soda và giấm", "Dùng chai nhỏ hơn", "Để trong bóng tối"], correct: 1, explain: "Tăng lượng chất tham gia phản ứng sẽ tạo ra nhiều khí CO2 hơn." }
    ],
    [
      { id: 't7_cs_4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp quy trình thực hiện 'Chiếc bơm tàng hình':", items: ["Đổ giấm vào chai nhựa", "Cho bột Baking Soda vào trong quả bóng", "Chụp miệng bóng vào cổ chai", "Nhấc bóng lên để bột rơi xuống giấm"], correctOrder: [0, 1, 2, 3] },
      { id: 't7_cs_4_2', cogLevel: 4, type: 'ordering', question: "Quy trình dập tắt nến bằng 'Phù thủy cứu hỏa':", items: ["Thực hiện phản ứng tạo khí CO2 trong bình", "Đợi khí CO2 tích tụ đầy dưới đáy bình", "Nghiêng nhẹ bình phía trên ngọn nến", "Khí CO2 tràn ra bao phủ làm nến tắt"], correctOrder: [0, 1, 2, 3] }
    ],
    [
      { id: 't7_cs_5_1', cogLevel: 5, type: 'fill_blank', question: "Khí CO2 có đặc điểm {0} hơn không khí, do đó nó thường {1} xuống phía dưới và đẩy Oxy lên cao.", options: ["nặng", "chìm", "nhẹ", "bay"], correct: ["nặng", "chìm"] },
      { id: 't7_cs_5_2', cogLevel: 5, type: 'fill_blank', question: "Baking soda giúp bánh mì nở vì tạo ra các {0} khí CO2 bên trong, làm khối bột trở nên {1}.", options: ["lỗ", "xốp", "vòng", "cứng"], correct: ["lỗ", "xốp"] }
    ]
  ],
  THPT: [
    [
      { id: 't7_pt_1_1', cogLevel: 1, type: 'mcq', question: "Công thức hóa học của Baking Soda (Natri Bicarbonat) là gì?", options: ["Na2CO3", "NaHCO3", "NaOH", "NaCl"], correct: 1, explain: "NaHCO3 là tên công thức của Natri Bicarbonat." },
      { id: 't7_pt_1_2', cogLevel: 1, type: 'mcq', question: "Dung dịch Acid Acetic nồng độ 5% thường được gọi là gì trong đời sống?", options: ["Nước oxy già", "Cồn y tế", "Giấm ăn", "Nước vôi trong"], correct: 2, explain: "Giấm ăn là dung dịch acid acetic loãng (thường từ 2-5%)." }
    ],
    [
      { id: 't7_pt_2_1', cogLevel: 2, type: 'mcq', question: "Sản phẩm của phản ứng giữa NaHCO3 và CH3COOH gồm những chất nào?", options: ["CO2, H2O và CH3COONa", "H2 và NaOH", "O2 và NaCl", "CO và Na2CO3"], correct: 0, explain: "Phản ứng: NaHCO3 + CH3COOH -> CH3COONa + H2O + CO2." },
      { id: 't7_pt_2_2', cogLevel: 2, type: 'mcq', question: "Bản chất của phản ứng tạo khí CO2 trong tập 7 thuộc loại phản ứng nào?", options: ["Phản ứng oxy hóa - khử", "Phản ứng phân hạch", "Phản ứng acid - base (tạo khí)", "Phản ứng nhiệt nhôm"], correct: 2, explain: "Acid Acetic phản ứng với muối Carbonat là phản ứng trao đổi acid-base điển hình." }
    ],
    [
      { id: 't7_pt_3_1', cogLevel: 3, type: 'mcq', question: "Tại sao viên sủi Vitamin C lại tan nhanh và tạo cảm giác sảng khoái khi cho vào nước?", options: ["Vì nó chứa đường chanh", "Vì phản ứng giữa acid hữu cơ và muối carbonat tạo bọt khí CO2", "Vì nước làm nó nổ", "Vì nó nhẹ hơn nước"], correct: 1, explain: "Viên sủi chứa acid citric and NaHCO3, khi gặp nước sẽ phản ứng tạo khí CO2 giúp viên thuốc tan nhanh." },
      { id: 't7_pt_3_2', cogLevel: 3, type: 'mcq', question: "Nếu thu được 2,24 lít khí CO2 (đktc) từ phản ứng, số mol Baking Soda tham gia phản ứng tối thiểu là:", options: ["0.01 mol", "0.1 mol", "1 mol", "2.24 mol"], correct: 1, explain: "n = V / 22.4 = 2.24 / 22.4 = 0.1 mol." }
    ],
    [
      { id: 't7_pt_4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp thứ tự biến thiên áp suất trong chai thí nghiệm:", items: ["Hỗn hợp hóa chất ở trạng thái tĩnh", "Phản ứng xảy ra giải phóng phân tử khí", "Số phân tử khí tăng nhanh trong không gian hẹp", "Áp suất tăng cao đẩy màng quả bóng giãn ra"], correctOrder: [0, 1, 2, 3] },
      { id: 't7_pt_4_2', cogLevel: 4, type: 'ordering', question: "Quy trình phân tích tính chất nặng hơn không khí của CO2:", items: ["Điều chế CO2 vào bình chứa", "Cân bình chứa khí CO2 và bình chứa không khí", "So sánh khối lượng mol (M_CO2=44 > M_air=29)", "Kết luận CO2 chìm xuống đáy đẩy không khí lên"], correctOrder: [0, 1, 2, 3] }
    ],
    [
      { id: 't7_pt_5_1', cogLevel: 5, type: 'fill_blank', question: "Trong bình chữa cháy, CO2 lỏng nén áp suất cao. Khi phun ra, nó {0} mạnh làm hạ nhiệt độ và {1} Oxy để dập tắt lửa.", options: ["giãn nở", "cách ly", "co lại", "thu hút"], correct: ["giãn nở", "cách ly"] },
      { id: 't7_pt_5_2', cogLevel: 5, type: 'fill_blank', question: "Phản ứng: $NaHCO_3 + CH_3COOH \\rightarrow {0} + H_2O + {1} \\uparrow$.", options: ["CH3COONa", "CO2", "NaOH", "O2"], correct: ["CH3COONa", "CO2"] }
    ]
  ]
};

interface Tap7Props {
  onGameComplete?: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
}

export default function Tap7ChienDichCuuHoa({ onGameComplete }: Tap7Props) {
  const supabase = createClient();
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, result, submitted
  const [level, setLevel] = useState('THCS');
  const [playerName, setPlayerName] = useState('');
  const [playerClass, setPlayerClass] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Question States
  const [currentAttempts, setCurrentAttempts] = useState(0); 
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [orderSelected, setOrderSelected] = useState<any[]>([]);
  const [fillBlankSelected, setFillBlankSelected] = useState<any[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrectCurrent, setIsCorrectCurrent] = useState(false);
  const [answersLog, setAnswersLog] = useState<any[]>([]);

  // STEM Form Link
  const stemFormLink = "https://forms.gle/VUKeqAp4YxUTmzKV9";

  // Auto-detect level based on class name
  const allowedLevel = React.useMemo(() => {
    if (!playerClass) return null;
    const match = playerClass.match(/^(\d+)/);
    if (!match) return null;
    const grade = parseInt(match[1], 10);
    if (grade >= 6 && grade <= 9) return 'THCS';
    if (grade >= 10 && grade <= 12) return 'THPT';
    return null;
  }, [playerClass]);

  useEffect(() => {
    if (allowedLevel) {
      setLevel(allowedLevel);
    }
  }, [allowedLevel]);

  // Load user profile
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, class_name').eq('id', user.id).single();
        if (profile) {
          setPlayerName(profile.full_name || 'Học giả Funlab');
          setPlayerClass(profile.class_name || 'Khách');
        }
      }
    }
    loadUser();
  }, [supabase]);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const generateQuestions = (selectedLevel: string) => {
    const bank = QUESTION_DB[selectedLevel];
    return bank.map(pair => {
      const q = JSON.parse(JSON.stringify(pair[Math.floor(Math.random() * pair.length)]));
      if (q.type === 'ordering') {
        q.displayItems = q.items.map((item: string, index: number) => ({ item, originalIndex: index }))
                                .sort(() => Math.random() - 0.5);
      }
      return q;
    });
  };

  const handleStart = () => {
    if (!playerName) return;
    setQuestions(generateQuestions(level));
    setCurrentIndex(0);
    setScore(0);
    setTimeElapsed(0);
    setAnswersLog([]);
    resetQuestionState();
    setGameState('playing');
  };

  const resetQuestionState = () => {
    setMcqSelected(null);
    setOrderSelected([]);
    setFillBlankSelected([]);
    setIsAnswerChecked(false);
    setIsCorrectCurrent(false);
    setCurrentAttempts(0);
  };

  const checkAnswer = () => {
    const q = questions[currentIndex];
    let isCorrect = false;

    if (q.type === 'mcq') {
      isCorrect = (mcqSelected === q.correct);
    } else if (q.type === 'ordering') {
      isCorrect = orderSelected.every((obj, idx) => obj.originalIndex === q.correctOrder[idx]);
    } else if (q.type === 'fill_blank') {
      isCorrect = fillBlankSelected.every((val, idx) => val === q.correct[idx]);
    }

    if (isCorrect) {
      const points = Math.max(2, 10 - (currentAttempts * 2));
      setScore(prev => prev + points);
      setIsCorrectCurrent(true);
      setIsAnswerChecked(true);
      setAnswersLog(prev => [...prev, { qId: q.id, question: q.question, attempts: currentAttempts + 1, isCorrect: true }]);
    } else {
      setIsCorrectCurrent(false);
      setCurrentAttempts(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      // Đã xong 5 câu hỏi -> Chuyển thẳng tới màn hình Result (tổng kết)
      setGameState('result');
    }
  };

  const submitFinal = () => {
    const payload = {
        score: score,
        timeInSeconds: timeElapsed,
        level: level,
        answersLog: answersLog
        // stemLink không còn gửi qua payload nữa, HS nộp thẳng qua Form
    };
    
    // Call parent handler
    if (onGameComplete) {
      onGameComplete(payload);
    }
    
    setGameState('submitted');
  };

  // --- RENDERS ---
  const renderMCQ = (q: any) => (
    <div className="space-y-3 w-full animate-in slide-in-from-bottom-4 duration-500">
      {q.options.map((opt: string, idx: number) => {
        let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-sm ";
        if (!isAnswerChecked) {
          btnClass += mcqSelected === idx ? "border-orange-500 bg-orange-100 text-orange-900 shadow-md scale-[1.02]" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50";
        } else {
          if (idx === q.correct) btnClass += "border-green-500 bg-green-50 text-green-800 shadow-md";
          else if (idx === mcqSelected) btnClass += "border-red-500 bg-red-50 text-red-800";
          else btnClass += "border-slate-200 bg-white opacity-40 text-slate-500";
        }
        return <button key={idx} disabled={isAnswerChecked} onClick={() => setMcqSelected(idx)} className={btnClass}>{opt}</button>;
      })}
    </div>
  );

  const renderOrdering = (q: any) => (
    <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-4 rounded-xl border-2 border-dashed border-orange-300 bg-white min-h-[100px] flex flex-col gap-2 shadow-sm">
        <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mb-1">Mô phỏng quy trình:</p>
        {orderSelected.map((obj, idx) => (
          <div key={idx} className="bg-orange-500 text-white p-3 rounded-lg border border-orange-600 flex items-center gap-3 animate-in zoom-in duration-200 shadow-md">
            <span className="bg-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">{idx + 1}</span>
            <span className="text-sm font-medium">{obj.item}</span>
          </div>
        ))}
        {orderSelected.length === 0 && <p className="text-slate-400 italic text-sm mt-4 text-center">Bấm chọn các bước theo thứ tự...</p>}
      </div>
      {!isAnswerChecked && (
        <div className="grid gap-2">
          {q.displayItems.map((obj: any, idx: number) => (
            <button key={idx} disabled={orderSelected.includes(obj)} onClick={() => setOrderSelected([...orderSelected, obj])} 
              className={`p-3 text-xs text-left rounded-xl border-2 transition-all ${orderSelected.includes(obj) ? 'opacity-30 border-slate-200 bg-slate-100' : 'border-slate-200 bg-white hover:border-orange-400 text-slate-700 shadow-sm'}`}>
              {obj.item}
            </button>
          ))}
          <button onClick={() => setOrderSelected([])} className="text-xs text-red-500 font-bold underline mt-2 self-start flex items-center gap-1"><RotateCcw size={12}/> Xếp lại từ đầu</button>
        </div>
      )}
    </div>
  );

  const renderFillBlank = (q: any) => {
    const parts = q.question.split(/{\d+}/);
    const fills = fillBlankSelected.length > 0 ? fillBlankSelected : Array(q.correct.length).fill(null);
    const handleWordSelect = (word: string) => {
        const nextIdx = fills.indexOf(null);
        if (nextIdx !== -1) {
            const newFills = [...fills];
            newFills[nextIdx] = word;
            setFillBlankSelected(newFills);
        }
    };
    return (
      <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-lg leading-relaxed text-slate-800 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {parts.map((p: string, i: number) => (
            <React.Fragment key={i}>
              {p}
              {i < q.correct.length && (
                <button onClick={() => !isAnswerChecked && setFillBlankSelected(fills.map((v, idx) => idx === i ? null : v))}
                  className={`inline-block min-w-[80px] border-b-2 mx-1 font-bold transition-all ${fills[i] ? 'text-orange-600 border-orange-500' : 'text-slate-400 border-dashed border-slate-300'}`}>
                  {fills[i] || "...."}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        {!isAnswerChecked && (
          <div className="flex flex-wrap gap-2 justify-center">
            {q.options.map((w: string, idx: number) => (
              <button key={idx} disabled={fills.includes(w)} onClick={() => handleWordSelect(w)} 
                className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all ${fills.includes(w) ? 'opacity-30 border-slate-200 bg-slate-100' : 'border-orange-200 bg-white text-orange-700 hover:bg-orange-50 hover:border-orange-400 shadow-sm'}`}>
                {w}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-orange-50 text-slate-800 flex flex-col items-center p-4 sm:p-6 overflow-y-auto relative font-sans custom-scrollbar game-safe-bottom">
      {/* Cảnh nền sáng sủa, năng động */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-100 blur-[80px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 flex flex-col h-full flex-1">
        
        {/* HEADER CHUNG */}
        {gameState !== 'welcome' && (
          <div className="flex justify-between items-center mb-6 py-4 border-b border-orange-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl shadow-sm border border-red-200">
                 <Flame size={24} style={{ transform: `scale(${1 - (currentIndex * 0.1)})` }} className="transition-transform duration-500" />
              </div>
              <div>
                <h2 className="text-xs font-black text-red-600 uppercase tracking-widest leading-none">{playerName ? playerName.toUpperCase() : 'LÍNH CỨU HỎA'}</h2>
                <div className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Thời gian: {timeElapsed}s | LVL: {level}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-orange-200 shadow-sm">
              <Award className="text-orange-500" size={20} />
              <span className="font-black text-lg text-slate-800">{score}</span>
              <span className="text-[10px] text-slate-400 font-bold">/ 50</span>
            </div>
          </div>
        )}

        {/* WELCOME SCREEN */}
        {gameState === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <div className="w-24 h-24 bg-red-100 border-4 border-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
              <Siren className="text-red-600" size={48} />
            </div>
            <h1 className="text-4xl font-black text-red-600 mb-2 uppercase tracking-tighter drop-shadow-sm">CHIẾN DỊCH CỨU HỎA</h1>
            <p className="text-orange-600 text-sm font-bold mb-8 tracking-[0.2em] uppercase">Vận dụng hóa học & áp suất</p>
            
            {/* [FIX 1] game-welcome-card + bottom-sheet-container: padding co lại trên mobile */}
            <div className="game-welcome-card bg-white p-8 rounded-[2rem] border border-orange-100 w-full shadow-xl relative overflow-hidden bottom-sheet-container">
              <div className="space-y-4 mb-6 text-left">
                <div className="flex flex-col bg-red-50/50 border border-red-100 p-4 rounded-xl relative overflow-hidden">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <ShieldCheck size={12} /> Thông tin sĩ tử
                    </span>
                    <p className="text-slate-800 font-black text-lg tracking-wide">{playerName || 'Đang tải...'}</p>
                    <p className="text-red-600 text-xs font-bold uppercase tracking-widest">{playerClass || 'Khách'}</p>
                </div>
              </div>

              {/* [FIX 1] level-selector-grid: 2 cột, không dính đáy màn hình */}
              <div className="level-selector-grid mb-6 md:mb-8">
                {['THCS', 'THPT'].map(l => (
                  <button key={l} 
                    onClick={() => {
                        if (allowedLevel === null || allowedLevel === l) setLevel(l);
                    }} 
                    className={`level-btn transition-all font-black relative overflow-hidden ${
                        level === l ? 'border-red-500 bg-red-50 text-red-600 shadow-md' : 'border-slate-100 bg-white text-slate-300'
                    } ${allowedLevel !== null && allowedLevel !== l ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-red-200'}`}>
                    {l}
                    {allowedLevel !== null && allowedLevel !== l && (
                        <div className="absolute top-1 right-1">
                            <Lock size={12} className="text-slate-300" />
                        </div>
                    )}
                  </button>
                ))}
              </div>

              {/* [FIX 4] game-start-btn: touch target >= 44px */}
              <button 
                onClick={handleStart} 
                disabled={!playerName}
                className="game-start-btn w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black text-xl shadow-lg shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                XUẤT PHÁT <Play size={20} fill="currentColor"/>
              </button>
            </div>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && (
          <div className="flex-1 flex flex-col pt-2 pb-10">
            {/* Progress bar dập lửa */}
            <div className="mb-6 flex gap-1.5 shrink-0">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`h-2 flex-1 rounded-full transition-all duration-500 ${idx < currentIndex ? 'bg-blue-400' : idx === currentIndex ? 'bg-orange-500 animate-pulse' : 'bg-slate-200'}`}></div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-4 shrink-0">
                <span className="text-[10px] font-black bg-red-100 text-red-600 px-3 py-1 rounded-md border border-red-200 uppercase tracking-tighter shadow-sm">Khu vực {currentIndex + 1}/5</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mức độ {questions[currentIndex]?.cogLevel}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-8 leading-relaxed shrink-0">{questions[currentIndex]?.question}</h3>
            
            <div className="flex-1">
              {questions[currentIndex]?.type === 'mcq' && renderMCQ(questions[currentIndex])}
              {questions[currentIndex]?.type === 'ordering' && renderOrdering(questions[currentIndex])}
              {questions[currentIndex]?.type === 'fill_blank' && renderFillBlank(questions[currentIndex])}
            </div>

            <div className="mt-8 pt-6 border-t border-orange-200 min-h-[140px] shrink-0">
              {!isAnswerChecked ? (
                <div className="space-y-3">
                    <button 
                        onClick={checkAnswer} 
                        disabled={(questions[currentIndex]?.type === 'mcq' && mcqSelected === null) || (questions[currentIndex]?.type === 'ordering' && orderSelected.length < questions[currentIndex]?.items.length) || (questions[currentIndex]?.type === 'fill_blank' && fillBlankSelected.length === 0)}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.98]"
                    >
                        Phân Tích Dập Lửa
                    </button>
                    {currentAttempts > 0 && !isCorrectCurrent && (
                        <p className="text-center text-red-500 text-xs font-bold animate-bounce tracking-wide">Thao tác sai! Đám cháy đang lan rộng, hãy thử lại! (-2đ)</p>
                    )}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className={`p-4 rounded-xl border-2 ${isCorrectCurrent ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {isCorrectCurrent ? <Droplets className="text-blue-500" size={20}/> : <Flame className="text-red-500" size={20}/>}
                        <span className={`text-sm font-black uppercase tracking-widest ${isCorrectCurrent ? 'text-green-600' : 'text-red-600'}`}>{isCorrectCurrent ? 'Đã khống chế hỏa hoạn!' : 'Sai quy trình!'}</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{questions[currentIndex]?.explain || "Ghi nhớ kiến thức này nhé!"}</p>
                  </div>
                  <button onClick={handleNext} className="w-full py-4 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-black flex justify-center items-center gap-2 transition-all uppercase tracking-widest shadow-md shadow-orange-500/20 active:scale-[0.98]">Tiến lên khu vực tiếp theo <ArrowRight size={20}/></button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESULT SCREEN WITH STEM LINK INCORPORATED */}
        {gameState === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-start text-center py-4 animate-in zoom-in duration-500">
            
            {/* Header Chúc mừng */}
            <div className="relative mb-6 mt-4">
                <ShieldCheck size={80} className="text-green-500" />
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full"></div>
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight">ĐÁM CHÁY ĐÃ ĐƯỢC DẬP TẮT</h1>
            <p className="text-slate-500 text-sm font-medium mb-8">Khu vực an toàn. Bạn đã hoàn thành 5 thử thách lý thuyết.</p>
            
            {/* Bảng Điểm */}
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-white p-6 rounded-[1.5rem] border border-orange-100 shadow-sm">
                  <p className="text-4xl font-black text-orange-500 tracking-tighter">{score}<span className="text-lg text-slate-400">/50</span></p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mt-1 tracking-widest">Điểm Lý Thuyết</p>
                </div>
                <div className="bg-white p-6 rounded-[1.5rem] border border-orange-100 shadow-sm">
                  <p className="text-4xl font-black text-blue-500 tracking-tighter">{timeElapsed}<span className="text-lg text-slate-400">s</span></p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold mt-1 tracking-widest">Thời gian cứu hỏa</p>
                </div>
            </div>

            {/* NHIỆM VỤ SỐ 6 - NỘP LINK TRỰC TIẾP QUA GOOGLE FORMS */}
            <div className="w-full bg-blue-50 p-6 rounded-2xl border border-blue-200 mb-8 text-left shadow-sm">
                <h3 className="text-lg font-black text-blue-800 uppercase mb-2 flex items-center gap-2">
                    <FileCheck size={20}/> Nhiệm Vụ Số 6: Dự Án STEM
                </h3>
                <p className="text-sm font-medium text-slate-600 mb-5 leading-relaxed">
                    Hãy nộp minh chứng (Hình ảnh/Video) cho sản phẩm <strong className="text-slate-800">Xe đua phản lực</strong> của bạn. 
                    Giáo viên sẽ chấm điểm thủ công và cộng trực tiếp vào Bảng Vàng.
                </p>
                
                <a 
                    href={stemFormLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-blue-600/20"
                >
                    <ExternalLink size={18}/> BẤM VÀO ĐÂY ĐỂ NỘP SẢN PHẨM
                </a>
            </div>

            {/* Nút Submit Lưu điểm Lý thuyết */}
            <button onClick={submitFinal} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-lg shadow-lg shadow-red-600/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98]">
                <Siren size={20}/> LƯU ĐIỂM LÝ THUYẾT LÊN BẢNG VÀNG
            </button>
          </div>
        )}

        {/* SUBMITTED SCREEN */}
        {gameState === 'submitted' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-[2rem] flex items-center justify-center mb-6 border-4 border-green-400 shadow-lg animate-in zoom-in">
                <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-widest">BÁO CÁO ĐÃ GỬI THÀNH CÔNG!</h2>
            <p className="text-slate-500 text-sm max-w-[320px] font-medium leading-relaxed">
                Điểm lý thuyết của bạn đã được lưu vào hệ thống Bảng Vàng. Đừng quên hoàn thành Form Dự án STEM nếu bạn chưa nộp nhé!
            </p>
            <p className="mt-10 text-[10px] text-orange-500 uppercase font-black tracking-[0.2em] bg-orange-100 px-4 py-2 rounded-full">
                Hệ thống đã khóa sau 1 lượt đấu
            </p>
          </div>
        )}

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fdba74;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
