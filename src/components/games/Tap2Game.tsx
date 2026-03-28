'use client';

import React, { useState, useEffect } from 'react';
import { Box, ArrowDown, Activity, Clock, Award, CheckCircle, XCircle, ArrowRight, Brain, Target, ShieldCheck, Footprints, Layers } from 'lucide-react';

// --- PHẦN 1: KIẾN TRÚC DỮ LIỆU & NGÂN HÀNG ĐỀ TẬP 2 ---
const QUESTION_BANK = {
  THCS: [
    { id: 's2_cs_1_1', cogLevel: 1, type: 'mcq', question: "Công thức tính áp suất chất rắn nào sau đây là ĐÚNG?", options: ["P = S / F", "P = F * S", "P = F / S", "P = F + S"], correct: 2, explain: "Áp suất (P) bằng Áp lực (F) chia cho Diện tích bị ép (S)." },
    { id: 's2_cs_1_2', cogLevel: 1, type: 'mcq', question: "Đơn vị đo của áp suất trong hệ đo lường quốc tế là gì?", options: ["Niuton (N)", "Mét vuông (m2)", "Pascan (Pa)", "Kilogam (kg)"], correct: 2, explain: "Đơn vị áp suất là Pascal (Pa), với 1 Pa = 1 N/m2." },
    { id: 's2_cs_2_1', cogLevel: 2, type: 'mcq', question: "Tại sao Gia Phố đi dép gót nhọn lại bị lún cát sâu hơn Đình Toàn đi giày thể thao?", options: ["Vì Gia Phố nặng hơn", "Vì diện tích tiếp xúc của gót dép nhỏ nên áp suất lớn", "Vì dép gót nhọn đẹp hơn", "Vì Đình Toàn đi nhanh hơn"], correct: 1, explain: "Cùng một trọng lượng, nhưng diện tích gót dép rất nhỏ làm áp suất tăng vọt gây lún." },
    { id: 's2_cs_2_2', cogLevel: 2, type: 'mcq', question: "Trong thí nghiệm bàn đinh, tại sao nhiều chiếc đinh lại giúp quả bóng KHÔNG bị nổ?", options: ["Vì đinh được làm từ nhựa", "Vì nhiều đinh làm tăng diện tích tiếp xúc, giảm áp suất", "Vì bóng bay là loại đặc biệt", "Vì đinh đã bị mài cùn"], correct: 1, explain: "Nhiều đinh giúp chia đều áp lực lên diện tích lớn hơn, làm áp suất lên mỗi điểm nhỏ đi." },
    { id: 's2_cs_3_1', cogLevel: 3, type: 'mcq', question: "Muốn giảm áp suất tác dụng lên mặt bị ép, ta cần làm gì?", options: ["Tăng áp lực và giảm diện tích tiếp xúc", "Giảm áp lực hoặc tăng diện tích tiếp xúc", "Chỉ cần tăng áp lực", "Giữ nguyên cả F và S"], correct: 1, explain: "Để P nhỏ, ta cần mẫu số (S) lớn hoặc tử số (F) nhỏ." },
    { id: 's2_cs_3_2', cogLevel: 3, type: 'mcq', question: "Khi nằm trên bàn đinh, người biểu diễn thường nằm phẳng lưng thay vì chống bằng 1 tay vì:", options: ["Nằm cho đỡ mỏi", "Để tăng diện tích tiếp xúc, tránh bị đinh đâm thủng da", "Để khán giả dễ quan sát", "Để cân bằng trọng tâm"], correct: 1, explain: "Diện tích lưng lớn giúp giảm áp suất lên mỗi đầu đinh xuống mức an toàn." },
    { id: 's2_cs_4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp thứ tự để giải thích hiện tượng lún cát của dép gót nhọn:", items: ["Trọng lượng cơ thể tạo ra áp lực F", "Gót dép nhỏ tạo diện tích tiếp xúc S nhỏ", "Áp suất P = F/S tăng cao", "Mặt cát bị biến dạng mạnh gây thụt lún"], correctOrder: [0, 1, 2, 3], explain: "Logic: Có lực -> Có diện tích nhỏ -> Áp suất lớn -> Biến dạng lún." },
    { id: 's2_cs_4_2', cogLevel: 4, type: 'ordering', question: "Quy trình thực hiện thử thách đứng trên ống giấy an toàn:", items: ["Cuộn giấy A4 thành các ống hình trụ đều nhau", "Xếp các ống giấy sát nhau thành cụm", "Đặt tấm form phẳng lên trên các ống giấy", "Bước nhẹ nhàng lên giữa tấm form"], correctOrder: [0, 1, 2, 3], explain: "Cần đảm bảo diện tích tiếp xúc dàn đều để áp suất không tập trung vào một ống." },
    { id: 's2_cs_5_1', cogLevel: 5, type: 'fill_blank', question: "Gia Phố nặng 60kg và tấm form 5kg. Tổng khối lượng là 65kg (F = 650N). Nếu đứng trên 13 ống giấy, mỗi ống chịu áp lực {0} N. Đây là ứng dụng {1} diện tích tiếp xúc.", options: ["50", "tăng", "650", "giảm"], correct: ["50", "tăng"], explain: "F_mỗi_ống = 650 / 13 = 50N. Đây là cách tăng diện tích tiếp xúc để giảm áp suất." },
    { id: 's2_cs_5_2', cogLevel: 5, type: 'fill_blank', question: "Móng nhà thường được xây {0} hơn tường để {1} áp suất lên nền đất, giúp nhà không bị lún.", options: ["rộng", "giảm", "hẹp", "tăng"], correct: ["rộng", "giảm"], explain: "Móng rộng để tăng S, dẫn đến P giảm." },
  ],
  THPT: [
    { id: 's2_pt_1_1', cogLevel: 1, type: 'mcq', question: "Đại lượng nào sau đây đặc trưng cho tác dụng gây biến dạng của áp lực lên mặt bị ép?", options: ["Lực ma sát", "Công cơ học", "Áp suất", "Vận tốc"], correct: 2, explain: "Áp suất đặc trưng cho mức độ mạnh yếu của áp lực lên một đơn vị diện tích." },
    { id: 's2_pt_1_2', cogLevel: 1, type: 'mcq', question: "Trạng thái nào của vật chất có thể gây ra áp suất theo mọi hướng lên vật nằm trong nó?", options: ["Chất rắn", "Chất lỏng và chất khí", "Chỉ chất khí", "Chỉ chất lỏng"], correct: 1, explain: "Chất rắn chỉ gây áp suất theo phương của áp lực, còn chất lưu gây áp suất mọi hướng." },
    { id: 's2_pt_2_1', cogLevel: 2, type: 'mcq', question: "Tại sao lưỡi dao càng mỏng và sắc thì càng dễ cắt vật?", options: ["Vì dao nặng hơn", "Vì diện tích tiếp xúc cực nhỏ làm áp suất cực lớn", "Vì lực ma sát lớn", "Vì dao làm bằng thép tốt"], correct: 1, explain: "Diện tích tiếp xúc (S) ở lưỡi dao sắc rất nhỏ, tạo ra áp suất khổng lồ dù lực ấn nhẹ." },
    { id: 's2_pt_2_2', cogLevel: 2, type: 'mcq', question: "Một chiếc xe tăng nặng hàng chục tấn vẫn chạy được trên bùn lầy là nhờ bộ phận nào?", options: ["Động cơ khỏe", "Bánh xích có diện tích tiếp xúc rất lớn", "Súng đại bác", "Vỏ thép dày"], correct: 1, explain: "Bánh xích tăng diện tích S cực lớn, làm áp suất lên nền đất giảm xuống mức thấp hơn cả người đi bộ." },
    { id: 's2_pt_3_1', cogLevel: 3, type: 'mcq', question: "Một người đứng bằng cả hai chân trên sàn. Nếu người đó co một chân lên, áp suất tác dụng lên sàn sẽ thay đổi như thế nào?", options: ["Giảm đi một nửa", "Không đổi", "Tăng gấp đôi", "Tăng gấp bốn"], correct: 2, explain: "Áp lực F không đổi nhưng diện tích S giảm một nửa -> P = F/(S/2) = 2P." },
    { id: 's2_pt_3_2', cogLevel: 3, type: 'mcq', question: "Khi ô tô bị sa lầy trên bãi cát, người ta thường lót những tấm ván xuống dưới bánh xe để:", options: ["Làm đẹp", "Giảm ma sát", "Tăng diện tích tiếp xúc để giảm áp suất lún", "Làm bánh xe nóng lên"], correct: 2, explain: "Tấm ván mở rộng diện tích ép lên cát, giúp xe không bị lún sâu thêm." },
    { id: 's2_pt_4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp trình tự đo áp suất của một học sinh đứng trên sàn nhà:", items: ["Dùng cân đo khối lượng m để tính áp lực F=mg", "Vẽ bóng bàn chân lên giấy kẻ ô vuông để tính diện tích S", "Tính tổng diện tích tiếp xúc của hai bàn chân", "Lấy F chia cho S để tìm áp suất P"], correctOrder: [0, 1, 2, 3], explain: "Quy trình thực hiện thực nghiệm: Xác định lực -> Xác định diện tích -> Tính toán." },
    { id: 's2_pt_4_2', cogLevel: 4, type: 'ordering', question: "Sắp xếp các vật sau theo thứ tự ÁP SUẤT tăng dần (giả sử cùng áp lực F):", items: ["Bàn chân người (S lớn nhất)", "Gót giày cao gót (S trung bình)", "Mũi đinh thép (S nhỏ)", "Lưỡi dao lam sắc (S cực nhỏ)"], correctOrder: [0, 1, 2, 3], explain: "Theo công thức P=F/S, vật nào có S càng nhỏ thì P càng lớn." },
    { id: 's2_pt_5_1', cogLevel: 5, type: 'fill_blank', question: "Áp suất chất rắn phụ thuộc {0} vào độ lớn áp lực và phụ thuộc {1} với diện tích mặt bị ép.", options: ["thuận", "nghịch", "cộng", "trừ"], correct: ["thuận", "nghịch"], explain: "P tỉ lệ thuận với F và tỉ lệ nghịch với S." },
    { id: 's2_pt_5_2', cogLevel: 5, type: 'fill_blank', question: "Đứng trên 10 ống giấy, mỗi ống chịu 65N. Nếu rút bớt còn 5 ống, áp lực mỗi ống là {0} N. Áp suất lên mỗi ống giấy đã {1} gấp đôi.", options: ["130", "tăng", "65", "giảm"], correct: ["130", "tăng"], explain: "F_mới = 650 / 5 = 130N. Số ống giảm 1 nửa thì áp lực lên mỗi ống tăng gấp đôi." },
  ]
};

// --- Props interface ---
interface Tap2GameProps {
  onGameComplete?: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
}

// --- PHẦN 2: LOGIC ENGINE & UI ---

export default function Tap2Game({ onGameComplete }: Tap2GameProps) {
  const [gameState, setGameState] = useState('welcome');
  const [level, setLevel] = useState('THCS');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answersLog, setAnswersLog] = useState<any[]>([]);

  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [orderSelected, setOrderSelected] = useState<any[]>([]);
  const [fillBlankSelected, setFillBlankSelected] = useState<(string | null)[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrectCurrent, setIsCorrectCurrent] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const generateQuestions = (selectedLevel: string) => {
    const bank = QUESTION_BANK[selectedLevel as keyof typeof QUESTION_BANK];
    const picked = [];
    for (let i = 1; i <= 5; i++) {
      const levelQs = bank.filter(q => q.cogLevel === i);
      const randomQ = levelQs[Math.floor(Math.random() * levelQs.length)];
      const qClone = JSON.parse(JSON.stringify(randomQ));
      
      if (qClone.type === 'ordering') {
        qClone.displayItems = qClone.items.map((item: string, index: number) => ({ item, originalIndex: index }))
                                   .sort(() => Math.random() - 0.5);
      }
      picked.push(qClone);
    }
    return picked;
  };

  const handleStart = () => {
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
  };

  const checkAnswer = () => {
    const q = questions[currentIndex];
    let isCorrect = false;

    if (q.type === 'mcq') {
      isCorrect = (mcqSelected === q.correct);
    } 
    else if (q.type === 'ordering') {
      isCorrect = orderSelected.every((obj, idx) => obj.originalIndex === q.correctOrder[idx]);
    } 
    else if (q.type === 'fill_blank') {
      isCorrect = fillBlankSelected.every((val, idx) => val === q.correct[idx]);
    }

    if (isCorrect) setScore(prev => prev + 10);
    setIsCorrectCurrent(isCorrect);
    setIsAnswerChecked(true);

    setAnswersLog(prev => [...prev, { id: q.id, isCorrect: isCorrect }]);
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      setGameState('result');
    }
  };

  const handleFinalSubmit = () => {
    if (onGameComplete) {
      onGameComplete({ score, timeInSeconds: timeElapsed, level, answersLog });
    } else {
      window.parent.postMessage({ type: 'FUNLAB_SCORE', score, time: timeElapsed, level, answersLog }, '*');
    }
    setGameState('submitted');
  };

  // --- RENDERS ---

  const renderMCQ = (q: any) => (
    <div className="space-y-3 w-full">
      {q.options.map((opt: string, idx: number) => {
        let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-sm ";
        if (!isAnswerChecked) {
          btnClass += mcqSelected === idx ? "border-cyan-400 bg-cyan-900/30 text-white" : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700";
        } else {
          if (idx === q.correct) btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-300";
          else if (idx === mcqSelected) btnClass += "border-rose-500 bg-rose-900/30 text-rose-300";
          else btnClass += "border-slate-800 opacity-30";
        }
        return <button key={idx} disabled={isAnswerChecked} onClick={() => setMcqSelected(idx)} className={btnClass}>{opt}</button>;
      })}
    </div>
  );

  const renderOrdering = (q: any) => (
    <div className="w-full space-y-5">
      <div className="p-4 rounded-xl border-2 border-dashed border-cyan-800 bg-slate-900/50 min-h-[100px] flex flex-col gap-2">
        <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-1">Quy trình logic:</span>
        {orderSelected.map((obj, idx) => (
          <div key={idx} className="bg-cyan-900 text-white p-3 rounded-lg border border-cyan-500 flex items-center gap-3">
            <span className="bg-cyan-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
            <span className="text-xs">{obj.item}</span>
          </div>
        ))}
        {orderSelected.length === 0 && <p className="text-slate-500 text-xs italic">Chọn các bước để sắp xếp...</p>}
      </div>
      {!isAnswerChecked && (
        <div className="grid gap-2">
          {q.displayItems.map((obj: any, idx: number) => (
            <button key={idx} disabled={orderSelected.includes(obj)} onClick={() => setOrderSelected([...orderSelected, obj])} 
              className={`p-3 text-xs text-left rounded-xl border-2 transition-all ${orderSelected.includes(obj) ? 'opacity-20 border-slate-800 bg-slate-950' : 'border-slate-700 bg-slate-800 hover:border-cyan-500 text-slate-200'}`}>
              {obj.item}
            </button>
          ))}
          <button onClick={() => setOrderSelected([])} className="text-xs text-rose-400 underline mt-2 w-fit">Xếp lại từ đầu</button>
        </div>
      )}
    </div>
  );

  const renderFillBlank = (q: any) => {
    const parts = q.question.split(/\{\d+\}/);
    const fills: (string | null)[] = fillBlankSelected.length > 0 ? fillBlankSelected : Array(q.correct.length).fill(null);
    return (
      <div className="w-full space-y-6">
        <div className="text-base leading-relaxed text-slate-200 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          {parts.map((p: string, i: number) => (
            <React.Fragment key={i}>
              <span>{p}</span>
              {i < q.correct.length && (
                <button onClick={() => !isAnswerChecked && setFillBlankSelected(fills.map((v, idx) => idx === i ? null : v))}
                  className={`inline-block min-w-[80px] border-b-2 mx-1 font-bold transition-all ${fills[i] ? 'text-cyan-400 border-cyan-400' : 'text-slate-600 border-dashed border-slate-700'}`}>
                  {fills[i] || "...."}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        {!isAnswerChecked && (
          <div className="flex flex-wrap gap-2 justify-center">
            {q.options.map((w: string, idx: number) => (
              <button key={idx} disabled={fills.includes(w)} onClick={() => {
                const nextIdx = fills.indexOf(null);
                if (nextIdx !== -1) {
                  const newFills = [...fills];
                  newFills[nextIdx] = w;
                  setFillBlankSelected(newFills);
                }
              }} className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all ${fills.includes(w) ? 'opacity-10 border-slate-800' : 'border-cyan-700 bg-cyan-900/20 text-cyan-300 hover:bg-cyan-800'}`}>
                {w}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 overflow-auto relative font-sans game-safe-bottom">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.08),transparent)] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 flex flex-col flex-1">
        {gameState !== 'welcome' && (
          <div className="flex justify-between items-center mb-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Box className="text-cyan-400" size={24} />
              <div>
                <h2 className="text-xs font-black text-white uppercase tracking-widest">{level} • TẬP 2</h2>
                <div className="text-[10px] text-slate-500 uppercase tracking-tighter italic">⏱️ {timeElapsed}s ELAPSED</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <Award className="text-yellow-500" size={18} />
              <span className="font-black text-lg text-white">{score}/50</span>
            </div>
          </div>
        )}

        {gameState === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-20 h-20 bg-cyan-900/30 border-2 border-cyan-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,211,238,0.15)] animate-pulse">
              <Layers className="text-cyan-400" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">SỨC MẠNH VÔ VÕ</h1>
            <p className="text-cyan-500 text-xs font-black mb-10 tracking-[0.4em] uppercase">Chuyên đề: Áp suất chất rắn</p>
            
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 w-full shadow-2xl relative">
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['THCS', 'THPT'].map(l => (
                  <button key={l} onClick={() => setLevel(l)} className={`p-5 rounded-2xl border-2 transition-all font-black text-lg ${level === l ? 'border-cyan-500 bg-cyan-950 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>{l}</button>
                ))}
              </div>
              <button onClick={handleStart} className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-black text-xl shadow-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2">BẮT ĐẦU NHIỆM VỤ <ArrowRight size={24}/></button>
            </div>
          </div>
        )}

        {gameState === 'playing' && questions.length > 0 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6 flex gap-1.5">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= currentIndex ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'bg-slate-800'}`}></div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded border border-cyan-800 uppercase">Câu {currentIndex + 1}/5</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-8 leading-relaxed">{questions[currentIndex].question}</h3>
            
            <div className="flex-1">
              {questions[currentIndex].type === 'mcq' && renderMCQ(questions[currentIndex])}
              {questions[currentIndex].type === 'ordering' && renderOrdering(questions[currentIndex])}
              {questions[currentIndex].type === 'fill_blank' && renderFillBlank(questions[currentIndex])}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 min-h-[140px]">
              {!isAnswerChecked ? (
                <button 
                  onClick={checkAnswer} 
                  disabled={(questions[currentIndex].type === 'mcq' && mcqSelected === null) || (questions[currentIndex].type === 'ordering' && orderSelected.length < questions[currentIndex].items.length) || (questions[currentIndex].type === 'fill_blank' && (fillBlankSelected.length === 0 || fillBlankSelected.includes(null)))}
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg"
                >
                  XÁC NHẬN PHÂN TÍCH
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${isCorrectCurrent ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-rose-900/20 border-rose-500/50'}`}>
                    <div className="flex items-center gap-2 mb-1 text-xs font-black uppercase tracking-widest">
                        {isCorrectCurrent ? <CheckCircle className="text-emerald-400" size={16}/> : <XCircle className="text-rose-400" size={16}/>}
                        {isCorrectCurrent ? 'CHÍNH XÁC! +10 ĐIỂM' : 'CHƯA CHÍNH XÁC!'}
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed">{questions[currentIndex].explain}</p>
                  </div>
                  <button onClick={handleNext} className="w-full py-4 bg-white text-slate-950 rounded-xl font-black flex justify-center items-center gap-2 hover:bg-slate-200 transition-all uppercase tracking-widest">TIẾP TỤC <ArrowRight size={20}/></button>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <Target size={80} className="text-yellow-500 mb-6 animate-bounce" />
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">KẾT THÚC THỬ THÁCH</h1>
            <p className="text-slate-400 text-sm mb-10">Bạn đã chinh phục thành công bí mật của Áp suất chất rắn!</p>
            
            <div className="grid grid-cols-2 gap-4 w-full mb-10">
                <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
                  <p className="text-4xl font-black text-cyan-400">{score}<span className="text-lg text-slate-600">/50</span></p>
                  <p className="text-slate-500 text-[10px] uppercase font-black mt-1 tracking-widest">Tổng điểm</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
                  <p className="text-4xl font-black text-blue-400">{timeElapsed}<span className="text-lg text-slate-600">s</span></p>
                  <p className="text-slate-500 text-[10px] uppercase font-black mt-1 tracking-widest">Thời gian</p>
                </div>
            </div>
            <button onClick={handleFinalSubmit} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black text-xl shadow-xl transition-all uppercase tracking-widest">LƯU ĐIỂM & CẬP NHẬT BXH</button>
          </div>
        )}

        {gameState === 'submitted' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-in fade-in duration-500">
            <ShieldCheck size={64} className="text-emerald-500 mb-6" />
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">DỮ LIỆU ĐÃ LƯU!</h2>
            <p className="text-slate-400 text-sm">Thành tích của bạn đã được ghi nhận vào hệ thống FunLab.</p>
            <p className="mt-10 text-[10px] text-slate-600 uppercase font-black tracking-widest italic leading-relaxed">Hệ thống đã khóa sau 1 lượt đấu để đảm bảo tính công bằng.</p>
          </div>
        )}
      </div>
    </div>
  );
}
