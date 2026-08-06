'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wind, Thermometer, Trophy, ArrowRight, ShieldCheck, Activity, Zap, Play, Flame, Snowflake, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tap1Props {
  onGameComplete?: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
}

export default function Tap1Suckmanhkhiquyen({ onGameComplete }: Tap1Props) {
  const [gameState, setGameState] = useState<'welcome' | 'simulation' | 'quiz' | 'result' | 'submitted'>('welcome');
  const [level, setLevel] = useState('THCS');
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Timer
  useEffect(() => {
    let timer: any;
    if (gameState === 'simulation' || gameState === 'quiz') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleStart = () => {
    setScore(0);
    setTimeElapsed(0);
    setGameState('simulation');
  };

  // --- SIMULATION STATE ---
  const [bottleTemp, setBottleTemp] = useState(25); // Celsius
  const [bottlePressure, setBottlePressure] = useState(1.0); // atm
  const [eggPlaced, setEggPlaced] = useState(false);
  const [eggInside, setEggInside] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0: chưa làm gì, 1: đang đun nóng, 2: đặt trứng, 3: làm lạnh -> thành công
  
  // Logic mô phỏng
  useEffect(() => {
    if (simStep === 1) {
      // Đun nóng: Nhiệt độ tăng, khí giãn nở và thoát ra ngoài (áp suất vẫn ~1 atm vì hở)
      if (bottleTemp < 80) {
        const t = setTimeout(() => setBottleTemp(prev => prev + 5), 100);
        return () => clearTimeout(t);
      }
    } else if (simStep === 3) {
      // Làm lạnh (có trứng chặn): Nhiệt độ giảm, áp suất giảm vì số lượng phân tử khí đã bị thoát ra trước đó
      if (bottleTemp > 10) {
        const t = setTimeout(() => {
          setBottleTemp(prev => prev - 2);
          setBottlePressure(prev => Math.max(0.6, prev - 0.015)); // Giảm áp suất
        }, 50);
        return () => clearTimeout(t);
      }
    }
  }, [simStep, bottleTemp]);

  useEffect(() => {
    if (bottlePressure <= 0.7 && !eggInside && eggPlaced) {
      // Chênh lệch áp suất đủ lớn -> Hút trứng vào
      setEggInside(true);
      setTimeout(() => {
        setScore(prev => prev + 25); // 25 điểm cho phần thực hành
        setGameState('quiz');
      }, 2500);
    }
  }, [bottlePressure, eggInside, eggPlaced]);

  const handleHeat = () => {
    if (simStep === 0) setSimStep(1);
  };

  const handlePlaceEgg = () => {
    if (simStep === 1 && bottleTemp >= 80) {
      setEggPlaced(true);
      setSimStep(2);
    }
  };

  const handleCool = () => {
    if (simStep === 2 && eggPlaced) {
      setSimStep(3);
    }
  };

  // --- QUIZ STATE ---
  const quizQuestions = [
    { question: "Tại sao quả trứng lại bị hút vào trong chai?", options: ["Do lực hút Trái Đất", "Do áp suất khí quyển bên ngoài lớn hơn áp suất trong chai", "Do quả trứng tự co lại"], correct: 1 },
    { question: "Điều gì xảy ra với không khí trong chai khi bị đun nóng ở bước 1?", options: ["Không khí giãn nở và thoát bớt ra ngoài", "Không khí nặng hơn và chìm xuống", "Không khí biến mất"], correct: 0 },
    { question: "Nếu không đặt quả trứng lên miệng chai mà để chai nguội tự nhiên, áp suất trong chai sẽ:", options: ["Tăng lên rất cao", "Vẫn bằng áp suất khí quyển do không khí tràn lại vào chai", "Giảm xuống tạo thành chân không"], correct: 1 }
  ];
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [answersLog, setAnswersLog] = useState<any[]>([]);

  const checkQuiz = () => {
    if (mcqSelected === quizQuestions[currentQuiz].correct) {
      // 25đ chia cho 3 câu ~ 8đ/câu. Câu cuối 9đ.
      const pts = currentQuiz === 2 ? 9 : 8;
      setScore(prev => prev + pts);
      setAnswersLog(prev => [...prev, { qId: currentQuiz, isCorrect: true }]);
    } else {
      setAnswersLog(prev => [...prev, { qId: currentQuiz, isCorrect: false }]);
    }
    setQuizChecked(true);
  };

  const nextQuiz = () => {
    if (currentQuiz < quizQuestions.length - 1) {
      setCurrentQuiz(prev => prev + 1);
      setMcqSelected(null);
      setQuizChecked(false);
    } else {
      setGameState('result');
    }
  };

  // --- RENDERS ---
  return (
    <div className="w-full h-full bg-slate-950 text-slate-200 flex flex-col items-center p-4 overflow-y-auto relative font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.05),transparent)] pointer-events-none"></div>
      
      <div className="w-full max-w-2xl relative z-10 flex flex-col h-full flex-1">
        {/* HEADER */}
        {gameState !== 'welcome' && (
          <div className="flex justify-between items-center mb-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
                <Wind className="text-cyan-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-black text-cyan-300 uppercase tracking-widest">{level} • TẬP 1</h2>
                <div className="text-[10px] text-slate-500 font-mono">TIME: {timeElapsed}s</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <Award className="text-yellow-500 w-4 h-4" />
              <span className="font-black text-lg">{score}</span>
              <span className="text-[10px] text-slate-500">/ 50</span>
            </div>
          </div>
        )}

        {/* WELCOME */}
        {gameState === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-cyan-900/30 border-2 border-cyan-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-pulse">
              <Zap className="text-cyan-400 w-10 h-10" />
            </div>
            <h1 className="font-black text-3xl md:text-5xl text-white mb-2 uppercase tracking-tighter">SỨC MẠNH KHÍ QUYỂN</h1>
            <p className="text-cyan-500 text-xs font-black mb-10 tracking-[0.4em] uppercase">Phòng thí nghiệm tương tác</p>
            
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Thermometer size={100} /></div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-black">Nhiệm vụ của bạn</label>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Thực hiện thí nghiệm "Trứng chui vào chai" bằng cách thao tác với nhiệt độ để kiểm soát áp suất không khí.
              </p>
              
              <button onClick={handleStart} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-black text-xl py-4 shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest">
                VÀO PHÒNG THÍ NGHIỆM <Play className="w-5 h-5 fill-current"/>
              </button>
            </div>
          </div>
        )}

        {/* SIMULATION */}
        {gameState === 'simulation' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6">Mô Phỏng: Trứng Chui Chai</h2>
            
            {/* Vùng mô phỏng */}
            <div className="relative w-64 h-96 bg-slate-900 border-2 border-slate-800 rounded-3xl flex flex-col items-center justify-end pb-8 overflow-hidden shadow-2xl">
              {/* Particles khí */}
              <AnimatePresence>
                {simStep === 1 && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-40 bg-rose-500/20 blur-2xl animate-pulse rounded-full"></div>
                    <ArrowDown className="w-8 h-8 text-rose-500/50 absolute top-10 rotate-180 animate-bounce" />
                  </motion.div>
                )}
                {simStep === 3 && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-40 bg-cyan-500/20 blur-2xl rounded-full"></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chai thủy tinh */}
              <div className="relative w-32 h-64 border-4 border-white/20 rounded-b-3xl rounded-t-lg border-t-0 flex flex-col items-center z-10 bg-white/5 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]">
                {/* Cổ chai */}
                <div className="absolute -top-12 w-12 h-12 border-4 border-white/20 border-b-0"></div>
                
                {/* Quả trứng */}
                {eggPlaced && (
                  <motion.div 
                    animate={eggInside ? { y: 200, scale: 0.9 } : { y: -65, scale: 1 }}
                    transition={eggInside ? { type: "spring", stiffness: 100, damping: 10 } : { duration: 0.2 }}
                    className="absolute w-14 h-16 bg-amber-100 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2)] z-20 flex items-center justify-center"
                    style={{ left: 'calc(50% - 28px)' }}
                  >
                     <div className="w-2 h-2 rounded-full bg-white/50 absolute top-2 right-3 blur-[1px]"></div>
                  </motion.div>
                )}
                
                {/* Thông số bên trong */}
                <div className="absolute bottom-4 flex flex-col items-center gap-2">
                   <div className="bg-black/50 px-3 py-1 rounded font-mono text-xs text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <Thermometer className="w-3 h-3"/> {Math.round(bottleTemp)}°C
                   </div>
                   <div className="bg-black/50 px-3 py-1 rounded font-mono text-xs text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                      <Activity className="w-3 h-3"/> {bottlePressure.toFixed(2)} atm
                   </div>
                </div>
              </div>
            </div>

            {/* Bảng điều khiển */}
            <div className="w-full mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between gap-2">
              <button 
                onClick={handleHeat} 
                disabled={simStep !== 0}
                className="flex-1 py-3 bg-rose-600/20 text-rose-400 border border-rose-500/50 hover:bg-rose-600/40 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Flame className="w-5 h-5"/>
                <span className="text-[10px] uppercase">1. Đun Nóng</span>
              </button>
              
              <button 
                onClick={handlePlaceEgg} 
                disabled={simStep !== 1 || bottleTemp < 80}
                className="flex-1 py-3 bg-amber-600/20 text-amber-400 border border-amber-500/50 hover:bg-amber-600/40 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Target className="w-5 h-5"/>
                <span className="text-[10px] uppercase">2. Đặt Trứng</span>
              </button>

              <button 
                onClick={handleCool} 
                disabled={simStep !== 2}
                className="flex-1 py-3 bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-600/40 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Snowflake className="w-5 h-5"/>
                <span className="text-[10px] uppercase">3. Làm Lạnh</span>
              </button>
            </div>
            
            <p className="mt-4 text-xs text-slate-500 text-center px-4">
               {simStep === 0 && "Bắt đầu bằng việc đun nóng chai để làm khí giãn nở."}
               {simStep === 1 && bottleTemp < 80 && "Đang đun nóng... Khí đang thoát ra ngoài."}
               {simStep === 1 && bottleTemp >= 80 && "Nhiệt độ đủ cao. Hãy đặt quả trứng lên miệng chai ngay!"}
               {simStep === 2 && "Quả trứng đã bịt kín miệng chai. Bây giờ hãy làm lạnh chai đột ngột."}
               {simStep === 3 && !eggInside && "Áp suất đang giảm. Chờ một chút..."}
               {eggInside && "Tuyệt vời! Áp suất khí quyển đã đẩy trứng vào trong chai."}
            </p>
          </div>
        )}

        {/* QUIZ CÂU HỎI */}
        {gameState === 'quiz' && (
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-sm font-black text-cyan-400 uppercase tracking-widest mb-2">Phân Tích Thí Nghiệm</h2>
            <div className="mb-6 flex gap-1.5">
              {quizQuestions.map((_, idx) => (
                <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= currentQuiz ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-800'}`}></div>
              ))}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-6 leading-relaxed bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-inner">
               {quizQuestions[currentQuiz].question}
            </h3>
            
            <div className="space-y-3 w-full mb-8">
              {quizQuestions[currentQuiz].options.map((opt, idx) => {
                let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-sm ";
                if (!quizChecked) {
                  btnClass += mcqSelected === idx ? "border-cyan-400 bg-cyan-900/50 text-white" : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700";
                } else {
                  if (idx === quizQuestions[currentQuiz].correct) btnClass += "border-emerald-500 bg-emerald-900/50 text-white";
                  else if (idx === mcqSelected) btnClass += "border-rose-500 bg-rose-900/50 text-white";
                  else btnClass += "border-slate-800 opacity-30";
                }
                return (
                  <button 
                    key={idx} 
                    disabled={quizChecked} 
                    onClick={() => setMcqSelected(idx)} 
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {!quizChecked ? (
               <button 
                  onClick={checkQuiz} 
                  disabled={mcqSelected === null}
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg mt-auto"
                >
                  Xác nhận phân tích
                </button>
            ) : (
               <button 
                  onClick={nextQuiz} 
                  className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-slate-200 transition-all uppercase mt-auto"
               >
                  Tiếp tục <ArrowRight size={20}/>
               </button>
            )}
          </div>
        )}

        {/* RESULT */}
        {gameState === 'result' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
                <Trophy size={80} className="text-yellow-500 animate-bounce" />
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">NHIỆM VỤ HOÀN THÀNH</h1>
            <p className="text-slate-400 text-sm mb-8">Bạn đã xuất sắc làm chủ định luật về Áp suất Khí quyển.</p>
            
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

            <button onClick={() => {
               if (onGameComplete) onGameComplete({ score, timeInSeconds: timeElapsed, level, answersLog });
               setGameState('submitted');
            }} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black text-xl shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:scale-105 transition-all uppercase tracking-widest">LƯU ĐIỂM & BÁO CÁO</button>
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
