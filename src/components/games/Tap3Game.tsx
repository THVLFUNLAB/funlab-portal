'use client';

import React, { useState, useEffect } from 'react';
import { Microscope, Beaker, Ruler, Clock, Award, CheckCircle, XCircle, ArrowRight, Brain, Target, ShieldCheck, Activity, FlaskConical, ClipboardCheck } from 'lucide-react';

// --- PHẦN 1: DỮ LIỆU CÂU HỎI TẬP 3 (OLYMPIC KHOA HỌC 2025) ---
const QUESTION_BANK = {
  THCS: [
    // L1: Nhận biết (Sinh học)
    [
      { id: 'c1_1', cogLevel: 1, type: 'mcq', question: "Trong thí nghiệm sự thoát hơi nước, tại sao học sinh phải dùng túi nilon bao quanh lá cây?", options: ["Để giữ ấm cho cây", "Để quan sát hiện tượng đọng nước", "Để bảo vệ lá khỏi sâu bệnh", "Để cây không bị héo"], correct: 1, explain: "Hơi nước thoát qua lá bị đọng lại trong túi giúp ta chứng minh quá trình thoát hơi nước." },
      { id: 'c1_2', cogLevel: 1, type: 'mcq', question: "Dụng cụ nào được các nhóm sử dụng để đo thể tích các vật có hình dạng không xác định?", options: ["Ống đong hoặc bình tràn", "Thước dây", "Cân điện tử", "Đồng hồ bấm giờ"], correct: 0, explain: "Bình tràn hoặc ống đong dùng để đo thể tích nước dâng lên tương ứng với vật thể." }
    ],
    // L2: Thông hiểu (Vật lý)
    [
      { id: 'c2_1', cogLevel: 2, type: 'mcq', question: "Khi thả một khối gỗ nhẹ vào nước, thể tích nước tràn ra đại diện cho điều gì?", options: ["Thể tích toàn phần khối gỗ", "Thể tích phần gỗ bị chìm trong nước", "Khối lượng của khối gỗ", "Khối lượng riêng của nước"], correct: 1, explain: "Theo định luật Ác-si-mét, thể tích nước tràn ra bằng thể tích phần vật chìm trong nước." },
      { id: 'c2_2', cogLevel: 2, type: 'mcq', question: "Tại sao cần giữ các 'biến số không đổi' (control variables) trong khi làm thí nghiệm?", options: ["Để thí nghiệm khó hơn", "Để đảm bảo tính công bằng và chính xác", "Để tiết kiệm hóa chất", "Để báo cáo đẹp hơn"], correct: 1, explain: "Chỉ khi giữ cố định các yếu tố khác, ta mới thấy rõ sự tác động của yếu tố cần nghiên cứu." }
    ],
    // L3: Vận dụng (Hóa học)
    [
      { id: 'c3_1', cogLevel: 3, type: 'mcq', question: "Sự thay đổi màu sắc khi thêm 'Hóa chất C' vào dung dịch trong video chứng tỏ điều gì?", options: ["Dung dịch bị hỏng", "Xảy ra phản ứng hóa học tạo chất mới", "Hóa chất bị pha loãng", "Ánh sáng phòng thí nghiệm thay đổi"], correct: 1, explain: "Biến đổi màu sắc là một dấu hiệu đặc trưng của phản ứng hóa học." },
      { id: 'c3_2', cogLevel: 3, type: 'mcq', question: "Khi quan sát dưa chuột hấp thụ nước, tại sao lát dưa lại trở nên cứng cáp hơn?", options: ["Do dưa bị đông lạnh", "Do nước thẩm thấu vào bên trong tế bào", "Do phản ứng của vỏ dưa", "Do dưa bị chín"], correct: 1, explain: "Sự thẩm thấu giúp tế bào căng nước, làm rau củ trở nên cứng cáp hơn." }
    ],
    // L4: Sắp xếp (Logic thực hành)
    [
      { id: 'c4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp quy trình đo Khối lượng riêng của một mẫu đất khô:", items: ["Cân khối lượng m của mẫu đất", "Đo thể tích V bằng bình tràn", "Tính tỉ số giữa m và V", "Ghi chép và báo cáo kết quả"], correctOrder: [0, 1, 2, 3] },
      { id: 'c4_2', cogLevel: 4, type: 'ordering', question: "Quy trình thực hiện thí nghiệm chứng minh sự thoát hơi nước:", items: ["Chuẩn bị một cây xanh khỏe mạnh", "Dùng túi nilon bọc kín tán lá", "Đặt cây ra ngoài ánh sáng", "Quan sát các giọt nước đọng trong túi"], correctOrder: [0, 1, 2, 3] }
    ],
    // L5: Phân tích (Phương pháp luận)
    [
      { id: 'c5_1', cogLevel: 5, type: 'fill_blank', question: "Để kết quả thí nghiệm chính xác, học sinh cần {0} các biến số không liên quan và chỉ thay đổi duy nhất {1} cần nghiên cứu.", options: ["cố định", "biến số", "loại bỏ", "thời gian"], correct: ["cố định", "biến số"] },
      { id: 'c5_2', cogLevel: 5, type: 'fill_blank', question: "Trong thí nghiệm vận chuyển nước, mạch {0} đóng vai trò dẫn nước từ rễ lên lá, còn mạch {1} dẫn chất hữu cơ.", options: ["gỗ", "rây", "máu", "dẫn"], correct: ["gỗ", "rây"] }
    ]
  ],
  THPT: [
    // L1: Nhận biết (Sinh học nâng cao)
    [
      { id: 'p1_1', cogLevel: 1, type: 'mcq', question: "Động lực nào giúp dòng nước vận chuyển ngược chiều trọng lực từ rễ lên đỉnh những cây cao hàng chục mét?", options: ["Lực hút của mặt trời", "Sự phối hợp giữa lực hút do thoát hơi nước, lực đẩy của rễ và lực liên kết", "Do gió thổi", "Do áp suất khí quyển ép xuống"], correct: 1, explain: "Sự phối hợp 3 lực (Hút - Đẩy - Liên kết) tạo nên dòng mạch gỗ liên tục." },
      { id: 'p1_2', cogLevel: 1, type: 'mcq', question: "Hiện tượng 'khuếch tán' phẩm màu trong nước được giải phóng nhanh hơn khi nào?", options: ["Khi nước lạnh", "Khi nước ở nhiệt độ cao (phân tử chuyển động nhiệt mạnh)", "Khi để trong bóng tối", "Khi thêm muối ăn"], correct: 1, explain: "Nhiệt độ cao làm các phân tử chuyển động nhanh hơn, thúc đẩy quá trình khuếch tán." }
    ],
    // L2: Thông hiểu (Vật lý - Hóa học)
    [
      { id: 'p2_1', cogLevel: 2, type: 'mcq', question: "Bản chất của 'Sức căng bề mặt' cho phép các vật nhẹ có thể nổi trên mặt nước là gì?", options: ["Do lực đẩy Ác-si-mét lớn", "Do các phân tử nước ở bề mặt liên kết chặt chẽ hơn", "Do nước đặc hơn vật", "Do áp suất dưới đáy nước thấp"], correct: 1, explain: "Các liên kết hydro tạo ra một 'lớp màng' đàn hồi trên bề mặt chất lỏng." },
      { id: 'p2_2', cogLevel: 2, type: 'mcq', question: "Trong thí nghiệm xác định khối lượng riêng, sai số hệ thống thường đến từ yếu tố nào?", options: ["Do học sinh quá giỏi", "Do bọt khí bám vào vật khi nhúng vào bình tràn", "Do vật quá nặng", "Do màu sắc của vật"], correct: 1, explain: "Bọt khí chiếm thể tích làm kết quả đo V lớn hơn thực tế, dẫn đến sai số." }
    ],
    // L3: Vận dụng (Tính toán & Thực tế)
    [
      { id: 'p3_1', cogLevel: 3, type: 'mcq', question: "Nếu một mẫu đất có khối lượng 50g và làm nước trong ống đong dâng lên thêm 20ml, khối lượng riêng của mẫu đất là:", options: ["2.5 g/cm³", "0.4 g/cm³", "1000 g/m³", "70 g/cm³"], correct: 0, explain: "Dùng công thức ρ = m/V = 50/20 = 2.5 g/cm³." },
      { id: 'p3_2', cogLevel: 3, type: 'mcq', question: "Để đo thể tích của một vật nhẹ nổi hoàn toàn trên nước (như xốp), ta cần dùng biện pháp gì?", options: ["Thả trực tiếp vào", "Dùng một vật nặng 'chìm' buộc cùng để kéo vật nổi xuống", "Nghiền nát vật", "Cân vật rồi chia cho 10"], correct: 1, explain: "Phương pháp vật chìm giúp xác định chính xác thể tích của vật nổi khi nhúng ngập hoàn toàn." }
    ],
    // L4: Sắp xếp (Quy trình nghiên cứu)
    [
      { id: 'p4_1', cogLevel: 4, type: 'ordering', question: "Sắp xếp 4 bước cơ bản của Phương pháp thực nghiệm khoa học:", items: ["Quan sát và đặt câu hỏi", "Xây dựng giả thuyết", "Tiến hành thí nghiệm kiểm chứng", "Kết luận và công bố kết quả"], correctOrder: [0, 1, 2, 3] },
      { id: 'p4_2', cogLevel: 4, type: 'ordering', question: "Trình tự phân tích một phản ứng hóa học có chất chỉ thị:", items: ["Lấy mẫu dung dịch cần thử", "Thêm từ từ chất chỉ thị màu", "Quan sát sự chuyển màu tại điểm tương đương", "Xác định nồng độ hoặc tính chất mẫu"], correctOrder: [0, 1, 2, 3] }
    ],
    // L5: Phân tích (Tổng hợp kiến thức)
    [
      { id: 'p5_1', cogLevel: 5, type: 'fill_blank', question: "Quá trình {0} ở lá tạo ra lực hút kéo nước lên, đồng thời giúp {1} nhiệt độ bề mặt lá trong những ngày nắng nóng.", options: ["thoát hơi nước", "hạ", "quang hợp", "tăng"], correct: ["thoát hơi nước", "hạ"] },
      { id: 'p5_2', cogLevel: 5, type: 'fill_blank', question: "Khối lượng riêng của một vật là đại diện cho {0} của vật đó trên một đơn vị {1}.", options: ["khối lượng", "thể tích", "trọng lượng", "chiều dài"], correct: ["khối lượng", "thể tích"] }
    ]
  ]
};

// --- Props interface ---
interface Tap3GameProps {
  onGameComplete?: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
}

// --- PHẦN 2: COMPONENT CHÍNH ---
export default function Tap3Game({ onGameComplete }: Tap3GameProps) {
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
      const payload = { score, time: timeElapsed, level, answersLog };
      window.parent.postMessage({ type: 'FUNLAB_SCORE', ...payload }, '*');
    }
    setGameState('submitted');
  };

  // --- RENDERS ---
  const renderMCQ = (q: any) => (
    <div className="space-y-3 w-full">
      {q.options.map((opt: string, idx: number) => {
        let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-sm ";
        if (!isAnswerChecked) {
          btnClass += mcqSelected === idx ? "border-cyan-400 bg-cyan-900/50 text-white" : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600";
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
        <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-1">Thứ tự thực hiện:</p>
        {orderSelected.map((obj, idx) => (
          <div key={idx} className="bg-cyan-900 text-white p-3 rounded-lg border border-cyan-500 flex items-center gap-3">
            <span className="bg-cyan-950 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
            <span className="text-sm">{obj.item}</span>
          </div>
        ))}
        {orderSelected.length === 0 && <p className="text-slate-500 text-sm italic">Chọn các bước bên dưới...</p>}
      </div>
      {!isAnswerChecked && (
        <div className="grid gap-2">
          {q.displayItems.map((obj: any, idx: number) => (
            <button key={idx} disabled={orderSelected.includes(obj)} onClick={() => setOrderSelected([...orderSelected, obj])} 
              className={`p-3 text-xs text-left rounded-xl border-2 ${orderSelected.includes(obj) ? 'opacity-20 border-slate-800' : 'border-slate-700 bg-slate-800 hover:border-cyan-500 text-slate-200'}`}>
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
              }} className={`px-4 py-2 rounded-lg border-2 text-sm ${fills.includes(w) ? 'opacity-20' : 'border-cyan-700 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800'}`}>{w}</button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 overflow-auto relative font-sans game-safe-bottom">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.05),transparent)] pointer-events-none"></div>
      
      <div className="w-full max-w-2xl relative z-10 flex flex-col flex-1">
        {gameState !== 'welcome' && (
          <div className="flex justify-between items-center mb-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <FlaskConical className="text-cyan-400" size={24} />
              <div>
                <h2 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">{level} • {timeElapsed}s</h2>
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
            <div className="w-20 h-20 bg-cyan-900/30 border-2 border-cyan-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Microscope className="text-cyan-400" size={40} />
            </div>
            {/* [FIX 3] game-main-title: không bị cắt trên mobile */}
            <h1 className="game-main-title font-black text-white mb-2 uppercase tracking-tighter">OLYMPIC KHOA HỌC</h1>
            <p className="text-cyan-500 text-sm font-bold mb-6 md:mb-10 tracking-[0.3em] uppercase">Vòng 2: Kỹ năng Thực nghiệm</p>
            
            {/* [FIX 1] game-welcome-card + bottom-sheet-container: padding co lại trên mobile */}
            <div className="game-welcome-card bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 w-full shadow-2xl relative overflow-hidden bottom-sheet-container">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Beaker size={80} /></div>
              {/* [FIX 1] level-selector-grid: không dính đáy màn hình */}
              <div className="level-selector-grid mb-6 md:mb-8">
                {['THCS', 'THPT'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`level-btn ${level === l ? 'border-cyan-500 bg-cyan-950 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-slate-800 text-slate-500'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {/* [FIX 4] game-start-btn */}
              <button onClick={handleStart} className="game-start-btn w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-black text-xl shadow-xl transition-all">BẮT ĐẦU THI ĐẤU</button>
            </div>
          </div>
        )}

        {gameState === 'playing' && questions.length > 0 && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6 flex gap-1.5">
              {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= currentIndex ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded border border-cyan-800 uppercase tracking-tighter">Câu {currentIndex + 1}/5</span>
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
                  disabled={
                    (questions[currentIndex].type === 'mcq' && mcqSelected === null) || 
                    (questions[currentIndex].type === 'ordering' && orderSelected.length < questions[currentIndex].items.length) || 
                    (questions[currentIndex].type === 'fill_blank' && (fillBlankSelected.length === 0 || fillBlankSelected.includes(null)))
                  }
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl font-black uppercase tracking-widest transition-all"
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${isCorrectCurrent ? 'bg-emerald-900/30 border-emerald-500' : 'bg-rose-900/30 border-rose-500'}`}>
                    <p className="text-sm text-slate-300 italic">{questions[currentIndex].explain || "Chính xác!"}</p>
                  </div>
                  <button onClick={handleNext} className="w-full py-4 bg-white text-slate-950 rounded-xl font-black flex justify-center items-center gap-2 hover:bg-slate-200 transition-all">TIẾP TỤC <ArrowRight size={20}/></button>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <Award size={80} className="text-yellow-500 mb-6" />
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">KẾT THÚC VÒNG THI</h1>
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                  <p className="text-3xl font-black text-cyan-400">{score}/50</p>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-widest">Tổng điểm</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                  <p className="text-3xl font-black text-blue-400">{timeElapsed}s</p>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-widest">Thời gian</p>
                </div>
            </div>
            <button onClick={submitFinal} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-black text-xl shadow-xl transition-all">LƯU ĐIỂM & HOÀN TẤT</button>
          </div>
        )}

        {gameState === 'submitted' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <CheckCircle size={64} className="text-emerald-500 mb-6" />
            <h2 className="text-2xl font-black text-white mb-2 uppercase">BÁO CÁO ĐÃ GỬI!</h2>
            <p className="text-slate-400">Thành tích của bạn đã được ghi nhận.</p>
            <p className="text-slate-500 text-sm mt-8 italic">Phòng thí nghiệm Olympic 2025 cảm ơn sự nỗ lực của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
}
