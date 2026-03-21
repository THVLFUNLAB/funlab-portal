'use client';

import React, { useState, useEffect } from 'react';
import { Wind, Thermometer, Box, Clock, Award, CheckCircle, XCircle, ArrowRight, Brain, Target, ShieldCheck, Activity, Zap, Play } from 'lucide-react';

// --- PHẦN 1: KIẾN TRÚC DỮ LIỆU & NGÂN HÀNG ĐỀ TẬP 1 (ÁP SUẤT KHÍ QUYỂN) ---
const QUESTION_BANK = {
  THCS: [
    // L1: Nhận biết
    [
      { id: 'c1_1', cogLevel: 1, type: 'mcq', question: "Áp suất khí quyển được tạo ra do yếu tố nào sau đây?", options: ["Sức hút của Mặt Trời", "Trọng lượng của lớp không khí bao quanh Trái Đất", "Sự chuyển động của nước biển", "Lực đẩy Ác-si-mét"], correct: 1, explain: "Lớp không khí dày hàng chục km bao quanh Trái Đất có trọng lượng rất lớn, tạo ra áp suất lên bề mặt." },
      { id: 'c1_2', cogLevel: 1, type: 'mcq', question: "Áp suất khí quyển tác dụng lên các vật trên Trái Đất theo hướng nào?", options: ["Chỉ từ trên xuống", "Chỉ theo chiều ngang", "Theo mọi hướng", "Chỉ từ dưới lên"], correct: 2, explain: "Tương tự chất lỏng, chất khí gây ra áp suất theo mọi hướng lên các vật nằm trong nó." }
    ],
    // L2: Thông hiểu
    [
      { id: 'c2_1', cogLevel: 2, type: 'mcq', question: "Tại sao không thể thổi phồng quả bóng bay đặt bên trong một chai nhựa kín (không có lỗ)?", options: ["Vì quả bóng bị thủng", "Vì không khí trong chai đã chiếm không gian và tạo áp suất ngược lại", "Vì không khí trong chai quá lạnh", "Vì chai quá nhỏ"], correct: 1, explain: "Không khí là vật chất, nó chiếm chỗ trong chai. Khi chai kín, không khí không thoát ra được nên ngăn bóng nở ra." },
      { id: 'c2_2', cogLevel: 2, type: 'mcq', question: "Khi đục một lỗ nhỏ ở đáy chai, tại sao việc thổi bóng lại trở nên dễ dàng hơn?", options: ["Vì không khí bên ngoài tràn vào", "Vì không khí trong chai được đẩy ra ngoài qua lỗ, nhường chỗ cho bóng", "Vì chai bị yếu đi", "Vì nhiệt độ chai tăng lên"], correct: 1, explain: "Lỗ nhỏ cho phép không khí thoát ra, làm giảm áp suất cản bên trong chai." }
    ],
    // L3: Vận dụng
    [
      { id: 'c3_1', cogLevel: 3, type: 'mcq', question: "Trong thí nghiệm 'Trứng chui chai', yếu tố nào trực tiếp đẩy quả trứng vào trong chai?", options: ["Lực hút của Trái Đất", "Nhiệt độ của ngọn lửa", "Áp suất khí quyển bên ngoài lớn hơn áp suất trong chai", "Do quả trứng tự co lại"], correct: 2, explain: "Áp suất trong chai giảm thấp sau khi làm lạnh, chênh lệch áp suất với bên ngoài đẩy trứng vào." },
      { id: 'c3_2', cogLevel: 3, type: 'mcq', question: "Để đưa quả trứng đang nằm trong chai ra ngoài mà không làm vỡ chai, ta cần làm gì?", options: ["Hút hết không khí trong chai ra", "Làm lạnh chai thêm nữa", "Thổi hơi vào chai để tăng áp suất bên trong đẩy trứng ra", "Ngâm chai vào nước đá"], correct: 2, explain: "Tăng áp suất bên trong (bằng cách thổi khí hoặc đun nóng) sẽ tạo lực đẩy trứng ra ngoài." }
    ],
    // L4: Sắp xếp (Logic quy trình)
    [
      { id: 'c4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp quy trình thí nghiệm 'Trứng chui chai' tự động:", items: ["Làm nóng không khí trong chai để khí giãn nở thoát bớt ra", "Đặt quả trứng luộc đã bóc vỏ bịt kín miệng chai", "Làm lạnh chai đột ngột khiến khí bên trong co lại", "Áp suất khí quyển đẩy trứng chui vào vùng áp suất thấp"], correctOrder: [0, 1, 2, 3] },
      { id: 'c4_2', cogLevel: 4, type: 'ordering', question: "Sắp xếp quy luật di chuyển của dòng khí:", items: ["Xảy ra sự chênh lệch áp suất giữa hai vùng", "Không khí ở vùng áp suất cao bị nén mạnh", "Dòng khí di chuyển về phía vùng có áp suất thấp", "Trạng thái cân bằng áp suất được thiết lập"], correctOrder: [0, 1, 2, 3] }
    ],
    // L5: Phân tích (Điền khuyết)
    [
      { id: 'c5_1', cogLevel: 5, type: 'fill_blank', question: "Khi nhiệt độ không khí tăng, các phân tử chuyển động mạnh làm khí {0}. Khi nhiệt độ giảm, khí {1} làm áp suất sụt giảm.", options: ["giãn nở", "co lại", "biến mất", "nặng hơn"], correct: ["giãn nở", "co lại"] },
      { id: 'c5_2', cogLevel: 5, type: 'fill_blank', question: "Vật chất luôn có xu hướng di chuyển từ vùng có {0} sang vùng có {1}.", options: ["áp suất cao", "áp suất thấp", "nhiệt độ thấp", "độ cao lớn"], correct: ["áp suất cao", "áp suất thấp"] }
    ]
  ],
  THPT: [
    // L1: Nhận biết
    [
      { id: 'p1_1', cogLevel: 1, type: 'mcq', question: "Dụng cụ chuẩn dùng để đo áp suất khí quyển là gì?", options: ["Nhiệt kế", "Tốc kế", "Phong vũ kế (Barometer)", "Ẩm kế"], correct: 2, explain: "Barometer là thiết bị đo áp suất khí quyển dựa trên cột thủy ngân hoặc cảm biến áp điện." },
      { id: 'p1_2', cogLevel: 1, type: 'mcq', question: "Áp suất khí quyển tiêu chuẩn ở ngang mực nước biển có giá trị khoảng:", options: ["101.325 Pa", "76 Pa", "1.000 Pa", "9.8 Pa"], correct: 0, explain: "Giá trị này tương đương 1 atm hoặc 760 mmHg." }
    ],
    // L2: Thông hiểu
    [
      { id: 'p2_1', cogLevel: 2, type: 'mcq', question: "Tại sao càng lên cao (ví dụ leo núi Everest), áp suất khí quyển lại càng giảm?", options: ["Vì nhiệt độ tăng lên", "Vì lớp không khí bên trên mỏng đi và mật độ khí loãng dần", "Vì trọng lực Trái Đất tăng", "Vì gió thổi mạnh hơn"], correct: 1, explain: "Lên cao, cột không khí đè lên vật ngắn lại và mật độ phân tử khí cũng thưa thớt hơn." },
      { id: 'p2_2', cogLevel: 2, type: 'mcq', question: "Khi chúng ta hít vào, cơ chế áp suất nào diễn ra?", options: ["Cơ hoành hạ xuống làm thể tích tăng -> Áp suất phổi giảm -> Khí tràn vào", "Phổi tự co bóp để hút khí", "Áp suất khí quyển đẩy khí vào tim", "Nhiệt độ cơ thể làm khí nở ra"], correct: 0, explain: "Hô hấp dựa trên sự thay đổi thể tích lồng ngực tạo chênh lệch áp suất với khí quyển." }
    ],
    // L3: Vận dụng
    [
      { id: 'p3_1', cogLevel: 3, type: 'mcq', question: "Một chiếc giác hút cao su dính chặt được trên mặt kính là nhờ:", options: ["Keo dán tàng hình", "Lực ma sát cực lớn", "Chênh lệch áp suất giữa khí quyển bên ngoài và chân không bên trong", "Từ trường của kính"], correct: 2, explain: "Khi ấn giác hút, khí bị đẩy ra tạo chân không. Áp suất khí quyển bên ngoài ép chặt giác hút vào kính." },
      { id: 'p3_2', cogLevel: 3, type: 'mcq', question: "Tại sao khi đi máy bay hoặc thang máy cao tốc, chúng ta thường bị 'ù tai'?", options: ["Do tiếng động cơ quá lớn", "Do áp suất khí quyển thay đổi đột ngột làm màng nhĩ bị đẩy hoặc hút", "Do thiếu oxy lên não", "Do cơ thể mệt mỏi"], correct: 1, explain: "Chênh lệch áp suất giữa tai giữa và môi trường bên ngoài tác động lên màng nhĩ gây ù tai." }
    ],
    // L4: Sắp xếp
    [
      { id: 'p4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp thứ tự các bước trong thí nghiệm của Torricelli đo áp suất khí quyển:", items: ["Đổ đầy thủy ngân vào ống thủy tinh dài 1m", "Úp ngược ống vào một chậu đựng thủy ngân", "Thủy ngân trong ống tụt xuống và dừng lại ở độ cao nhất định", "Đo chiều cao cột thủy ngân để xác định áp suất"], correctOrder: [0, 1, 2, 3] },
      { id: 'p4_2', cogLevel: 4, type: 'ordering', question: "Cơ chế hoạt động của bình xịt khí nén (Spray):", items: ["Bên trong bình chứa chất lỏng và khí dưới áp suất rất cao", "Nhấn van làm thông đường ống với môi trường bên ngoài", "Áp suất cao trong bình đẩy chất lỏng vọt ra vùng áp suất thấp", "Chất lỏng biến thành các hạt bụi mịn do vận tốc lớn"], correctOrder: [0, 1, 2, 3] }
    ],
    // L5: Phân tích
    [
      { id: 'p5_1', cogLevel: 5, type: 'fill_blank', question: "Trong thí nghiệm quả trứng, việc làm lạnh làm {0} động năng phân tử, khiến áp suất {1} so với khí quyển.", options: ["giảm", "thấp hơn", "tăng", "cao hơn"], correct: ["giảm", "thấp hơn"] },
      { id: 'p5_2', cogLevel: 5, type: 'fill_blank', question: "Ống hút nước hoạt động nhờ việc rút khí tạo ra {0} bên trong ống, khiến khí quyển {1} nước đi lên.", options: ["áp suất thấp", "đẩy", "áp suất cao", "hút"], correct: ["áp suất thấp", "đẩy"] }
    ]
  ]
};

interface Tap1Props {
  onGameComplete?: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
}

// --- PHẦN 2: COMPONENT CHÍNH ---
export default function Tap1Suckmanhkhiquyen({ onGameComplete }: Tap1Props) {
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, result, submitted
  const [level, setLevel] = useState('THCS');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Scoring Logic
  const [currentAttempts, setCurrentAttempts] = useState(0); // Số lần trả lời sai câu hiện tại
  const [answersLog, setAnswersLog] = useState<any[]>([]);

  // Question UI States
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [orderSelected, setOrderSelected] = useState<any[]>([]);
  const [fillBlankSelected, setFillBlankSelected] = useState<any[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrectCurrent, setIsCorrectCurrent] = useState(false);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const generateQuestions = (selectedLevel: string) => {
    const bank = (QUESTION_BANK as any)[selectedLevel];
    return bank.map((pair: any[]) => {
      const q = JSON.parse(JSON.stringify(pair[Math.floor(Math.random() * pair.length)]));
      if (q.type === 'ordering') {
        q.displayItems = q.items.map((item: string, index: number) => ({ item, originalIndex: index }))
                                .sort(() => Math.random() - 0.5);
      }
      return q;
    });
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
      // Tính điểm: 10 - (sai * 2), tối thiểu 2 điểm nếu đúng
      const points = Math.max(2, 10 - (currentAttempts * 2));
      setScore(prev => prev + points);
      setIsCorrectCurrent(true);
      setIsAnswerChecked(true);
      setAnswersLog(prev => [...prev, { qId: q.id, isCorrect: true, attempts: currentAttempts + 1 }]);
    } else {
      setIsCorrectCurrent(false);
      setCurrentAttempts(prev => prev + 1);
      // Hiệu ứng báo sai nhưng không khóa để người dùng chọn lại
    }
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      setCurrentIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      setGameState('result');
    }
  };

  const submitFinal = () => {
    if (onGameComplete) {
      onGameComplete({ score, timeInSeconds: timeElapsed, level, answersLog });
    }
    setGameState('submitted');
  };

  // --- RENDERS ---
  const renderMCQ = (q: any) => (
    <div className="space-y-3 w-full">
      {q.options.map((opt: string, idx: number) => {
        let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-sm ";
        if (!isAnswerChecked) {
          btnClass += mcqSelected === idx ? "border-cyan-400 bg-cyan-900/50 text-white" : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700";
        } else {
          if (idx === q.correct) btnClass += "border-emerald-500 bg-emerald-900/50 text-white";
          else if (idx === mcqSelected) btnClass += "border-rose-500 bg-rose-900/50 text-white";
          else btnClass += "border-slate-800 opacity-30";
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

  const renderOrdering = (q: any) => (
    <div className="w-full space-y-4">
      <div className="p-4 rounded-xl border-2 border-dashed border-cyan-800 bg-slate-900/50 min-h-[100px] flex flex-col gap-2">
        <span className="text-[10px] text-cyan-500 font-bold uppercase mb-1">Mô phỏng quy trình:</span>
        {orderSelected.map((obj, idx) => (
          <div key={idx} className="bg-cyan-900 text-white p-3 rounded-lg border border-cyan-500 flex items-center gap-3 animate-in zoom-in duration-200">
            <span className="bg-cyan-950 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-cyan-700">{idx + 1}</span>
            <span className="text-sm">{obj.item}</span>
          </div>
        ))}
      </div>
      {!isAnswerChecked && (
        <div className="grid gap-2">
          {q.displayItems.map((obj: any, idx: number) => (
            <button key={idx} disabled={orderSelected.includes(obj)} onClick={() => setOrderSelected([...orderSelected, obj])} 
              className={`p-3 text-xs text-left rounded-xl border-2 transition-all ${orderSelected.includes(obj) ? 'opacity-20 border-slate-800' : 'border-slate-700 bg-slate-800 hover:border-cyan-500 text-slate-200'}`}>
              {obj.item}
            </button>
          ))}
          <button onClick={() => setOrderSelected([])} className="text-xs text-rose-400 underline mt-2 self-start">Xóa xếp lại</button>
        </div>
      )}
    </div>
  );

  const renderFillBlank = (q: any) => {
    const parts = q.question.split(/{\d+}/);
    const fills = fillBlankSelected.length > 0 ? fillBlankSelected : Array(q.correct.length).fill(null);
    return (
      <div className="w-full space-y-6">
        <div className="text-lg leading-relaxed text-slate-200 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-inner">
          {parts.map((p: string, i: number) => (
            <React.Fragment key={i}>
              {p}
              {i < q.correct.length && (
                <button onClick={() => !isAnswerChecked && setFillBlankSelected(fills.map((v: string | null, idx: number) => idx === i ? null : v))}
                  className={`inline-block min-w-[100px] border-b-2 mx-2 font-bold transition-all ${fills[i] ? 'text-cyan-400 border-cyan-400' : 'text-slate-600 border-dashed border-slate-600'}`}>
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
                const emptyIdx = fills.indexOf(null);
                if (emptyIdx !== -1) {
                  const newFills = [...fills];
                  newFills[emptyIdx] = w;
                  setFillBlankSelected(newFills);
                }
              }} className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all ${fills.includes(w) ? 'opacity-20' : 'border-cyan-700 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800'}`}>{w}</button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-200 flex flex-col items-center p-4 overflow-y-auto relative font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.05),transparent)] pointer-events-none"></div>
      
      <div className="w-full max-w-2xl relative z-10 flex flex-col h-full flex-1">
        {/* HEADER */}
        {gameState !== 'welcome' && (
          <div className="flex justify-between items-center mb-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
                <Wind className="text-cyan-400" size={20} />
              </div>
              <div>
                <h2 className="text-xs font-black text-cyan-300 uppercase tracking-widest">{level} • TẬP 1</h2>
                <div className="text-[10px] text-slate-500 font-mono">TIME: {timeElapsed}s</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <Award className="text-yellow-500" size={18} />
              <span className="font-black text-lg">{score}</span>
              <span className="text-[10px] text-slate-500">/ 50</span>
            </div>
          </div>
        )}

        {/* WELCOME */}
        {gameState === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-cyan-900/30 border-2 border-cyan-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-pulse">
              <Zap className="text-cyan-400" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">SỨC MẠNH KHÍ QUYỂN</h1>
            <p className="text-cyan-500 text-xs font-black mb-10 tracking-[0.4em] uppercase">Hệ thống điều khiển áp suất</p>
            
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Thermometer size={100} /></div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-black">Kích hoạt bảng đấu</label>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['THCS', 'THPT'].map(l => (
                  <button key={l} onClick={() => setLevel(l)} className={`p-5 rounded-2xl border-2 transition-all font-black text-lg ${level === l ? 'border-cyan-500 bg-cyan-950 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>{l}</button>
                ))}
              </div>
              <button onClick={handleStart} className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">BẮT ĐẦU NHIỆM VỤ <Play size={20} fill="currentColor"/></button>
            </div>
          </div>
        )}

        {/* PLAYING */}
        {gameState === 'playing' && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6 flex gap-1.5">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= currentIndex ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-800'}`}></div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded border border-cyan-800 uppercase">Tọa độ {currentIndex + 1}/5</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Level {questions[currentIndex]?.cogLevel}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-8 leading-relaxed">{questions[currentIndex]?.question}</h3>
            
            <div className="flex-1">
              {questions[currentIndex]?.type === 'mcq' && renderMCQ(questions[currentIndex])}
              {questions[currentIndex]?.type === 'ordering' && renderOrdering(questions[currentIndex])}
              {questions[currentIndex]?.type === 'fill_blank' && renderFillBlank(questions[currentIndex])}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 min-h-[140px]">
              {!isAnswerChecked ? (
                <div className="space-y-4">
                  <button 
                    onClick={checkAnswer} 
                    disabled={(questions[currentIndex]?.type === 'mcq' && mcqSelected === null) || (questions[currentIndex]?.type === 'ordering' && orderSelected.length < questions[currentIndex]?.items.length) || (questions[currentIndex]?.type === 'fill_blank' && fillBlankSelected.length === 0)}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg"
                  >
                    Xác nhận phân tích
                  </button>
                  {currentAttempts > 0 && !isCorrectCurrent && (
                    <p className="text-center text-rose-500 text-xs font-bold animate-bounce">Dữ liệu sai lệch! Vui lòng chọn lại (-2đ)</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border ${isCorrectCurrent ? 'bg-emerald-900/30 border-emerald-500' : 'bg-rose-900/30 border-rose-500'}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="text-emerald-400" size={16}/>
                        <span className="text-xs font-bold uppercase text-emerald-400">Hệ thống an toàn!</span>
                    </div>
                    <p className="text-sm text-slate-300 italic">{questions[currentIndex].explain || "Kiến thức về áp suất khí quyển đã được cập nhật."}</p>
                  </div>
                  <button onClick={handleNext} className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-slate-200 transition-all uppercase">Tiếp tục hành trình <ArrowRight size={20}/></button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESULT */}
        {gameState === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
                <Target size={80} className="text-yellow-500 animate-bounce" />
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">NHIỆM VỤ HOÀN THÀNH</h1>
            <p className="text-slate-400 text-sm mb-8">Bạn đã giải mã thành công bí ẩn của sự chiếm chỗ và chênh lệch áp suất.</p>
            
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

            <button onClick={submitFinal} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest">LƯU ĐIỂM & BÁO CÁO</button>
          </div>
        )}

        {/* SUBMITTED */}
        {gameState === 'submitted' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mb-6 border-2 border-emerald-500 shadow-lg">
                <ShieldCheck size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase">DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ!</h2>
            <p className="text-slate-400 text-sm max-w-[300px]">Cảm ơn "Pressure Hero" đã chinh phục tập phim này. Thành tích đã được gửi về Bảng Vàng!</p>
            <p className="mt-10 text-[10px] text-slate-600 uppercase font-black tracking-[0.3em]">Hệ thống tạm khóa - Hẹn gặp lại ở Tập 2</p>
          </div>
        )}
      </div>
    </div>
  );
}
