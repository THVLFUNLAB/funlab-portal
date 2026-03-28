'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Zap, Clock, Award, CheckCircle, XCircle, ArrowRight, Brain, Target, ShieldCheck, Activity, Bomb } from 'lucide-react';

// --- PHẦN 1: DỮ LIỆU CÂU HỎI TẬP 4 ---
const QUESTION_BANK = {
  THCS: [
    [
      { id: 'c1_1', cogLevel: 1, type: 'mcq', question: "Thành phần muối ăn (NaCl) khi cháy sẽ tạo ra ngọn lửa màu gì?", options: ["Xanh lá", "Vàng chói lọi", "Tím nhạt", "Đỏ thẫm"], correct: 1, explain: "Ion Natri (Na+) khi bị kích thích nhiệt sẽ phát ra photon ánh sáng vàng đặc trưng." },
      { id: 'c1_2', cogLevel: 1, type: 'mcq', question: "Chất nào đóng vai trò là 'lá phổi' cung cấp oxy cho pháo hoa?", options: ["Nhiên liệu", "Chất kết dính", "Chất oxy hóa", "Chất tạo màu"], correct: 2, explain: "Chất oxy hóa cung cấp oxy để nhiên liệu bùng cháy trong không gian kín." }
    ],
    [
      { id: 'c2_1', cogLevel: 2, type: 'mcq', question: "Tại sao bùi nhùi thép (steel wool) cháy rực rỡ khi quay tròn?", options: ["Vì làm từ thuốc súng", "Vì diện tích tiếp xúc với oxy tăng cao", "Vì có chứa xăng", "Vì sắt là chất lỏng"], correct: 1, explain: "Sợi sắt mảnh tiếp xúc tối đa với Oxy khi quay tròn tạo phản ứng cháy mạnh." },
      { id: 'c2_2', cogLevel: 2, type: 'mcq', question: "Nhiệt độ pháo sáng khi cháy có thể đạt mức nào?", options: ["100°C", "500°C", "1.100°C", "3.000°C"], correct: 2, explain: "Pháo sáng cháy ở ~1.100°C, đủ làm tan chảy kim loại." }
    ],
    [
      { id: 'c3_1', cogLevel: 3, type: 'mcq', question: "Để tạo pháo hoa màu xanh lá cây, bạn dùng muối nào?", options: ["NaCl", "KCl", "CuSO4", "Than củi"], correct: 2, explain: "Muối Đồng (II) Sulfate phát ra photon màu xanh lá cây khi cháy." },
      { id: 'c3_2', cogLevel: 3, type: 'mcq', question: "Quy tắc an toàn sau khi pháo sáng tắt là gì?", options: ["Thổi cho nguội", "Nhúng vào xô nước", "Cất vào túi", "Trêu đùa bạn"], correct: 1, explain: "Lõi pháo vẫn rất nóng, nhúng nước là cách an toàn nhất." }
    ],
    [
      { id: 'c4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp quá trình tạo màu sắc pháo hoa:", items: ["Ion kim loại hấp thụ nhiệt", "Electron nhảy lên mức cao", "Electron rơi về mức cơ bản", "Giải phóng hạt Photon"], correctOrder: [0, 1, 2, 3] },
      { id: 'c4_2', cogLevel: 4, type: 'ordering', question: "Sắp xếp quy trình tạo pháo hoa hình mặt cười:", items: ["Thiết kế khuôn mẫu", "Sắp xếp 'ngôi sao' hóa chất", "Nhồi thuốc nổ đẩy", "Kích nổ tung các ngôi sao"], correctOrder: [0, 1, 2, 3] }
    ],
    [
      { id: 'c5_1', cogLevel: 5, type: 'fill_blank', question: "Pháo hoa là sự kết hợp giữa {0} (cung cấp oxy) và {1} (thứ bùng cháy).", options: ["chất oxy hóa", "nhiên liệu", "photon", "muối"], correct: ["chất oxy hóa", "nhiên liệu"] },
      { id: 'c5_2', cogLevel: 5, type: 'fill_blank', question: "Ánh sáng màu sắc do các hạt {0} giải phóng từ ion {1}.", options: ["photon", "kim loại", "nhiệt", "electron"], correct: ["photon", "kim loại"] }
    ]
  ],
  THPT: [
    [
      { id: 'p1_1', cogLevel: 1, type: 'mcq', question: "Hạt ánh sáng giải phóng khi electron chuyển mức năng lượng gọi là?", options: ["Electron", "Proton", "Photon", "Neutron"], correct: 2, explain: "Photon là các gói năng lượng ánh sáng." },
      { id: 'p1_2', cogLevel: 1, type: 'mcq', question: "Bước sóng photon CuSO4 so với NaCl như thế nào?", options: ["Ngắn hơn", "Dài hơn", "Bằng nhau", "Cùng tần số"], correct: 0, explain: "Xanh lá có năng lượng cao hơn vàng nên bước sóng ngắn hơn." }
    ],
    [
      { id: 'p2_1', cogLevel: 2, type: 'mcq', question: "Bản chất tạo màu pháo hoa dựa trên hiện tượng gì?", options: ["Phóng xạ", "Chuyển mức năng lượng electron", "Va chạm proton", "Phân hạch"], correct: 1, explain: "Electron nhảy mức và giải phóng photon khi quay về mức cũ." },
      { id: 'p2_2', cogLevel: 2, type: 'mcq', question: "Tại sao KCl tạo ngọn lửa màu tím nhạt?", options: ["Chứa nhiều Oxy", "Cấu trúc mức năng lượng electron đặc trưng", "Cháy chậm", "Phản ứng Nitơ"], correct: 1, explain: "Mỗi nguyên tố có quang phổ vạch riêng biệt." }
    ],
    [
      { id: 'p3_1', cogLevel: 3, type: 'mcq', question: "Trộn CuSO4 và NaCl rồi đốt, màu nào sẽ lấn át?", options: ["Tím", "Vàng", "Xanh lá", "Không cháy"], correct: 1, explain: "Natri có cường độ phát xạ mạnh và mắt người rất nhạy với màu vàng." },
      { id: 'p3_2', cogLevel: 3, question: "Chất oxy hóa trong thuốc nổ đen truyền thống là gì?", options: ["KNO3", "Lưu huỳnh", "Than củi", "CuSO4"], correct: 0, explain: "Kali Nitrat cung cấp oxy dồi dào cho phản ứng." }
    ],
    [
      { id: 'p4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp giai đoạn vụ nổ pháo hoa tầm cao:", items: ["Kích nổ thuốc đẩy", "Ngòi nổ chậm bắt cháy", "Thuốc nổ văng kích nổ tâm", "Các ngôi sao cháy sáng"], correctOrder: [0, 1, 2, 3] },
      { id: 'p4_2', cogLevel: 4, type: 'ordering', question: "Quy trình phân tích quang phổ ngọn lửa:", items: ["Làm sạch que bằng axit", "Nhúng vào muối kim loại", "Đưa vào ngọn lửa đèn", "Quan sát qua kính lọc"], correctOrder: [0, 1, 2, 3] }
    ],
    [
      { id: 'p5_1', cogLevel: 5, type: 'fill_blank', question: "Năng lượng photon tỉ lệ {0} với tần số và tỉ lệ {1} with bước sóng.", options: ["thuận", "nghịch", "cộng", "trừ"], correct: ["thuận", "nghịch"] },
      { id: 'p5_2', cogLevel: 5, type: 'fill_blank', question: "Phản ứng pháo hoa là phản ứng {0} năng lượng dưới dạng {1} và ánh sáng.", options: ["tỏa", "nhiệt", "thu", "hóa năng"], correct: ["tỏa", "nhiệt"] }
    ]
  ]
};

// --- Props interface ---
interface Tap4GameProps {
  onGameComplete?: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
}

// --- PHẦN 2: COMPONENT CHÍNH (APP) ---
export default function Tap4Game({ onGameComplete }: Tap4GameProps) {
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

    if (isCorrect) setScore(prev => prev + 10);
    setIsCorrectCurrent(isCorrect);
    setIsAnswerChecked(true);
    setAnswersLog(prev => [...prev, { qId: q.id, isCorrect }]);
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
    } else {
      window.parent.postMessage({ type: 'FUNLAB_SCORE', score, time: timeElapsed, answersLog }, '*');
    }
    setGameState('submitted');
  };

  // --- RENDERS ---
  const renderMCQ = (q: any) => (
    <div className="space-y-3 w-full">
      {q.options.map((opt: string, idx: number) => {
        let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium ";
        if (!isAnswerChecked) {
          btnClass += mcqSelected === idx ? "border-cyan-400 bg-cyan-900/50 text-white" : "border-slate-800 bg-slate-900 text-slate-400";
        } else {
          if (idx === q.correct) btnClass += "border-emerald-500 bg-emerald-900/50 text-white";
          else if (idx === mcqSelected) btnClass += "border-rose-500 bg-rose-900/50 text-white";
          else btnClass += "border-slate-800 opacity-30";
        }
        return <button key={idx} disabled={isAnswerChecked} onClick={() => setMcqSelected(idx)} className={btnClass}>{opt}</button>;
      })}
    </div>
  );

  const renderOrdering = (q: any) => (
    <div className="w-full space-y-4">
      <div className="p-4 rounded-xl border-2 border-dashed border-cyan-800 bg-slate-900/50 min-h-[100px] flex flex-col gap-2">
        {orderSelected.map((obj, idx) => (
          <div key={idx} className="bg-cyan-900 text-white p-3 rounded-lg border border-cyan-500 flex items-center gap-3">
            <span className="bg-cyan-950 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
            <span className="text-sm">{obj.item}</span>
          </div>
        ))}
        {orderSelected.length === 0 && <p className="text-slate-500 text-sm italic">Sắp xếp các bước bên dưới...</p>}
      </div>
      {!isAnswerChecked && (
        <div className="grid gap-2">
          {q.displayItems.map((obj: any, idx: number) => (
            <button key={idx} disabled={orderSelected.includes(obj)} onClick={() => setOrderSelected([...orderSelected, obj])} 
              className={`p-3 text-sm text-left rounded-xl border-2 transition-all ${orderSelected.includes(obj) ? 'opacity-20 border-slate-800' : 'border-slate-700 bg-slate-800 hover:border-cyan-500'}`}>
              {obj.item}
            </button>
          ))}
          <button onClick={() => setOrderSelected([])} className="text-xs text-rose-400 underline mt-2 w-fit">Xóa xếp lại</button>
        </div>
      )}
    </div>
  );

  const renderFillBlank = (q: any) => {
    const parts = q.question.split(/\{\d+\}/);
    const fills: (string | null)[] = fillBlankSelected.length > 0 ? fillBlankSelected : Array(q.correct.length).fill(null);
    return (
      <div className="w-full space-y-6">
        <div className="text-lg leading-relaxed text-slate-200 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          {parts.map((p: string, i: number) => (
            <React.Fragment key={i}>
              <span>{p}</span>
              {i < q.correct.length && (
                <button onClick={() => !isAnswerChecked && setFillBlankSelected(fills.map((v, idx) => idx === i ? null : v))}
                  className={`inline-block min-w-[100px] border-b-2 mx-2 font-bold ${fills[i] ? 'text-cyan-400 border-cyan-400' : 'text-slate-600 border-dashed border-slate-600'}`}>
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
              }} className={`px-4 py-2 rounded-lg border-2 transition-all ${fills.includes(w) ? 'opacity-20' : 'border-cyan-700 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800'}`}>{w}</button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 overflow-auto relative font-sans game-safe-bottom">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.1),transparent)] pointer-events-none"></div>
      
      <div className="w-full max-w-2xl relative z-10 flex flex-col flex-1">
        {gameState !== 'welcome' && (
          <div className="flex justify-between items-center mb-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Sparkles className="text-cyan-400" />
              <div>
                <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">{level} • {timeElapsed}s</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <Award className="text-yellow-500" size={18} />
              <span className="font-black text-lg">{score}/50</span>
            </div>
          </div>
        )}

        {gameState === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-20 h-20 bg-cyan-900/30 border-2 border-cyan-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Bomb className="text-cyan-400" size={40} />
            </div>
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Vũ Điệu Ánh Sáng</h1>
            <p className="text-cyan-500 text-sm font-bold mb-10 tracking-widest uppercase">Giải mã bí ẩn pháo hoa</p>
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 w-full shadow-2xl">
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['THCS', 'THPT'].map(l => (
                  <button key={l} onClick={() => setLevel(l)} className={`p-4 rounded-2xl border-2 transition-all font-black ${level === l ? 'border-cyan-500 bg-cyan-950 text-white' : 'border-slate-800 text-slate-500'}`}>{l}</button>
                ))}
              </div>
              <button onClick={handleStart} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black text-lg shadow-lg">KHỞI HÀNH</button>
            </div>
          </div>
        )}

        {gameState === 'playing' && questions.length > 0 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6 flex gap-1">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= currentIndex ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
              ))}
            </div>
            <h3 className="text-xl font-bold text-white mb-8">{questions[currentIndex].question}</h3>
            <div className="flex-1">
              {questions[currentIndex].type === 'mcq' && renderMCQ(questions[currentIndex])}
              {questions[currentIndex].type === 'ordering' && renderOrdering(questions[currentIndex])}
              {questions[currentIndex].type === 'fill_blank' && renderFillBlank(questions[currentIndex])}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 min-h-[140px]">
              {!isAnswerChecked ? (
                <button 
                  onClick={checkAnswer} 
                  disabled={
                    (questions[currentIndex].type === 'mcq' && mcqSelected === null) || 
                    (questions[currentIndex].type === 'ordering' && orderSelected.length !== questions[currentIndex].items.length) ||
                    (questions[currentIndex].type === 'fill_blank' && (fillBlankSelected.length === 0 || fillBlankSelected.includes(null)))
                  }
                  className="w-full py-4 bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-black uppercase transition-all"
                >
                  Xác nhận
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${isCorrectCurrent ? 'bg-emerald-900/30 border-emerald-500 text-emerald-100' : 'bg-rose-900/30 border-rose-500 text-rose-100'}`}>
                    <p className="text-sm italic">{questions[currentIndex].explain || "Chính xác!"}</p>
                  </div>
                  <button onClick={handleNext} className="w-full py-4 bg-white text-slate-900 rounded-xl font-black flex justify-center items-center gap-2">TIẾP TỤC <ArrowRight size={20}/></button>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <Award size={64} className="text-yellow-500 mb-6" />
            <h1 className="text-3xl font-black text-white mb-2 uppercase">Lễ Hội Kết Thúc</h1>
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full mb-8 shadow-xl">
              <p className="text-4xl font-black text-cyan-400">{score}<span className="text-lg text-slate-600">/50</span></p>
              <p className="text-slate-500 text-xs uppercase mt-2 font-bold tracking-widest">Tổng điểm đạt được</p>
            </div>
            <button onClick={submitFinal} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black uppercase shadow-lg">Lưu điểm</button>
          </div>
        )}

        {gameState === 'submitted' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <CheckCircle size={64} className="text-emerald-500 mb-6" />
            <h2 className="text-2xl font-black text-white mb-2 uppercase">Dữ liệu đã lưu!</h2>
            <p className="text-slate-400">Thành tích của bạn đã được gửi về FunLab.</p>
            <p className="text-slate-500 text-sm mt-8 italic">Vui lòng đóng cửa sổ này hoặc quay lại trang chủ.</p>
          </div>
        )}
      </div>
    </div>
  );
}
