'use client';

import React, { useState, useEffect } from 'react';
import { Wind, Clock, Award, CheckCircle, XCircle, ArrowRight, Brain, Target, ShieldCheck, Activity } from 'lucide-react';

// --- PHẦN 1: KIẾN TRÚC DỮ LIỆU & NGÂN HÀNG ĐỀ ---
const QUESTION_BANK = {
  THCS: [
    // L1: Nhận biết
    { id: 'c1_1', cogLevel: 1, type: 'mcq', question: "Bộ phận nào được ví như 'chiếc bơm' chính của hệ hô hấp?", options: ["Khí quản", "Cơ hoành", "Phổi", "Phế quản"], correct: 1, explain: "Cơ hoành là cơ quan chính nâng hạ lồng ngực để tạo chênh lệch áp suất." },
    { id: 'c1_2', cogLevel: 1, type: 'mcq', question: "Phổi người có đặc điểm cấu tạo nào sau đây?", options: ["Hoạt động bằng cơ bắp riêng", "Là khối đặc chứa máu", "Là các túi xốp, đàn hồi, hoàn toàn thụ động", "Có khung xương bảo vệ bên trong"], correct: 2, explain: "Phổi hoàn toàn thụ động, không có cơ, nó co giãn nhờ lực kéo của lồng ngực." },
    // L2: Thông hiểu
    { id: 'c2_1', cogLevel: 2, type: 'mcq', question: "Khi cơ hoành co và hạ thấp xuống, hiện tượng gì sẽ xảy ra?", options: ["Không khí bị đẩy ra ngoài", "Không khí ùa vào phổi (Hít vào)", "Phổi xẹp lại", "Nấc cụt"], correct: 1, explain: "Cơ hoành hạ -> Thể tích lồng ngực tăng -> Áp suất giảm -> Khí ùa vào." },
    { id: 'c2_2', cogLevel: 2, type: 'mcq', question: "Tại sao khi bị đấm mạnh vào vùng bụng lại gây nghẹt thở tạm thời?", options: ["Do dập phổi", "Do vỡ mạch máu", "Do cơ hoành bị chấn động và co thắt (liệt tạm thời)", "Do thức ăn trào ngược"], correct: 2, explain: "Cơ hoành bị chấn động không thể co giãn, làm quá trình hô hấp bị 'đứng hình'." },
    // L3: Vận dụng
    { id: 'c3_1', cogLevel: 3, type: 'mcq', question: "Để thực hiện 'thở bụng' đúng cách giúp khỏe phổi, khi hít vào cơ thể phải thế nào?", options: ["Hóp bụng, nhô vai cao", "Bụng phình ra, vai giữ nguyên", "Ngực phình to, bụng hóp lại", "Nín thở 5 giây"], correct: 1, explain: "Thở bụng đúng là khi cơ hoành hạ tối đa làm bụng phình ra, tiết kiệm sức lực nhất." },
    { id: 'c3_2', cogLevel: 3, type: 'mcq', question: "Tiếng nấc cụt phát ra là do cơ quan nào bị kích thích gây co giật liên tục?", options: ["Dạ dày", "Cơ hoành", "Cuống họng", "Thanh quản"], correct: 1, explain: "Nấc là phản xạ co giật của cơ hoành, làm khí hít vào đột ngột khiến thanh quản đóng sập tạo tiếng 'hấc'." },
    // L4: Sắp xếp
    { id: 'c4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp theo thứ tự ĐÚNG của quá trình HÍT VÀO:", items: ["Cơ hoành co và hạ thấp", "Thể tích lồng ngực tăng lên", "Áp suất trong phổi giảm xuống", "Không khí từ ngoài tràn vào phổi"], correctOrder: [0, 1, 2, 3], explain: "Logic: Chuyển động cơ -> Thay đổi thể tích -> Thay đổi áp suất -> Dòng khí di chuyển." },
    { id: 'c4_2', cogLevel: 4, type: 'ordering', question: "Sắp xếp theo thứ tự ĐÚNG của quá trình THỞ RA:", items: ["Cơ hoành thư giãn, đẩy vòng lên trên", "Thể tích lồng ngực thu hẹp lại", "Áp suất trong phổi tăng cao", "Không khí bị ép đẩy ra ngoài"], correctOrder: [0, 1, 2, 3], explain: "Quá trình ép khí: Cơ hoành giãn -> Thể tích giảm -> Áp suất tăng -> Khí thoát ra." },
    // L5: Điền khuyết
    { id: 'c5_1', cogLevel: 5, type: 'fill_blank', question: "Theo định luật Vật lý Boyle, khi nhiệt độ không đổi, {0} của một lượng khí luôn tỉ lệ nghịch với {1} của nó.", options: ["thể tích", "áp suất", "khối lượng", "nhiệt độ"], correct: ["thể tích", "áp suất"], explain: "Thể tích (V) tăng thì Áp suất (P) giảm và ngược lại." },
    { id: 'c5_2', cogLevel: 5, type: 'fill_blank', question: "Phổi người hoàn toàn {0}. Không khí di chuyển ra vào phổi thuần túy nhờ sự chênh lệch {1} do cơ hoành tạo ra.", options: ["thụ động", "áp suất", "chủ động", "nhiệt độ"], correct: ["thụ động", "áp suất"], explain: "Phổi thụ động như quả bóng, chỉ phình/xẹp theo áp suất lồng ngực." },
  ],
  THPT: [
    // L1: Nhận biết
    { id: 'p1_1', cogLevel: 1, type: 'mcq', question: "Định luật vật lý nào giải thích trực tiếp nhất cơ chế thông khí ở phổi người?", options: ["Định luật Newton", "Định luật Boyle-Mariotte", "Định luật Charles", "Nguyên lý Pascal"], correct: 1, explain: "Định luật Boyle-Mariotte: Áp suất và thể tích của một lượng khí tỉ lệ nghịch với nhau." },
    { id: 'p1_2', cogLevel: 1, type: 'mcq', question: "Áp suất trong khoang màng phổi luôn duy trì ở trạng thái nào so với áp suất khí quyển?", options: ["Luôn cao hơn", "Luôn bằng nhau", "Luôn âm (thấp hơn)", "Thay đổi liên tục từ âm sang dương"], correct: 2, explain: "Áp suất âm trong màng phổi giúp giữ cho phổi luôn ở trạng thái mở giãn, bám sát vào thành lồng ngực." },
    // L2: Thông hiểu
    { id: 'p2_1', cogLevel: 2, type: 'mcq', question: "Trong mô hình phổi STEM, nếu lớp màng cao su (cơ hoành) bị rách thủng, hiện tượng gì sẽ xảy ra?", options: ["Hai quả bóng (phổi) vẫn phình bình thường", "Hai quả bóng không thể phình ra được nữa", "Bóng sẽ tự nổ tung", "Áp suất trong bình giảm mạnh"], correct: 1, explain: "Khi màng thủng, áp suất trong bình luôn cân bằng với bên ngoài, mất đi sự chênh lệch áp suất để hút khí vào." },
    { id: 'p2_2', cogLevel: 2, type: 'mcq', question: "Triệu chứng 'tràn khí màng phổi' nguy hiểm làm xẹp phổi là do đâu?", options: ["Do cơ hoành co thắt quá mạnh", "Do áp suất khoang màng phổi mất trạng thái âm, cân bằng với khí quyển", "Do phế nang bị vỡ", "Do tắc nghẽn khí quản"], correct: 1, explain: "Khi khoang màng phổi bị hở, không khí tràn vào làm mất áp suất âm, phổi sẽ co rúm lại theo tính đàn hồi tự nhiên." },
    // L3: Vận dụng
    { id: 'p3_1', cogLevel: 3, type: 'mcq', question: "Việc leo núi cao (như đỉnh Everest) gây khó thở nghiêm trọng CHỦ YẾU do nguyên nhân vật lý nào?", options: ["Tỷ lệ phần trăm % Oxy trong không khí giảm", "Nhiệt độ quá lạnh làm phổi co lại", "Áp suất khí quyển giảm mạnh, làm giảm chênh lệch áp suất hút khí", "Trọng lực Trái Đất yếu đi"], correct: 2, explain: "Tỷ lệ Oxy vẫn là 21%, nhưng áp suất tổng giảm khiến phân áp Oxy giảm, phổi khó tạo đủ chênh lệch để 'hút' không khí đặc vào." },
    { id: 'p3_2', cogLevel: 3, type: 'mcq', question: "Máy thở áp lực dương (Ventilator) trong y tế khác biệt cốt lõi với hô hấp tự nhiên ở điểm nào?", options: ["Bơm trực tiếp không khí vào phổi (áp suất dương) thay vì tạo áp suất âm ở lồng ngực", "Lọc không khí sạch hơn", "Giúp cơ hoành co bóp mạnh hơn", "Hút khí carbonic ra ngoài"], correct: 0, explain: "Hô hấp tự nhiên là dùng áp suất ÂM (hút). Máy thở dùng áp suất DƯƠNG (đẩy cưỡng bức) khí vào phổi bệnh nhân." },
    // L4: Sắp xếp
    { id: 'p4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp cơ chế giải thích sự khó thở khi leo núi cao:", items: ["Càng lên cao, mật độ không khí càng loãng", "Áp suất khí quyển bên ngoài môi trường giảm", "Chênh lệch áp suất giữa phổi và môi trường bị thu hẹp", "Phổi phải làm việc gắng sức hơn để hút đủ lượng khí Oxy"], correctOrder: [0, 1, 2, 3], explain: "Áp suất ngoài giảm -> Gradient áp suất giảm -> Bơm cơ hoành kém hiệu quả." },
    { id: 'p4_2', cogLevel: 4, type: 'ordering', question: "Sắp xếp cơ chế hoạt động của 'Phổi Thép' (Máy thở áp lực âm cổ điển):", items: ["Tạo môi trường áp suất âm (chân không) bao quanh lồng ngực bệnh nhân", "Lồng ngực bệnh nhân bị lực hút làm giãn nở ra", "Áp suất bên trong phế nang giảm xuống thấp hơn khí quyển", "Không khí từ ngoài tràn qua mũi/miệng vào phổi"], correctOrder: [0, 1, 2, 3], explain: "Mô phỏng y hệt cơ hoành: Giãn lồng ngực từ bên ngoài -> P phế nang giảm -> Hút khí vào." },
    // L5: Điền khuyết
    { id: 'p5_1', cogLevel: 5, type: 'fill_blank', question: "Khí Oxy khuếch tán từ phế nang vào máu nhờ chênh lệch {0}. Khi lên vùng núi cao, sự chênh lệch này bị {1} gây ra tình trạng thiếu Oxy mô.", options: ["phân áp", "thu hẹp", "thể tích", "mở rộng"], correct: ["phân áp", "thu hẹp"], explain: "Khuếch tán khí phụ thuộc vào Phân áp (Partial Pressure). Lên cao phân áp O2 giảm -> gradient thu hẹp." },
    { id: 'p5_2', cogLevel: 5, type: 'fill_blank', question: "Về mặt cơ học, cơ hoành hoạt động như một {0} khổng lồ. Sự dịch chuyển của nó làm biến đổi {1} lồng ngực, từ đó chi phối toàn bộ áp suất phế nang.", options: ["piston", "thể tích", "van 1 chiều", "khối lượng"], correct: ["piston", "thể tích"], explain: "Cơ hoành hạ/nâng giống hệt chuyển động của piston trong xilanh để thay đổi thể tích." },
  ]
};

// --- Props interface ---
interface Tap5GameProps {
  onGameComplete?: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
}

// --- PHẦN 2: ENGINE RANDOMIZE & LOGIC GAME ---
export default function FunLabBreathingChallenge({ onGameComplete }: Tap5GameProps) {
  const [gameState, setGameState] = useState('welcome');
  const [level, setLevel] = useState('THCS');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answersLog, setAnswersLog] = useState<any[]>([]);

  // States thao tác trong câu hỏi
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [orderSelected, setOrderSelected] = useState<any[]>([]);
  const [fillBlankSelected, setFillBlankSelected] = useState<(string | null)[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrectCurrent, setIsCorrectCurrent] = useState(false);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Thuật toán Bốc 5 Câu Hỏi (1 câu mỗi mức độ nhận thức)
  const generateQuestions = (selectedLevel: string) => {
    const bank = QUESTION_BANK[selectedLevel as keyof typeof QUESTION_BANK];
    const picked: any[] = [];
    for (let i = 1; i <= 5; i++) {
      const levelQs = bank.filter((q: any) => q.cogLevel === i);
      const randomQ = levelQs[Math.floor(Math.random() * levelQs.length)];
      const qClone = JSON.parse(JSON.stringify(randomQ));
      
      if (qClone.type === 'ordering') {
        const shuffled = qClone.items.map((item: string, index: number) => ({ item, originalIndex: index }))
                                   .sort(() => Math.random() - 0.5);
        qClone.displayItems = shuffled;
      }
      picked.push(qClone);
    }
    return picked;
  };

  const handleStart = () => {
    const qs = generateQuestions(level);
    setQuestions(qs);
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
  };

  // --- XỬ LÝ CÁC DẠNG CÂU HỎI ---
  const checkAnswer = () => {
    const q = questions[currentIndex];
    let isCorrect = false;
    let userAnswerLog: any = null;

    if (q.type === 'mcq') {
      isCorrect = (mcqSelected === q.correct);
      userAnswerLog = q.options[mcqSelected!];
    } 
    else if (q.type === 'ordering') {
      if (orderSelected.length !== q.items.length) return;
      isCorrect = orderSelected.every((obj: any, idx: number) => obj.originalIndex === q.correctOrder[idx]);
      userAnswerLog = orderSelected.map((obj: any) => obj.item);
    } 
    else if (q.type === 'fill_blank') {
      if (fillBlankSelected.length !== q.correct.length || fillBlankSelected.includes(null)) return;
      isCorrect = fillBlankSelected.every((val, idx) => val === q.correct[idx]);
      userAnswerLog = fillBlankSelected;
    }

    if (isCorrect) setScore(prev => prev + 10);
    setIsCorrectCurrent(isCorrect);
    setIsAnswerChecked(true);

    setAnswersLog(prev => [...prev, {
      questionId: q.id,
      questionText: q.question,
      userAnswer: userAnswerLog,
      isCorrect: isCorrect,
      timeAtAnswer: timeElapsed
    }]);
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      setGameState('result');
    }
  };

  const handleSubmitScore = () => {
    const payload = {
      score: score,
      timeInSeconds: timeElapsed,
      level: level,
      answersLog: answersLog,
    };
    
    if (onGameComplete) {
      onGameComplete(payload);
    } else {
      // Fallback cho standalone / preview
      window.parent.postMessage({ 
        type: 'FUNLAB_SCORE', 
        score: score,
        message: `Hoàn thành thử thách Cơ Hoành Hô Hấp. Đạt ${score} điểm.` 
      }, '*');
    }
    setGameState('submitted');
  };

  // --- RENDERS DẠNG CÂU HỎI ---
  const renderMCQ = (q: any) => (
    <div className="space-y-4 w-full">
      {q.options.map((opt: string, idx: number) => {
        let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 font-medium ";
        if (!isAnswerChecked) {
          btnClass += mcqSelected === idx 
            ? "border-cyan-400 bg-cyan-900/50 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
            : "border-slate-800 bg-slate-900 hover:border-cyan-700 hover:bg-slate-800 text-slate-300";
        } else {
          if (idx === q.correct) btnClass += "border-emerald-500 bg-emerald-900/50 text-emerald-100";
          else if (idx === mcqSelected) btnClass += "border-rose-500 bg-rose-900/50 text-rose-100";
          else btnClass += "border-slate-800 bg-slate-900 opacity-40 text-slate-500";
        }

        return (
          <button 
            key={idx} 
            disabled={isAnswerChecked}
            onClick={() => setMcqSelected(idx)}
            className={btnClass}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  const renderOrdering = (q: any) => {
    const handleSelect = (itemObj: any) => {
      if (!orderSelected.includes(itemObj)) {
        setOrderSelected([...orderSelected, itemObj]);
      }
    };
    const handleReset = () => setOrderSelected([]);

    return (
      <div className="w-full space-y-6">
        <div className="p-4 rounded-xl border-2 border-dashed border-cyan-800 bg-slate-900/50 min-h-[120px] flex flex-col gap-2">
          <span className="text-xs text-cyan-500 uppercase font-bold tracking-widest mb-1">Quy trình Vật lý của bạn:</span>
          {orderSelected.map((obj: any, idx: number) => (
            <div key={idx} className="bg-cyan-900 text-cyan-100 p-3 rounded-lg border border-cyan-500 shadow-sm flex items-center gap-3">
              <span className="bg-cyan-950 text-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-cyan-800">{idx + 1}</span>
              <span className="text-sm">{obj.item}</span>
            </div>
          ))}
          {orderSelected.length === 0 && <span className="text-slate-600 text-sm italic">Click vào các bước bên dưới để sắp xếp...</span>}
        </div>

        {!isAnswerChecked && (
          <div className="grid gap-3">
            {q.displayItems.map((obj: any, idx: number) => {
              const isPicked = orderSelected.includes(obj);
              return (
                <button
                  key={idx}
                  disabled={isPicked}
                  onClick={() => handleSelect(obj)}
                  className={`p-3 text-sm text-left rounded-xl border-2 transition-all ${isPicked ? 'border-slate-800 bg-slate-900/50 text-slate-700 cursor-not-allowed' : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-cyan-500 hover:bg-slate-700'}`}
                >
                  {obj.item}
                </button>
              );
            })}
          </div>
        )}
        
        {!isAnswerChecked && orderSelected.length > 0 && (
          <button onClick={handleReset} className="text-sm text-rose-400 hover:text-rose-300 underline underline-offset-4">Xóa xếp lại</button>
        )}
      </div>
    );
  };

  const renderFillBlank = (q: any) => {
    const parts = q.question.split(/\{\d+\}/);
    const currentFills: (string | null)[] = fillBlankSelected.length > 0 
      ? fillBlankSelected 
      : Array(q.correct.length).fill(null);

    const handleWordClick = (word: string) => {
      const emptyIdx = currentFills.indexOf(null);
      if (emptyIdx !== -1 && !currentFills.includes(word)) {
        const newArr = [...currentFills];
        newArr[emptyIdx] = word;
        setFillBlankSelected(newArr);
      }
    };

    const handleBlankClick = (idx: number) => {
      if (isAnswerChecked) return;
      const newArr = [...currentFills];
      newArr[idx] = null;
      setFillBlankSelected(newArr);
    };

    return (
      <div className="w-full space-y-8">
        <div className="text-lg leading-loose text-slate-200 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          {parts.map((part: string, idx: number) => (
            <React.Fragment key={idx}>
              <span>{part}</span>
              {idx < q.correct.length && (
                <button
                  onClick={() => handleBlankClick(idx)}
                  className={`inline-block min-w-[100px] text-center mx-2 px-3 py-1 border-b-2 font-bold transition-colors ${currentFills[idx] ? 'border-cyan-400 text-cyan-300' : 'border-slate-600 text-slate-600 border-dashed'}`}
                >
                  {currentFills[idx] || "____"}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {!isAnswerChecked && (
          <div className="flex flex-wrap gap-3 justify-center bg-slate-950 p-4 rounded-xl border border-slate-800">
            {q.options.map((word: string, idx: number) => {
              const isUsed = currentFills.includes(word);
              return (
                <button
                  key={idx}
                  disabled={isUsed}
                  onClick={() => handleWordClick(word)}
                  className={`px-4 py-2 rounded-lg font-medium border-2 transition-all ${isUsed ? 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed' : 'bg-cyan-900/30 border-cyan-700 text-cyan-300 hover:bg-cyan-800 hover:border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]'}`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 overflow-auto relative">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-3xl relative z-10 flex flex-col flex-1">
        
        {/* HEADER CHUNG */}
        {gameState !== 'welcome' && (
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <Wind size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-widest">Bảng Đấu: {level}</h2>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={12}/> {Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:{(timeElapsed % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
              <Award className="text-yellow-500" size={18} />
              <span className="font-black text-lg text-white">{score}</span>
              <span className="text-xs text-slate-500">/ 50</span>
            </div>
          </div>
        )}

        {/* MÀN HÌNH WELCOME */}
        {gameState === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-slate-900 border-2 border-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Activity className="text-cyan-400" size={40} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 text-center">CHUYÊN ĐỀ CƠ HOÀNH</h1>
            <p className="text-cyan-500 uppercase tracking-[0.2em] text-xs sm:text-sm font-bold mb-10 text-center">Bí mật chiếc bơm sinh học</p>
            
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl">
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3 font-bold">Chọn Bảng Đấu Của Bạn</label>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button onClick={() => setLevel('THCS')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${level === 'THCS' ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                  <ShieldCheck size={24} />
                  <span className="font-black">THCS</span>
                </button>
                <button onClick={() => setLevel('THPT')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${level === 'THPT' ? 'bg-blue-950 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                  <Brain size={24} />
                  <span className="font-black">THPT</span>
                </button>
              </div>
              <button onClick={handleStart} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl font-black text-lg uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                Vào Thi Đấu
              </button>
            </div>
          </div>
        )}

        {/* MÀN HÌNH PLAYING */}
        {gameState === 'playing' && questions.length > 0 && (
          <div className="flex-1 flex flex-col">
            {/* Progress */}
            <div className="mb-6 flex gap-1">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx < currentIndex ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : idx === currentIndex ? 'bg-cyan-300 animate-pulse' : 'bg-slate-800'}`}></div>
              ))}
            </div>

            <div className="flex justify-between items-end mb-4">
              <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest px-3 py-1 bg-cyan-950 rounded border border-cyan-900">
                Câu {currentIndex + 1}/5 • Mức độ {questions[currentIndex].cogLevel}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-8 leading-relaxed">
              {questions[currentIndex].question}
            </h3>

            {/* Renderer theo Type */}
            <div className="flex-1 w-full">
              {questions[currentIndex].type === 'mcq' && renderMCQ(questions[currentIndex])}
              {questions[currentIndex].type === 'ordering' && renderOrdering(questions[currentIndex])}
              {questions[currentIndex].type === 'fill_blank' && renderFillBlank(questions[currentIndex])}
            </div>

            {/* Khu vực Xác nhận / Giải thích */}
            <div className="mt-8 pt-6 border-t border-slate-800 min-h-[120px]">
              {!isAnswerChecked ? (
                <button 
                  onClick={checkAnswer}
                  disabled={
                    (questions[currentIndex].type === 'mcq' && mcqSelected === null) || 
                    (questions[currentIndex].type === 'ordering' && orderSelected.length !== questions[currentIndex].items.length) ||
                    (questions[currentIndex].type === 'fill_blank' && (fillBlankSelected.length === 0 || fillBlankSelected.includes(null)))
                  }
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl font-black text-lg transition-all"
                >
                  XÁC NHẬN ĐÁP ÁN
                </button>
              ) : (
                <div>
                  <div className={`p-4 rounded-xl mb-4 border ${isCorrectCurrent ? 'bg-emerald-950/50 border-emerald-800' : 'bg-rose-950/50 border-rose-800'}`}>
                    <div className={`flex items-center gap-2 font-black text-lg mb-2 ${isCorrectCurrent ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCorrectCurrent ? <CheckCircle /> : <XCircle />}
                      {isCorrectCurrent ? "CHÍNH XÁC! +10 ĐIỂM" : "CHƯA ĐÚNG!"}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      <span className="font-bold text-slate-100">Giải thích: </span>{questions[currentIndex].explain}
                    </p>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2"
                  >
                    {currentIndex < 4 ? "CÂU TIẾP THEO" : "XEM KẾT QUẢ TỔNG QUAN"} <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MÀN HÌNH KẾT QUẢ */}
        {gameState === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <Target size={64} className="text-cyan-400 mb-6" />
            <h1 className="text-4xl font-black text-white mb-2 uppercase">Hoàn Thành Nhiệm Vụ</h1>
            <p className="text-slate-400 mb-8 text-sm">Bạn đã chinh phục hoàn toàn thử thách Hô Hấp của FunLab.</p>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-sm mb-8 flex justify-between items-center shadow-xl">
               <div>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Tổng điểm</p>
                 <p className="text-4xl font-black text-yellow-400">{score}<span className="text-lg text-slate-600">/50</span></p>
               </div>
               <div className="w-px h-16 bg-slate-800"></div>
               <div>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Thời gian</p>
                 <p className="text-4xl font-black text-cyan-400">{timeElapsed}<span className="text-lg text-slate-600">s</span></p>
               </div>
            </div>

            <button 
              onClick={handleSubmitScore}
              className="w-full max-w-sm py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-black text-lg tracking-widest transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]"
            >
              LƯU ĐIỂM & CẬP NHẬT BXH
            </button>
          </div>
        )}

        {/* MÀN HÌNH ĐÃ GỬI (KHOÁ GIAO DIỆN) */}
        {gameState === 'submitted' && (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
             <div className="w-24 h-24 bg-emerald-950 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle className="text-emerald-400" size={48} />
             </div>
             <h2 className="text-2xl font-black text-emerald-400 mb-2">ĐÃ GHI NHẬN ĐIỂM SỐ!</h2>
             <p className="text-slate-400">Dữ liệu đã được đồng bộ an toàn về hệ thống Admin FunLab.</p>
             <p className="text-slate-500 text-sm mt-8 italic">Vui lòng đóng cửa sổ này hoặc chờ hướng dẫn tiếp theo từ Giáo viên.</p>
          </div>
        )}

      </div>
    </div>
  );
}
