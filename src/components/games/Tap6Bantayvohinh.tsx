'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { 
  Anchor, Award, ShieldCheck, Droplets, Compass, Crosshair, 
  CheckCircle, AlertTriangle, Lock 
} from 'lucide-react';

// --- NGÂN HÀNG CÂU HỎI ---
const QUESTION_DB: Record<string, any[][]> = {
  THCS: [
    [
      { type: 'mcq', question: "Tác nhân chính nào đã bóp nát chiếc vỏ lon nhôm trong thí nghiệm của An?", options: ["Lực đẩy của nước", "Áp suất khí quyển khổng lồ từ bên ngoài", "Sự co rút của kim loại do lạnh", "Lực hút của Trái Đất"], correct: 1 },
      { type: 'mcq', question: "Trong không gian, điều gì đang đè nặng lên chúng ta tạo ra 'Bàn tay tàng hình'?", options: ["Trọng lượng của lớp không khí bao quanh Trái Đất", "Nhiệt độ của Mặt Trời", "Từ trường của Trái Đất", "Lực ma sát của gió"], correct: 0 }
    ],
    [
      { type: 'mcq', question: "Việc đun sôi một ít nước bên trong vỏ lon có tác dụng vật lý gì?", options: ["Làm mềm vỏ nhôm", "Tạo ra phản ứng hóa học", "Hơi nước bốc lên đẩy không khí bên trong ra ngoài", "Làm sạch vi khuẩn trong lon"], correct: 2 },
      { type: 'mcq', question: "Hơi nước bốc lên ngùn ngụt từ miệng lon trước khi lật úp chứng tỏ điều gì?", options: ["Nước sắp cạn hết", "Không khí trong lon đã bị đẩy ra gần hết, lon ngập hơi nước", "Lon nhôm sắp bị nổ", "Nhiệt độ đã đạt 1000 độ C"], correct: 1 }
    ],
    [
      { type: 'mcq', question: "Điều gì xảy ra NGAY LẬP TỨC với hơi nước bên trong lon khi bị úp vào chậu nước đá?", options: ["Nở ra mạnh hơn", "Bốc cháy", "Ngưng tụ lại thành nước lỏng", "Hòa tan vào nhôm"], correct: 2 },
      { type: 'mcq', question: "Vì sao áp suất bên trong vỏ lon lại giảm đột ngột (tạo môi trường chân không)?", options: ["Vì hơi nước ngưng tụ làm giảm thể tích khí bên trong rất mạnh", "Vì nước đá hút hết không khí", "Vì vỏ lon đóng kín lại", "Vì nhiệt độ làm kim loại co lại"], correct: 0 }
    ],
    [
      { type: 'order', question: "Hãy sắp xếp ĐÚNG quy trình dẫn đến hiện tượng bóp nát vỏ lon:", items: ["Đun sôi nước để hơi nước đẩy không khí ra", "Úp ngược nhanh vỏ lon vào nước đá lạnh", "Hơi nước ngưng tụ làm giảm áp suất bên trong", "Áp suất khí quyển bên ngoài ép bẹp vỏ lon"] },
      { type: 'order', question: "Sắp xếp diễn biến Vật lý giải thích sự biến dạng của lon:", items: ["Nhiệt độ giảm đột ngột do nước đá", "Khí chuyển từ trạng thái hơi sang lỏng", "Chênh lệch áp suất trong và ngoài lon tăng cao", "Lực ép bên ngoài phá vỡ cấu trúc vỏ lon"] }
    ],
    [
      { type: 'mcq', question: "Tại sao cơ thể con người không bị bẹp rúm dưới áp suất khí quyển như vỏ lon?", options: ["Vì da người dai hơn nhôm", "Vì áp suất chất lỏng và khí bên trong cơ thể cân bằng với bên ngoài", "Vì con người di chuyển liên tục", "Vì không khí không tác dụng lực lên sinh vật"], correct: 1 },
      { type: 'mcq', question: "Hoạt động nào sau đây CÙNG NGUYÊN LÝ chênh lệch áp suất với thí nghiệm bóp nát vỏ lon?", options: ["Thổi bong bóng xà phòng", "Dùng ống hút để hút ly trà sữa", "Ném quả bóng rổ", "Đun nước bằng ấm điện"], correct: 1 }
    ]
  ],
  THPT: [
    [
      { type: 'mcq', question: "Trong quá trình đun sôi nước ở miệng lon mở, trạng thái khí bên trong lon ngay trước khi úp là gì?", options: ["Khí lý tưởng hoàn toàn", "Hỗn hợp chủ yếu là hơi nước bão hòa, đã đẩy không khí ra ngoài", "Chân không tuyệt đối", "Khí Oxy tinh khiết"], correct: 1 },
      { type: 'mcq', question: "Nguyên nhân CỐT LÕI tạo ra sự sụt giảm áp suất (hiệu ứng chân không) trong lon là hiện tượng nào?", options: ["Sự giãn nở đẳng áp", "Sự ngưng tụ đột ngột của hơi nước khi gặp lạnh", "Sự đông đặc của nước", "Quá trình đoạn nhiệt"], correct: 1 }
    ],
    [
      { type: 'mcq', question: "Nếu thay vỏ lon nhôm mỏng bằng một chai thủy tinh dày, hiện tượng gì sẽ xảy ra khi úp vào nước lạnh?", options: ["Chai bị bẹp rúm như lon nhôm", "Chai không bị bẹp nhưng có nguy cơ nứt vỡ do sốc nhiệt", "Không có hiện tượng gì", "Nước trong chậu sẽ sôi lên"], correct: 1 },
      { type: 'mcq', question: "Nếu không đun nước mà CHỈ đun nóng không khí trong chiếc lon khô, vỏ lon có bị nổ bẹp khi úp không?", options: ["Có, bẹp dữ dội hơn", "Không bẹp rúm, vì không khí chỉ co lại một phần, không ngưng tụ sụt áp suất mạnh như hơi nước", "Chỉ móp nhẹ ở đáy", "Bị nổ tung ra ngoài"], correct: 1 }
    ],
    [
      { type: 'mcq', question: "Theo phương trình khí lý tưởng (pV=nRT), khi úp lon vào nước lạnh, yếu tố nào bên vế phải giảm mạnh nhất gây sụt áp suất?", options: ["Hằng số R", "Nhiệt độ T", "Số lượng hạt khí (n) giảm mạnh do ngưng tụ thành chất lỏng", "Thể tích V"], correct: 2 },
      { type: 'mcq', question: "Giả sử áp suất khí quyển là 1 atm (khoảng 100.000 Pa). Khi bên trong lon là chân không, lực ép lên 1 mét vuông vỏ lon tương đương với sức nặng của vật bao nhiêu kg?", options: ["100 kg", "1.000 kg", "10.000 kg", "100.000 kg"], correct: 2 }
    ],
    [
      { type: 'order', question: "Sắp xếp cơ chế hiện tượng Nổ nén (Implosion) của tàu ngầm dưới biển sâu:", items: ["Lặn càng sâu, áp suất thủy tĩnh càng tăng cao", "Vỏ tàu chịu ứng suất nén vượt giới hạn vật liệu", "Xuất hiện các vi chấn và nứt vỡ siêu nhỏ", "Nước tràn vào ép nát khoang tàu chớp nhoáng"] },
      { type: 'order', question: "Sắp xếp chu trình biến đổi nhiệt động lực học trong vỏ lon:", items: ["Tăng nhiệt độ gây giãn nở đẳng áp", "Đuổi khối khí ban đầu ra khỏi hệ kín", "Giảm nhiệt độ làm ngưng tụ chất khí", "Áp suất sụt giảm kéo theo biến dạng thể tích"] }
    ],
    [
      { type: 'mcq', question: "Trong y tế cổ truyền, phương pháp 'giác hơi' hoạt động dựa trên nguyên lý tương tự nào?", options: ["Đốt nóng ống rồi úp lên da -> Khí nguội đi co lại làm giảm áp suất -> Hút da lên", "Truyền nhiệt trực tiếp vào mạch máu", "Dùng hóa chất làm teo da", "Tạo ra môi trường cao áp đè lên da"], correct: 0 },
      { type: 'mcq', question: "Tàu ngầm lặn thám hiểm Titanic bị ép nát dưới đáy đại dương là minh chứng cho sức mạnh của:", options: ["Sóng thần ngầm", "Áp suất thủy tĩnh cực lớn phá vỡ giới hạn chịu đựng của vật liệu", "Lực hút từ trường dưới đáy biển", "Lực Ác-si-mét ép xuống"], correct: 1 }
    ]
  ]
};

// Kiểu dữ liệu
type OrderItem = { val: string; originalIdx: number };
type SelectedOrder = { displayIdx: number; text: string };

// Props interface – nhận hàm onComplete từ Game Mapper (episode/[id]/page.tsx)
interface Tap6Props {
  onGameComplete?: (payload: { score: number; timeInSeconds: number; level: string; answersLog: any[] }) => void;
}

export default function Tap6Bantayvohinh({ onGameComplete }: Tap6Props) {
  const supabase = createClient();

  // Route State
  const [screen, setScreen] = useState<'welcome' | 'playing' | 'success'>('welcome');
  
  // Player Data (chỉ lấy tên/lớp để hiển thị giao diện, không cần userId vì điểm được xử lý bởi parent)
  const [selectedLevel, setSelectedLevel] = useState<'THCS' | 'THPT' | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerClass, setPlayerClass] = useState('');

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
      setSelectedLevel(allowedLevel);
    }
  }, [allowedLevel]);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, class_name').eq('id', user.id).single();
        if (profile) {
          setPlayerName(profile.full_name || 'Học giả Ẩn danh');
          setPlayerClass(profile.class_name || 'Khách');
        }
      }
    }
    loadUser();
  }, [supabase]);
  
  // Game State
  const [activeTest, setActiveTest] = useState<any[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answersLog, setAnswersLog] = useState<any[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (screen === 'playing') {
      timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [screen]);
  
  // Order Question State
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderSelection, setOrderSelection] = useState<SelectedOrder[]>([]);
  
  // UI Feedbacks
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [isSuccessShake, setIsSuccessShake] = useState(false);
  const [isErrorShake, setIsErrorShake] = useState(false);

  // Khởi động Game
  const startMission = () => {
    if (!selectedLevel) {
      alert("Vui lòng chọn Cấp độ lặn!");
      return;
    }

    const levelBank = QUESTION_DB[selectedLevel];
    const test = levelBank.map(pair => pair[Math.floor(Math.random() * pair.length)]);
    
    setActiveTest(test);
    setCurrentStage(0);
    setScore(0);
    setTimeElapsed(0);
    setAnswersLog([]);
    setScreen('playing');
    loadStage(test[0]);
  };

  const loadStage = (questionData: any) => {
    setAttempts(0);
    if (questionData.type === 'order') {
      const shuffled = questionData.items
        .map((val: string, idx: number) => ({ val, originalIdx: idx }))
        .sort(() => Math.random() - 0.5);
      setOrderItems(shuffled);
      setOrderSelection([]);
    }
  };

  // Trả lời MCQ
  const handleMCQAnswer = (selectedIndex: number) => {
    const data = activeTest[currentStage];
    if (selectedIndex === data.correct) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  // Trả lời Sắp xếp
  const selectOrderItem = (displayIdx: number, text: string) => {
    if (orderSelection.some(sel => sel.displayIdx === displayIdx)) return;
    setOrderSelection([...orderSelection, { displayIdx, text }]);
  };

  const submitOrder = () => {
    const data = activeTest[currentStage];
    if (orderSelection.length !== data.items.length) {
      alert("Vui lòng sắp xếp đầy đủ các bước trước khi Phân tích!");
      return;
    }

    let isCorrect = true;
    for (let i = 0; i < orderSelection.length; i++) {
      const selectedItemObj = orderItems[orderSelection[i].displayIdx];
      if (selectedItemObj.originalIdx !== i) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  // Helpers
  const handleCorrectAnswer = () => {
    const points = Math.max(0, 10 - attempts * 2);
    setScore(prev => prev + points);
    
    const newLog = {
      question: activeTest[currentStage]?.question,
      isCorrect: true,
      attempts: attempts + 1
    };
    const updatedAnswersLog = [...answersLog, newLog];
    setAnswersLog(updatedAnswersLog);

    setIsSuccessShake(true);
    setTimeout(() => {
      setIsSuccessShake(false);
      if (currentStage + 1 >= activeTest.length) {
        triggerVictory(score + points, updatedAnswersLog);
      } else {
        const nextStage = currentStage + 1;
        setCurrentStage(nextStage);
        loadStage(activeTest[nextStage]);
      }
    }, 500);
  };

  const handleWrongAnswer = () => {
    setAttempts(prev => prev + 1);
    setShowErrorToast(true);
    setIsErrorShake(true);
    setTimeout(() => setIsErrorShake(false), 500);
  };

  const resetOrder = () => {
    setOrderSelection([]);
  };

  const triggerVictory = (finalScore: number, finalAnswersLog: any[]) => {
    setScreen('success');
    // Gọi callback từ Game Mapper – parent (episode/[id]/page.tsx) chịu trách nhiệm ghi Supabase
    if (onGameComplete) {
      onGameComplete({
        score: finalScore,
        timeInSeconds: timeElapsed,
        level: selectedLevel || 'THCS',
        answersLog: finalAnswersLog
      });
    }
  };

  const customStyles = `
    .bg-ocean { background: radial-gradient(circle at center, #0f172a 0%, #050b14 100%); }
    .glass-panel {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(8, 145, 178, 0.3);
      box-shadow: 0 0 20px rgba(8, 145, 178, 0.15);
    }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #0891b2; border-radius: 10px; }
  `;

  // Animation Variants cho màn hình
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  const currentQ = activeTest[currentStage];

  return (
    <div className="w-full h-full min-h-[500px] max-h-[1000px] overflow-hidden bg-ocean text-white relative flex flex-col items-center justify-center font-sans select-none">
      <style>{customStyles}</style>

      {/* Lưới định vị background */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#0891b2 1px, transparent 1px), linear-gradient(90deg, #0891b2 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className={`relative z-10 w-full max-w-3xl h-full flex flex-col p-4 sm:p-6 transition-all duration-500 ${isSuccessShake ? 'bg-emerald-900/30' : ''}`}>
        
        {/* HEADER */}
        {screen !== 'welcome' && screen !== 'success' && (
          <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex justify-between items-center mb-6 glass-panel p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <Anchor className="text-cyan-400 w-5 h-5" />
              <div>
                <h1 className="font-black text-cyan-400 text-sm uppercase tracking-widest leading-none mb-1">FunLab Tập 6</h1>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider">THUYỀN TRƯỞNG {playerName.toUpperCase()} • {playerClass.toUpperCase()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-yellow-900/50 rounded-full border border-yellow-500/30 text-xs font-bold text-yellow-300 flex items-center gap-1">
                <Award className="w-4 h-4" /> Điểm: <span>{score}</span>
              </div>
              <div className="px-3 py-1 bg-cyan-900/50 rounded-full border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Vỏ Tàu: 100%
              </div>
            </div>
          </motion.header>
        )}

        <main className="flex-1 flex flex-col justify-center items-center relative w-full h-full">
          <AnimatePresence mode="wait">
            
            {/* SCREEN 0: WELCOME */}
            {screen === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="w-full glass-panel rounded-[2rem] p-6 sm:p-10 max-w-md mx-auto shadow-[0_0_30px_rgba(8,145,178,0.2)]"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-[0_0_30px_rgba(8,145,178,0.4)]">
                    <Anchor className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-1">CHIẾN DỊCH TÀU NGẦM</h2>
                  <p className="text-cyan-500 uppercase tracking-widest text-xs font-black drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">Sức Mạnh Vô Hình</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  {/* Hồ sơ định danh tự động */}
                  <div className="flex flex-col bg-cyan-950/40 border border-cyan-800/50 p-4 rounded-xl shadow-inner relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full pointer-events-none"></div>
                     <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Hồ sơ định danh hợp lệ
                     </span>
                     <div className="flex justify-between items-end mt-1">
                        <div>
                          <p className="text-white font-black text-lg tracking-wide drop-shadow-md">{playerName}</p>
                          <p className="text-cyan-500 text-xs font-mono uppercase tracking-widest">{playerClass}</p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Xác Thực Cấp Độ Lặn Kĩ Thuật Thuỷ Tĩnh</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => allowedLevel === 'THCS' && setSelectedLevel('THCS')} 
                      className={`p-4 rounded-xl border transition-all text-left group relative overflow-hidden 
                      ${allowedLevel !== 'THCS' && allowedLevel !== null ? 'opacity-40 grayscale cursor-not-allowed pointer-events-none' : 
                      selectedLevel === 'THCS' ? 'border-cyan-400 bg-cyan-900/40 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-white/10 bg-black/30 hover:bg-cyan-900/20'}`}
                    >
                      {allowedLevel !== 'THCS' && allowedLevel !== null && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-950/80 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                          <Lock className="w-3 h-3 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,1)]" />
                        </div>
                      )}
                      <span className={`block font-black transition-colors ${selectedLevel === 'THCS' ? 'text-cyan-300' : 'text-cyan-100 group-hover:text-cyan-300'}`}>THCS</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Vùng nước nông</span>
                    </button>
                    
                    <button 
                      onClick={() => allowedLevel === 'THPT' && setSelectedLevel('THPT')} 
                      className={`p-4 rounded-xl border transition-all text-left group relative overflow-hidden 
                      ${allowedLevel !== 'THPT' && allowedLevel !== null ? 'opacity-40 grayscale cursor-not-allowed pointer-events-none' : 
                      selectedLevel === 'THPT' ? 'border-blue-400 bg-blue-900/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 bg-black/30 hover:bg-blue-900/20'}`}
                    >
                      {allowedLevel !== 'THPT' && allowedLevel !== null && (
                        <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-950/80 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                          <Lock className="w-3 h-3 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,1)]" />
                        </div>
                      )}
                      <span className={`block font-black transition-colors ${selectedLevel === 'THPT' ? 'text-blue-300' : 'text-blue-100 group-hover:text-blue-300'}`}>THPT</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Vực sâu Mariana</span>
                    </button>
                  </div>
                </div>

                {/* [FIX 4] game-start-btn: touch target >= 44px, pb-safe-lg: safe area đáy */}
                <button onClick={startMission} className="game-start-btn w-full mt-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black tracking-widest transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] active:scale-95 flex items-center justify-center gap-2 group pb-safe">
                  KHỞI HÀNH <Droplets className="w-5 h-5 group-hover:animate-bounce" />
                </button>
              </motion.div>
            )}

            {/* SCREEN 1: PLAYING */}
            {screen === 'playing' && currentQ && (
              <motion.div 
                key={`question-${currentStage}`}
                variants={containerVariants} initial="hidden" exit="exit"
                className={`w-full h-full flex flex-col justify-center ${isErrorShake ? 'ml-[-10px]' : ''}`}
                animate={isErrorShake ? { x: [-10, 10, -10, 10, 0], opacity: 1 } : "visible"}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4 flex justify-between items-end">
                  <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-1"><Compass className="w-4 h-4" /> Tọa độ áp suất</span>
                  <span className="text-xs font-black bg-cyan-900/60 px-3 py-1 rounded border border-cyan-700 text-cyan-300 shadow-[0_0_10px_rgba(8,145,178,0.3)]">{currentStage + 1}/5</span>
                </div>
                
                <div className="glass-panel p-6 sm:p-8 rounded-3xl w-full">
                  <h3 className="text-lg sm:text-xl font-bold mb-6 leading-relaxed text-white">
                    {currentQ.question}
                  </h3>
                  
                  {/* Trắc nghiệm */}
                  {currentQ.type === 'mcq' && (
                    <div className="flex flex-col gap-3">
                      {currentQ.options.map((opt: string, index: number) => (
                        <button key={index} onClick={() => handleMCQAnswer(index)} className="w-full text-left p-4 sm:p-5 bg-black/40 border border-white/10 rounded-2xl hover:bg-cyan-900/40 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(8,145,178,0.3)] transition-all font-medium text-sm sm:text-base flex items-center justify-between group shadow-sm">
                          <span className="pr-4 leading-snug">{opt}</span> 
                          <Crosshair className="w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sắp xếp */}
                  {currentQ.type === 'order' && (
                    <div className="flex flex-col gap-3">
                      <AnimatePresence>
                        {orderSelection.length > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-cyan-950/40 rounded-xl border border-cyan-800/50 min-h-[80px] mb-2 flex flex-wrap gap-2">
                            {orderSelection.map((sel, idx) => (
                              <motion.div key={idx} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-cyan-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center shadow-md w-full sm:w-auto">
                                <span className="mr-2 bg-cyan-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] flex-shrink-0">{idx + 1}</span> 
                                <span className="truncate">{sel.text}</span>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {orderSelection.length === 0 && <p className="text-xs text-cyan-400 mb-2 italic drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]">* Click theo đúng quy trình Vật lý của hiện tượng:</p>}
                      
                      <div className="grid grid-cols-1 gap-2">
                        {orderItems.map((item, displayIdx) => !orderSelection.some(s => s.displayIdx === displayIdx) && (
                          <motion.button key={displayIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => selectOrderItem(displayIdx, item.val)} className="w-full text-left p-4 bg-black/40 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all font-medium text-sm flex items-center shadow-sm">
                            {item.val}
                          </motion.button>
                        ))}
                      </div>

                      {orderSelection.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-4">
                          <button onClick={resetOrder} className="px-4 py-3 bg-slate-800/80 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm font-bold border border-slate-700 hover:border-slate-500">Làm lại</button>
                          <button onClick={submitOrder} className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-xl hover:from-cyan-500 hover:to-cyan-400 font-bold text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] transition-all">Phân tích dữ liệu</button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: SUCCESS */}
            {screen === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-full glass-panel rounded-3xl p-8 text-center max-w-md mx-auto relative overflow-hidden"
              >
                {/* Light Confetti Effect using React Framer Motion CSS */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ top: '-10%', left: `${Math.random() * 100}%`, rotate: 0 }}
                      animate={{ top: '110%', left: `${Math.random() * 100}%`, rotate: 360 }}
                      transition={{ duration: 3 + Math.random() * 2, ease: "linear", repeat: Infinity, delay: Math.random() * 2 }}
                      className={`absolute w-3 h-3 ${['bg-cyan-400', 'bg-blue-500', 'bg-emerald-400'][Math.floor(Math.random()*3)]}`}
                      style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                    />
                  ))}
                </div>

                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)] relative z-10">
                  <CheckCircle className="w-12 h-12 text-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black mb-2 text-emerald-400 uppercase tracking-wide drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10 relative">Tuyệt vời!</h2>
                <p className="text-cyan-100 mb-6 font-medium z-10 relative">Bạn đã nhận được <span className="text-yellow-400 font-black text-lg drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">{score} ĐIỂM</span> vào Bảng Vàng!</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 z-10 relative">
                  Hệ thống áp suất đã cân bằng an toàn. Tàu ngầm đã vượt qua mọi thử thách nhờ tư duy Vật lý sắc bén của bạn!
                </p>
                <button onClick={() => window.location.reload()} className="w-full py-4 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/40 hover:text-cyan-300 rounded-xl font-bold transition-all z-10 relative hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  THỰC HIỆN LẠI NHIỆM VỤ
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* THÔNG BÁO LỖI (TOAST MODAL) */}
      <AnimatePresence>
        {showErrorToast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-40%', x: '-50%' }}
            className="absolute top-1/2 left-1/2 bg-slate-900 border border-rose-500/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(225,29,72,0.6)] z-50 text-center w-[90%] max-w-sm"
          >
            <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-[bounce_1s_infinite]" />
            <h3 className="text-xl font-black text-rose-400 mb-2 tracking-wide uppercase drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]">Cảnh Báo Vỏ Tàu!</h3>
            <p className="text-slate-300 text-sm mb-8 leading-relaxed">Phân tích chưa chính xác khiến áp suất tăng cao. Đừng lo, khoang an toàn đã kích hoạt. Hãy bình tĩnh tư duy lại nhé!</p>
            <button 
              onClick={() => {
                setShowErrorToast(false);
                if(currentQ?.type === 'order') resetOrder();
              }} 
              className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black rounded-xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)]"
            >
              PHỤC HỒI & THỬ LẠI
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
