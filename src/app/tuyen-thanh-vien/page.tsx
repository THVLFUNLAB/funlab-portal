"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Metadata } from "next";
import { saveRecruitment, type RecruitmentPayload } from "@/app/actions/recruitActions";

// ─── DATA CONSTANTS ────────────────────────────────────────────
const ROLES_THCS = [
  { id: "Đặc Vụ Thí Nghiệm",    title: "Thí Nghiệm",  desc: "Pha chế & Mô hình STEM",   icon: "fa-flask-vial",   color: "text-cyan-400" },
  { id: "Đặc Vụ Truyền Thông Nhí", title: "Media Nhí",   desc: "CapCut, Ảnh & Poster",   icon: "fa-camera-retro", color: "text-purple-400" },
  { id: "Đặc Vụ Sự Kiện",        title: "Sự Kiện",     desc: "Đạo cụ & Hỗ trợ trò chơi", icon: "fa-box-archive",  color: "text-amber-400" },
  { id: "Đặc Vụ Khám Phá",       title: "Khám Phá",    desc: "Trải nghiệm & Học hỏi",    icon: "fa-compass",      color: "text-emerald-400" },
];
const ROLES_THPT = [
  { id: "Ban Chuyên Môn",  title: "Chuyên Môn",  desc: "Nghiên cứu & Kịch bản",   icon: "fa-brain",          color: "text-cyan-400" },
  { id: "Ban Kỹ Thuật",    title: "Kỹ Thuật",    desc: "Thí nghiệm & Sân khấu",   icon: "fa-screwdriver-wrench", color: "text-emerald-400" },
  { id: "Ban Truyền Thông",title: "Truyền Thông", desc: "Quay, Dựng & Poster",      icon: "fa-video",          color: "text-purple-400" },
  { id: "Ban Tổ Chức",     title: "Hậu Cần",     desc: "Vật tư & Điều phối",       icon: "fa-sitemap",        color: "text-amber-400" },
];

const CHALLENGE_THCS = {
  question: "Trong Tập 5 Funlab 'Thử thách nín thở', chúng mình biết rằng Phổi không hề có cơ để tự co bóp. Vậy 'ông chủ' điều khiển áp suất giúp phổi hít thở mỗi ngày là gì?",
  options: [
    { key: "A", text: "Cơ hoành (Chiếc màng cao su co giãn dưới lồng ngực)." },
    { key: "B", text: "Trái tim tự bơm không khí vào." },
    { key: "C", text: "Do chúng ta tự dùng tay ép bụng vào." },
  ],
  correct: "A",
  explainCorrect: "CHÍNH XÁC! Cơ hoành hạ xuống làm giảm áp suất trong lồng ngực, giúp không khí tràn vào phổi tự nhiên!",
  explainOther:   "ĐÁP ÁN LÀ A! Cơ hoành chính là 'chiếc bơm' kỳ diệu điều khiển hơi thở của chúng mình đấy!",
};

const CHALLENGE_THPT: Record<string, typeof CHALLENGE_THCS> = {
  "Ban Chuyên Môn": {
    question: "Trong Tập 4 'Pháo hoa Funlab', muối Đồng (CuSO4) khi đốt tạo màu xanh lá, muối Ăn (NaCl) tạo màu vàng chói. Nguyên lý cốt lõi của 'vũ điệu sắc màu' này là gì?",
    options: [
      { key: "A", text: "Các ion kim loại hấp thụ nhiệt năng rồi giải phóng các hạt ánh sáng gọi là Photon." },
      { key: "B", text: "Do xà phòng trong chén nổ sinh khí bọt màu." },
      { key: "C", text: "Do phản ứng cháy tỏa ra khói độc có màu." },
    ],
    correct: "A",
    explainCorrect: "TƯ DUY CHUYÊN MÔN RẤT TỐT! Nhiệt năng kích thích electron nhảy mức năng lượng phát ra photon cực đẹp!",
    explainOther:   "ĐÁP ÁN ĐÚNG LÀ A! Ion kim loại giải phóng photon ánh sáng tạo nên sắc màu pháo hoa!",
  },
  "Ban Kỹ Thuật": {
    question: "Trong Tập 8 Funlab, màn trình diễn 'Tay không bắt lửa' sử dụng khí Metan sủi bọt xà phòng. Để người thực hiện không bị bỏng, nguyên tắc kỹ thuật nào là bắt buộc?",
    options: [
      { key: "A", text: "Bản thân khí Metan là khí lạnh nên không gây bỏng." },
      { key: "B", text: "Phải nhúng ướt đẫm bàn tay bằng nước lạnh trước để tạo lớp màng tản nhiệt hấp thụ nhiệt lượng." },
      { key: "C", text: "Đeo găng khẩu trang cách nhiệt dày." },
    ],
    correct: "B",
    explainCorrect: "CHUẨN KỸ THUẬT AN TOÀN! Lớp nước lạnh trên tay hấp thụ nhiệt năng và hóa hơi trước, bảo vệ da an toàn tuyệt đối!",
    explainOther:   "ĐÁP ÁN ĐÚNG LÀ B! Phải làm ướt đẫm tay bằng nước lạnh để tạo màng bảo vệ nhiệt.",
  },
  "Ban Truyền Thông": {
    question: "Trong Tập 9 'Tĩnh điện', để ghi lại khoảnh khắc quả bóng bay vỡ tung trong 0.1 giây do máy Wimshurst phóng điện, kỹ thuật quay phim nào bùng nổ thị giác nhất?",
    options: [
      { key: "A", text: "Quay tua nhanh thời gian (Time-lapse)." },
      { key: "B", text: "Quay tốc độ khung hình cao (60fps / 120fps Slow-Motion) kết hợp góc quay Macro cực cận." },
      { key: "C", text: "Chụp một bức ảnh tĩnh bình thường." },
    ],
    correct: "B",
    explainCorrect: "TƯ DUY MEDIA XUẤT SẮC! Dùng Slow-Motion 60/120fps sẽ bắt trọn khoảnh khắc bùng nổ thị giác!",
    explainOther:   "ĐÁP ÁN ĐÚNG LÀ B! Slow-mo 60/120fps là bí quyết tạo nên thước phim Funlab bùng nổ!",
  },
  "Ban Tổ Chức": {
    question: "Trong Tập 6 'Chiếc lon bẹp dí', để biểu diễn sự chênh lệch áp suất khí quyển cho học sinh xem, kỹ thuật viên đã thao tác như thế nào?",
    options: [
      { key: "A", text: "Đun sôi một ít nước trong lon rồi úp ngược ngay vào chậu nước lạnh." },
      { key: "B", text: "Dùng búa đập mạnh vào lon." },
      { key: "C", text: "Bơm khí nitơ lỏng vào lon." },
    ],
    correct: "A",
    explainCorrect: "TƯ DUY HẬU CẦN TUYỆT VỜI! Hơi nước ngưng tụ đột ngột làm áp suất trong lon giảm mạnh, áp suất bên ngoài bóp bẹp dí lon!",
    explainOther:   "ĐÁP ÁN ĐÚNG LÀ A! Đun nước úp ngược vào chậu nước lạnh là bí kíp tạo nên màn ngưng tụ áp suất thần kỳ!",
  },
};

type Screen = 1 | 2 | 3 | 4 | 5 | "loading" | 6;

interface FormData {
  name: string; studentClass: string; level: "THCS" | "THPT"; department: string;
  station1Answer: string; station2Answer: string; challengeAnswer: string;
  experience: string; portfolio: string; aspiration: string;
  agentCode: string; timestamp: string;
}

const INITIAL_DATA: FormData = {
  name: "", studentClass: "", level: "THCS", department: "",
  station1Answer: "", station2Answer: "", challengeAnswer: "",
  experience: "", portfolio: "", aspiration: "", agentCode: "", timestamp: "",
};

const PROGRESS: Record<string, { label: string; pct: number }> = {
  "1":       { label: "PHASE 01: XÁC THỰC ID & KHỐI LỚP",               pct: 20 },
  "2":       { label: "PHASE 02: TRẠM 01 - TRUYỀN THÔNG & MÃ MẬT",      pct: 40 },
  "3":       { label: "PHASE 03: TRẠM 02 - DẤU ẤN HOẠT ĐỘNG ĐÃ QUA",   pct: 60 },
  "4":       { label: "PHASE 04: TRẠM 03 - THỬ THÁCH CHUYÊN MÔN",       pct: 80 },
  "5":       { label: "PHASE 05: HỒ SƠ NĂNG LỰC & HOÀN TẤT",            pct: 90 },
  "loading": { label: "TRANSMITTING DATA...",                            pct: 95 },
  "6":       { label: "COMPLETED: XÁC NHẬN ĐẶC VỤ",                     pct: 100 },
};

// ─── MAIN COMPONENT ────────────────────────────────────────────
export default function TuyenThanhVienPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [screen, setScreen] = useState<Screen>(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);

  // Screen 1
  const [nameInput, setNameInput] = useState("");
  const [classInput, setClassInput] = useState("");
  const [error1, setError1] = useState("");

  // Station answers
  const [st1Done, setSt1Done]     = useState(false);
  const [st1Correct, setSt1Correct] = useState(false);
  const [st2Done, setSt2Done]     = useState(false);
  const [st2Correct, setSt2Correct] = useState(false);
  const [chDone, setChDone]       = useState(false);
  const [chCorrect, setChCorrect] = useState(false);

  // Screen 5
  const [expVal, setExpVal]   = useState("");
  const [portVal, setPortVal] = useState("");
  const [aspVal, setAspVal]   = useState("");
  const [error5, setError5]   = useState("");

  const [audioOn, setAudioOn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── CANVAS PARTICLES ───────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; size: number; sx: number; sy: number; op: number };
    const particles: P[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      sx: (Math.random() - 0.5) * 0.4,
      sy: (Math.random() - 0.5) * 0.4,
      op: Math.random() * 0.5 + 0.2,
    }));

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.sx; p.y += p.sy;
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
        ctx.fillStyle = `rgba(0,240,255,${p.op})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // ─── AUDIO ──────────────────────────────────────────────────
  const playSound = useCallback((type: "click" | "success" | "error") => {
    if (!audioOn) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ac = audioCtxRef.current;
      if (ac.state === "suspended") ac.resume();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      const t = ac.currentTime;
      if (type === "click") {
        osc.type = "sine"; osc.frequency.setValueAtTime(800, t); osc.frequency.exponentialRampToValueAtTime(400, t + 0.08);
        gain.gain.setValueAtTime(0.12, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.start(t); osc.stop(t + 0.08);
      } else if (type === "success") {
        osc.type = "triangle"; osc.frequency.setValueAtTime(440, t); osc.frequency.setValueAtTime(554, t + 0.1); osc.frequency.setValueAtTime(659, t + 0.2);
        gain.gain.setValueAtTime(0.18, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        osc.start(t); osc.stop(t + 0.35);
      } else {
        osc.type = "sawtooth"; osc.frequency.setValueAtTime(220, t); osc.frequency.exponentialRampToValueAtTime(110, t + 0.2);
        gain.gain.setValueAtTime(0.15, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t); osc.stop(t + 0.2);
      }
    } catch { /* ignore */ }
  }, [audioOn]);

  // ─── LEVEL DETECTION ────────────────────────────────────────
  const detectedLevel = useCallback((cls: string): "THCS" | "THPT" => {
    const m = cls.toUpperCase().match(/1[0-2]|10|11|12|[6-9]/);
    if (!m) return "THCS";
    return parseInt(m[0]) >= 10 ? "THPT" : "THCS";
  }, []);

  const currentLevel = detectedLevel(classInput);
  const currentRoles = currentLevel === "THPT" ? ROLES_THPT : ROLES_THCS;
  const currentChallenge = currentLevel === "THPT"
    ? (CHALLENGE_THPT[data.department] ?? CHALLENGE_THPT["Ban Chuyên Môn"])
    : CHALLENGE_THCS;

  // ─── PROGRESS ───────────────────────────────────────────────
  const prog = PROGRESS[String(screen)];

  // ─── SCREEN 1 SUBMIT ────────────────────────────────────────
  const handleScreen1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !classInput.trim()) {
      playSound("error"); setError1("LỖI: Vui lòng nhập đầy đủ Họ tên và Lớp!"); return;
    }
    if (!data.department) {
      playSound("error"); setError1("LỖI: Vui lòng chọn 1 Vị trí/Ban ứng tuyển!"); return;
    }
    playSound("click"); setError1("");
    setData(p => ({ ...p, name: nameInput.trim(), studentClass: classInput.trim(), level: currentLevel }));
    setScreen(2);
  };

  // ─── STATION HANDLERS ───────────────────────────────────────
  const handleSt1 = (key: string) => {
    setSt1Done(true); setSt1Correct(key === "A");
    setData(p => ({ ...p, station1Answer: key }));
    playSound(key === "A" ? "success" : "click");
  };
  const handleSt2 = (key: string) => {
    setSt2Done(true); setSt2Correct(key === "A");
    setData(p => ({ ...p, station2Answer: key }));
    playSound(key === "A" ? "success" : "click");
  };
  const handleChallenge = (key: string) => {
    const opt = currentChallenge.options.find(o => o.key === key);
    setChDone(true); setChCorrect(key === currentChallenge.correct);
    setData(p => ({ ...p, challengeAnswer: `${key}: ${opt?.text ?? ""}` }));
    playSound(key === currentChallenge.correct ? "success" : "click");
  };

  // ─── SCREEN 5 SUBMIT ────────────────────────────────────────
  const handleScreen5 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expVal.trim() || !aspVal.trim()) {
      playSound("error"); setError5("LỖI: Vui lòng điền đầy đủ các thông tin bắt buộc!"); return;
    }
    playSound("click"); setError5("");
    const agentCode = `FL-${currentLevel}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleString("vi-VN");

    const finalData: FormData = {
      ...data, experience: expVal.trim(),
      portfolio: portVal.trim() || "Không cung cấp",
      aspiration: aspVal.trim(), agentCode, timestamp,
    };
    setData(finalData);
    setScreen("loading");
    setIsSubmitting(true);

    const payload: RecruitmentPayload = {
      name: finalData.name, studentClass: finalData.studentClass,
      level: finalData.level, department: finalData.department,
      station1Answer: finalData.station1Answer, station2Answer: finalData.station2Answer,
      challengeAnswer: finalData.challengeAnswer, experience: finalData.experience,
      portfolio: finalData.portfolio, aspiration: finalData.aspiration,
      agentCode: finalData.agentCode, timestamp: finalData.timestamp,
    };

    try { await saveRecruitment(payload); } catch { /* show success anyway */ }

    setIsSubmitting(false);
    setScreen(6);
    playSound("success");
  };

  // ─── BADGE DOWNLOAD ─────────────────────────────────────────
  const downloadBadge = async () => {
    playSound("click");
    const el = document.getElementById("badgeCard");
    if (!el) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(el, { backgroundColor: "#030712", scale: 2 });
    const link = document.createElement("a");
    link.download = `FUNLAB-AGENT-${data.agentCode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // ─── RESET ──────────────────────────────────────────────────
  const reset = () => {
    playSound("click");
    setData(INITIAL_DATA); setNameInput(""); setClassInput("");
    setSt1Done(false); setSt1Correct(false);
    setSt2Done(false); setSt2Correct(false);
    setChDone(false); setChCorrect(false);
    setExpVal(""); setPortVal(""); setAspVal("");
    setError1(""); setError5(""); setScreen(1);
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@500;700;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#030712;color:#e2e8f0;font-family:'Inter',sans-serif;overflow-x:hidden;-webkit-tap-highlight-color:transparent;}
        .orb{font-family:'Orbitron',sans-serif;}
        .mono{font-family:'JetBrains Mono',monospace;}
        
        .cyber-grid{background-size:36px 36px;background-image:linear-gradient(to right,rgba(0,240,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(0,240,255,0.04) 1px,transparent 1px);}
        
        .tech-card{background:rgba(8,15,30,0.92);border:1px solid rgba(0,240,255,0.3);box-shadow:0 0 25px rgba(0,240,255,0.12),inset 0 0 15px rgba(0,240,255,0.04);backdrop-filter:blur(16px);position:relative;}
        .tech-card::before{content:'';position:absolute;top:-2px;left:-2px;width:14px;height:14px;border-top:2px solid #00f0ff;border-left:2px solid #00f0ff;}
        .tech-card::after{content:'';position:absolute;bottom:-2px;right:-2px;width:14px;height:14px;border-bottom:2px solid #00f0ff;border-right:2px solid #00f0ff;}
        
        .glow-blue{text-shadow:0 0 12px rgba(0,240,255,0.8),0 0 24px rgba(0,240,255,0.4);}
        .glow-green{text-shadow:0 0 12px rgba(0,255,102,0.8),0 0 24px rgba(0,255,102,0.4);}
        
        .btn-cyber{position:relative;background:linear-gradient(135deg,rgba(0,240,255,0.2) 0%,rgba(16,185,129,0.2) 100%);border:1px solid #00f0ff;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);overflow:hidden;cursor:pointer;color:white;}
        .btn-cyber:hover:not(:disabled){background:linear-gradient(135deg,rgba(0,240,255,0.4),rgba(16,185,129,0.4));box-shadow:0 0 25px rgba(0,240,255,0.6);transform:translateY(-2px);}
        .btn-cyber:active:not(:disabled){transform:translateY(1px);}
        .btn-cyber:disabled{opacity:0.5;cursor:not-allowed;}
        
        .role-card{border:1px solid rgba(0,240,255,0.2);transition:all 0.25s ease;cursor:pointer;background:rgba(3,7,18,0.6);padding:12px;border-radius:8px;text-align:center;}
        .role-card:hover,.role-card.selected{border-color:#00f0ff;background:rgba(0,240,255,0.15);box-shadow:0 0 15px rgba(0,240,255,0.35);}
        
        .quiz-btn{width:100%;padding:14px 16px;border-radius:8px;background:rgba(15,23,42,0.8);border:1px solid rgba(0,240,255,0.2);text-align:left;color:#e2e8f0;font-family:'Inter',sans-serif;transition:all 0.2s;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:13px;}
        .quiz-btn:hover{border-color:#00f0ff;}
        
        .inp{width:100%;background:rgba(3,7,18,0.8);border:1px solid #1e3a5f;border-radius:8px;padding:12px 16px;color:white;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;}
        .inp:focus{border-color:#00f0ff;box-shadow:0 0 0 1px #00f0ff;}
        
        .ta{width:100%;background:rgba(3,7,18,0.9);border:1px solid #1e3a5f;border-radius:8px;padding:12px;color:#4ade80;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:border-color 0.2s;resize:vertical;}
        .ta:focus{border-color:#00f0ff;}
        
        .pulse-border{animation:pulseGlow 2.5s infinite;}
        @keyframes pulseGlow{0%,100%{box-shadow:0 0 15px rgba(0,240,255,0.3);}50%{box-shadow:0 0 30px rgba(0,240,255,0.7);}}
        
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:#050a14;}
        ::-webkit-scrollbar-thumb{background:#00f0ff;border-radius:3px;}
        
        .scanlines::after{content:" ";display:block;position:fixed;inset:0;background:linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,0.25) 50%);background-size:100% 3px;z-index:20;pointer-events:none;}
      `}</style>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="min-h-screen cyber-grid scanlines flex flex-col" style={{ background: "#030712", color: "#e2e8f0" }}>
        <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.4 }} />

        {/* HEADER */}
        <header style={{ position: "relative", zIndex: 10, borderBottom: "1px solid rgba(0,240,255,0.15)", background: "rgba(2,6,23,0.85)", backdropFilter: "blur(12px)", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22d3ee", animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }} />
            <span className="orb glow-blue" style={{ fontWeight: 700, fontSize: 14, letterSpacing: 2, color: "#22d3ee" }}>
              VA SCIENCE CLUB <span style={{ color: "#34d399" }}>| FUNLAB RECRUIT</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="mono" style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(15,23,42,0.8)", padding: "4px 12px", borderRadius: 6, border: "1px solid #1e3a5f", fontSize: 11 }}>
              <i className="fa-solid fa-microchip" style={{ color: "#34d399" }} />
              <span>TRẠM: <span style={{ color: "#67e8f9" }}>VIỆT ANH 2</span></span>
            </div>
            <button onClick={() => { setAudioOn(p => !p); }} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(15,23,42,0.8)", border: `1px solid ${audioOn ? "#1e3a5f" : "#f43f5e"}`, color: audioOn ? "#22d3ee" : "#f43f5e", cursor: "pointer", fontSize: 12 }}>
              <i className={`fa-solid ${audioOn ? "fa-volume-high" : "fa-volume-xmark"}`} />
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main style={{ position: "relative", zIndex: 10, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", paddingBottom: 32 }}>

          {/* PROGRESS BAR */}
          <div style={{ width: "100%", maxWidth: 720, marginBottom: 16 }}>
            <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(0,240,255,0.8)", marginBottom: 6 }}>
              <span>{prog?.label}</span>
              <span>{prog?.pct}% COMPLETE</span>
            </div>
            <div style={{ width: "100%", height: 8, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(0,240,255,0.2)", borderRadius: 999, overflow: "hidden", padding: 2 }}>
              <div style={{ height: "100%", width: `${prog?.pct ?? 20}%`, background: "linear-gradient(to right,#06b6d4,#a855f7,#10b981)", borderRadius: 999, transition: "width 0.5s ease", boxShadow: "0 0 10px #00f0ff" }} />
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 720 }}>

            {/* ══ SCREEN 1 ══ */}
            {screen === 1 && (
              <div className="tech-card" style={{ padding: "32px 28px", borderRadius: 12 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "rgba(8,28,60,0.6)", border: "1px solid #22d3ee", marginBottom: 12, boxShadow: "0 0 20px rgba(0,240,255,0.3)" }}>
                    <i className="fa-solid fa-atom" style={{ fontSize: 32, color: "#22d3ee" }} />
                  </div>
                  <h1 className="orb" style={{ fontWeight: 900, fontSize: 24, color: "white", letterSpacing: 2, marginBottom: 4 }}>PHI VỤ FUNLAB</h1>
                  <p className="mono glow-blue" style={{ fontSize: 12, color: "#22d3ee", letterSpacing: 3 }}>Tuyển Chọn Đồng Đội Trạm Nghiên Cứu Khoa Học Việt Anh 2</p>
                </div>

                <form onSubmit={handleScreen1} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                    <div>
                      <label className="mono" style={{ display: "block", fontSize: 11, color: "#22d3ee", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                        <i className="fa-solid fa-id-badge" style={{ marginRight: 4 }} /> Họ và Tên <span style={{ color: "#f43f5e" }}>*</span>
                      </label>
                      <input className="inp" type="text" required autoComplete="off" value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Nhập đầy đủ Họ và Tên" />
                    </div>
                    <div>
                      <label className="mono" style={{ display: "block", fontSize: 11, color: "#22d3ee", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                        <i className="fa-solid fa-graduation-cap" style={{ marginRight: 4 }} /> Lớp <span style={{ color: "#f43f5e" }}>*</span>
                      </label>
                      <input className="inp" type="text" required autoComplete="off" value={classInput} onChange={e => setClassInput(e.target.value)} placeholder="Ví dụ: 6A1, 8C3, 10A2, 11B1" />
                    </div>
                  </div>

                  {/* Level badge + roles */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <label className="mono" style={{ fontSize: 11, color: "#22d3ee", textTransform: "uppercase", letterSpacing: 2 }}>
                        <i className="fa-solid fa-sitemap" style={{ marginRight: 4 }} /> Vị Trí / Ban Ứng Tuyển <span style={{ color: "#f43f5e" }}>*</span>
                      </label>
                      <span className="mono" style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, background: currentLevel === "THPT" ? "rgba(6,78,59,0.6)" : "rgba(8,51,68,0.6)", border: `1px solid ${currentLevel === "THPT" ? "#10b981" : "#22d3ee"}`, color: currentLevel === "THPT" ? "#6ee7b7" : "#67e8f9" }}>
                        {classInput ? `KHỐI ${currentLevel}` : "ĐANG PHÂN LỚP..."}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                      {currentRoles.map(r => (
                        <div key={r.id} className={`role-card ${data.department === r.id ? "selected" : ""}`} onClick={() => { playSound("click"); setData(p => ({ ...p, department: r.id })); }}>
                          <i className={`fa-solid ${r.icon}`} style={{ fontSize: 22, color: r.color.replace("text-", "").includes("cyan") ? "#22d3ee" : r.color.includes("purple") ? "#c084fc" : r.color.includes("amber") ? "#fbbf24" : "#34d399", marginBottom: 4, display: "block" }} />
                          <div className="orb" style={{ fontSize: 11, color: "white", fontWeight: 700 }}>{r.title}</div>
                          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{r.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error1 && <div className="mono" style={{ color: "#f87171", fontSize: 12, background: "rgba(127,29,29,0.3)", border: "1px solid #991b1b", padding: "10px 14px", borderRadius: 6 }}>{error1}</div>}

                  <button type="submit" className="btn-cyber orb" style={{ padding: "14px", borderRadius: 8, fontWeight: 700, letterSpacing: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13 }}>
                    <i className="fa-solid fa-fingerprint" style={{ fontSize: 18, color: "#67e8f9" }} />
                    XÁC THỰC ID & BẮT ĐẦU HÀNH TRÌNH
                  </button>
                </form>
              </div>
            )}

            {/* ══ SCREEN 2 — Station 01 ══ */}
            {screen === 2 && (
              <div className="tech-card" style={{ padding: "32px 28px", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, borderBottom: "1px solid rgba(0,240,255,0.15)", paddingBottom: 16 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 11, color: "#c084fc", textTransform: "uppercase", marginBottom: 4 }}><i className="fa-solid fa-wifi" style={{ marginRight: 4 }} />TRẠM 01: HỆ SINH THÁI KHOA HỌC</div>
                    <h2 className="orb" style={{ fontSize: 20, fontWeight: 700, color: "white" }}>TRUYỀN THÔNG & MÃ MẬT FUNLAB</h2>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(59,7,100,0.5)", border: "1px solid rgba(168,85,247,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-satellite-dish" style={{ fontSize: 22, color: "#c084fc" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 20 }}>
                  {[
                    { icon: "fa-play", color: "#c084fc", border: "#581c87", title: "VIDEO CHALLENGE", text: "Phát sóng Thứ 6 hàng tuần trên kênh truyền thông Vess project" },
                    { icon: "fa-radio", color: "#22d3ee", border: "#164e63", title: "RADIO VIỆT ANH", text: "Vinh danh đặc vụ xuất sắc & câu chuyện khoa học Thứ 5 hàng tuần" },
                    { icon: "fa-award", color: "#34d399", border: "#064e3b", title: "HUY HIỆU SỐ", text: "Thăng cấp: Explorer ➔ Creative Engineer ➔ Funlab Master" },
                  ].map(c => (
                    <div key={c.title} style={{ padding: 12, background: "rgba(2,6,23,0.8)", border: `1px solid ${c.border}`, borderRadius: 8 }}>
                      <div className="orb" style={{ display: "flex", alignItems: "center", gap: 8, color: c.color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                        <i className={`fa-solid ${c.icon}`} />{c.title}
                      </div>
                      <p style={{ fontSize: 11, color: "#cbd5e1" }} dangerouslySetInnerHTML={{ __html: c.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    </div>
                  ))}
                </div>

                <div style={{ padding: "12px 16px", background: "rgba(59,7,100,0.2)", borderLeft: "4px solid #a855f7", borderRadius: "0 8px 8px 0", marginBottom: 14 }}>
                  <p style={{ fontSize: 13, color: "#e9d5ff", fontWeight: 600, lineHeight: 1.6 }}>
                    <i className="fa-solid fa-key" style={{ marginRight: 6, color: "#a855f7" }} />
                    "Đặc vụ hãy giải mã mật thư: Video Funlab Challenge và Radio Việt Anh vinh danh đặc vụ được phát sóng vào các ngày nào trong tuần trên kênh Vess project?"
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {[
                    { key: "A", text: "Thứ 6 (Video Challenge) & Thứ 5 (Radio Việt Anh)" },
                    { key: "B", text: "Thứ 2 (Video Challenge) & Chủ Nhật (Radio Việt Anh)" },
                    { key: "C", text: "Thứ 3 (Video Challenge) & Thứ 7 (Radio Việt Anh)" },
                  ].map(o => (
                    <button key={o.key} className="quiz-btn" onClick={() => handleSt1(o.key)}>
                      <span><strong className="mono" style={{ color: "#a855f7", marginRight: 8 }}>{o.key}.</strong>{o.text}</span>
                      <i className="fa-solid fa-chevron-right" style={{ color: "#a855f7", opacity: 0.5 }} />
                    </button>
                  ))}
                </div>

                {st1Done && (
                  <div className="mono" style={{ padding: "14px 16px", borderRadius: 8, marginBottom: 16, fontSize: 12, background: st1Correct ? "rgba(6,78,59,0.4)" : "rgba(92,67,1,0.4)", border: `1px solid ${st1Correct ? "#059669" : "#92400e"}`, color: st1Correct ? "#6ee7b7" : "#fde68a" }}>
                    <i className={`fa-solid ${st1Correct ? "fa-circle-check" : "fa-lightbulb"}`} style={{ marginRight: 8 }} />
                    {st1Correct
                      ? "MÃ MẬT CHÍNH XÁC! Nhớ lịch Thứ 5 (Nghe Radio Việt Anh) và Thứ 6 (Xem Video Challenge trên kênh Vess project) để tích lũy Huy hiệu nhé!"
                      : "MÃ MẬT ĐÚNG LÀ A! Video phát Thứ 6 và Radio phát Thứ 5 vinh danh học sinh xuất sắc. Đã cập nhật kiến thức!"}
                  </div>
                )}

                <button disabled={!st1Done} className="btn-cyber orb" style={{ padding: "14px", borderRadius: 8, fontWeight: 700, letterSpacing: 2, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12 }} onClick={() => { playSound("click"); setScreen(3); }}>
                  TIẾP TỤC ĐẾN TRẠM 02: DẤU ẤN KHOA HỌC ĐÃ QUA <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            )}

            {/* ══ SCREEN 3 — Station 02 ══ */}
            {screen === 3 && (
              <div className="tech-card" style={{ padding: "32px 28px", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, borderBottom: "1px solid rgba(0,240,255,0.15)", paddingBottom: 16 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 11, color: "#fbbf24", textTransform: "uppercase", marginBottom: 4 }}><i className="fa-solid fa-flask-vial" style={{ marginRight: 4 }} />TRẠM 02: THỰC NGHIỆM ĐỘC ĐÁO</div>
                    <h2 className="orb" style={{ fontSize: 20, fontWeight: 700, color: "white" }}>DẤU ẤN HOẠT ĐỘNG ĐÃ QUA</h2>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(92,26,0,0.5)", border: "1px solid rgba(251,191,36,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-fire" style={{ fontSize: 22, color: "#fbbf24" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 20 }}>
                  {[
                    { icon: "fa-fire-burner", color: "#fbbf24", border: "#92400e", title: "TAY KHÔNG BẮT LỬA", text: "Thí nghiệm bọt khí Metan cháy rực rỡ trên bàn tay mà không gây bỏng nhờ lớp bảo vệ xà phòng & nước." },
                    { icon: "fa-compress", color: "#22d3ee", border: "#164e63", title: "BÀN TAY TÀNG HÌNH", text: "Màn ngưng tụ hơi nước làm chênh lệch áp suất bóp bẹp dí lon nhôm & Trứng chui vào chai." },
                    { icon: "fa-bolt", color: "#c084fc", border: "#581c87", title: "TĨNH ĐIỆN & PHÁO HOA", text: "Máy Wimshurst làm tóc dựng ngược và vũ điệu màu sắc bùng nổ từ CuSO4, NaCl." },
                  ].map(c => (
                    <div key={c.title} style={{ padding: 12, background: "rgba(2,6,23,0.8)", border: `1px solid ${c.border}`, borderRadius: 8 }}>
                      <div className="orb" style={{ display: "flex", alignItems: "center", gap: 8, color: c.color, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                        <i className={`fa-solid ${c.icon}`} />{c.title}
                      </div>
                      <p style={{ fontSize: 11, color: "#cbd5e1" }}>{c.text}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "12px 16px", background: "rgba(92,67,1,0.2)", borderLeft: "4px solid #f59e0b", borderRadius: "0 8px 8px 0", marginBottom: 14 }}>
                  <p style={{ fontSize: 13, color: "#fde68a", fontWeight: 600, lineHeight: 1.6 }}>
                    <i className="fa-solid fa-circle-question" style={{ marginRight: 6, color: "#f59e0b" }} />
                    "Trong các năm học qua, Funlab & CLB Khoa Học đã gây ấn tượng mạnh với học sinh toàn trường qua những màn trình diễn thực nghiệm nào?"
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {[
                    { key: "A", text: "Trình diễn \u201cTay không bắt lửa\u201d (Metan an toàn), Bóp bẹp lon bằng áp suất & Pháo hoa kim loại" },
                    { key: "B", text: "Thi đấu giải cờ vua trên sân trường" },
                    { key: "C", text: "Biểu diễn vũ đạo nhảy hiện đại" },
                  ].map(o => (
                    <button key={o.key} className="quiz-btn" onClick={() => handleSt2(o.key)} style={{ borderColor: "rgba(245,158,11,0.3)" }}>
                      <span><strong className="mono" style={{ color: "#fbbf24", marginRight: 8 }}>{o.key}.</strong>{o.text}</span>
                      <i className="fa-solid fa-chevron-right" style={{ color: "#fbbf24", opacity: 0.5 }} />
                    </button>
                  ))}
                </div>

                {st2Done && (
                  <div className="mono" style={{ padding: "14px 16px", borderRadius: 8, marginBottom: 16, fontSize: 12, background: st2Correct ? "rgba(6,78,59,0.4)" : "rgba(92,67,1,0.4)", border: `1px solid ${st2Correct ? "#059669" : "#92400e"}`, color: st2Correct ? "#6ee7b7" : "#fde68a" }}>
                    <i className={`fa-solid ${st2Correct ? "fa-circle-check" : "fa-lightbulb"}`} style={{ marginRight: 8 }} />
                    {st2Correct
                      ? "CHUẨN KHÔNG CẦN CHỈNH! Màn trình diễn Tay không bắt lửa, bóp nát lon & pháo hoa kim loại là các thực nghiệm huyền thoại của Funlab tại Trường Việt Anh 2!"
                      : "CÂU TRẢ LỜI ĐÚNG LÀ A! Funlab & CLB Khoa Học luôn bùng nổ với các màn trình diễn Lửa Metan, Ngưng tụ áp suất và Pháo hoa màu sắc!"}
                  </div>
                )}

                <button disabled={!st2Done} className="btn-cyber orb" style={{ padding: "14px", borderRadius: 8, fontWeight: 700, letterSpacing: 2, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12 }} onClick={() => { playSound("click"); setScreen(4); }}>
                  TIẾP TỤC ĐẾN TRẠM 03: THỬ THÁCH CHUYÊN MÔN <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            )}

            {/* ══ SCREEN 4 — Specialty Challenge ══ */}
            {screen === 4 && (
              <div className="tech-card" style={{ padding: "32px 28px", borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, borderBottom: "1px solid rgba(0,240,255,0.15)", paddingBottom: 16 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 11, color: "#22d3ee", textTransform: "uppercase", marginBottom: 4 }}>
                      <i className="fa-solid fa-bolt" style={{ marginRight: 4 }} />KHỐI {data.level}: {data.department?.toUpperCase()}
                    </div>
                    <h2 className="orb" style={{ fontSize: 20, fontWeight: 700, color: "white" }}>KÍCH HOẠT LÕI NĂNG LƯỢNG</h2>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(8,28,60,0.5)", border: "1px solid rgba(0,240,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="fa-solid fa-atom" style={{ fontSize: 22, color: "#22d3ee", animation: "spin 8s linear infinite" }} />
                  </div>
                </div>

                <div style={{ padding: "12px 16px", background: "rgba(8,28,60,0.3)", borderLeft: "4px solid #22d3ee", borderRadius: "0 8px 8px 0", marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#bae6fd", fontWeight: 600, lineHeight: 1.7 }}>"{currentChallenge.question}"</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {currentChallenge.options.map(o => (
                    <button key={o.key} className="quiz-btn" onClick={() => handleChallenge(o.key)}>
                      <span><strong className="mono" style={{ color: "#22d3ee", marginRight: 8 }}>{o.key}.</strong>{o.text}</span>
                      <i className="fa-solid fa-chevron-right" style={{ color: "#22d3ee", opacity: 0.5 }} />
                    </button>
                  ))}
                </div>

                {chDone && (
                  <div className="mono" style={{ padding: "14px 16px", borderRadius: 8, marginBottom: 16, fontSize: 12, background: chCorrect ? "rgba(6,78,59,0.4)" : "rgba(92,67,1,0.4)", border: `1px solid ${chCorrect ? "#059669" : "#92400e"}`, color: chCorrect ? "#6ee7b7" : "#fde68a" }}>
                    <i className={`fa-solid ${chCorrect ? "fa-circle-check" : "fa-circle-info"}`} style={{ marginRight: 8 }} />
                    {chCorrect ? currentChallenge.explainCorrect : currentChallenge.explainOther}
                  </div>
                )}

                <button disabled={!chDone} className="btn-cyber orb" style={{ padding: "14px", borderRadius: 8, fontWeight: 700, letterSpacing: 2, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12 }} onClick={() => { playSound("click"); setScreen(5); }}>
                  TIẾP TỤC ĐẾN HỒ SƠ NĂNG LỰC THỰC CHIẾN <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            )}

            {/* ══ SCREEN 5 — Profile Form ══ */}
            {screen === 5 && (
              <div className="tech-card" style={{ padding: "32px 28px", borderRadius: 12 }}>
                <div style={{ marginBottom: 20, borderBottom: "1px solid rgba(0,240,255,0.15)", paddingBottom: 16 }}>
                  <div className="mono" style={{ fontSize: 11, color: "#34d399", textTransform: "uppercase", marginBottom: 4 }}><i className="fa-solid fa-terminal" style={{ marginRight: 4 }} />HỒ SƠ NĂNG LỰC THỰC CHIẾN</div>
                  <h2 className="orb" style={{ fontSize: 20, fontWeight: 700, color: "white" }}>HÀNH TRANG & ĐAM MÊ</h2>
                </div>

                <form onSubmit={handleScreen5} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label className="mono" style={{ display: "block", fontSize: 11, color: "#22d3ee", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                      <i className="fa-solid fa-star" style={{ marginRight: 4 }} />
                      {data.level === "THCS" ? "1. SỞ THÍCH HOẶC MÔ HÌNH/SẢN PHẨM EM TỪNG TỰ LÀM" : "1. KINH NGHIỆM THỰC TẾ (DỰNG CLIP, LÀM STEM, NHÓM TRƯỞNG...)"} <span style={{ color: "#f43f5e" }}>*</span>
                    </label>
                    <textarea className="ta" rows={3} required value={expVal} onChange={e => setExpVal(e.target.value)} placeholder="// Ví dụ: Em từng làm mô hình xe bong bóng, thích chỉnh ảnh/clip CapCut, từng quay TikTok..." />
                  </div>

                  <div>
                    <label className="mono" style={{ display: "block", fontSize: 11, color: "#22d3ee", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                      <i className="fa-solid fa-link" style={{ marginRight: 4 }} />2. LINK SẢN PHẨM / PORTFOLIO (NẾU CÓ - KHÔNG BẮT BUỘC)
                    </label>
                    <input className="inp" type="text" value={portVal} onChange={e => setPortVal(e.target.value)} placeholder="Dán link Drive, TikTok, YouTube, Canva sản phẩm em từng làm" />
                  </div>

                  <div>
                    <label className="mono" style={{ display: "block", fontSize: 11, color: "#22d3ee", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
                      <i className="fa-solid fa-rocket" style={{ marginRight: 4 }} />
                      {data.level === "THCS" ? "2. THỬ THÁCH NÀO CỦA FUNLAB LÀM EM HÀO HỨNG NHẤT?" : "3. NGUYỆN VỌNG & Ý TƯỞNG ĐÓNG GÓP CHO FUNLAB"} <span style={{ color: "#f43f5e" }}>*</span>
                    </label>
                    <textarea className="ta" rows={3} required value={aspVal} onChange={e => setAspVal(e.target.value)} placeholder="// Em muốn cùng CLB làm bệ phóng tên lửa nước, dựng clip triệu view..." />
                  </div>

                  {error5 && <div className="mono" style={{ color: "#f87171", fontSize: 12, background: "rgba(127,29,29,0.3)", border: "1px solid #991b1b", padding: "10px 14px", borderRadius: 6 }}>{error5}</div>}

                  <button type="submit" disabled={isSubmitting} className="btn-cyber orb" style={{ padding: "14px", borderRadius: 8, fontWeight: 700, letterSpacing: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13 }}>
                    <i className="fa-solid fa-paper-plane" style={{ color: "#67e8f9", fontSize: 18 }} />
                    MÃ HÓA & GỬI ĐƠN NỘP HOÀN TẤT
                  </button>
                </form>
              </div>
            )}

            {/* ══ LOADING ══ */}
            {screen === "loading" && (
              <div className="tech-card" style={{ padding: "48px 28px", borderRadius: 12, textAlign: "center" }}>
                <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 20px" }}>
                  <div style={{ position: "absolute", inset: 0, border: "4px solid rgba(0,240,255,0.2)", borderRadius: "50%" }} />
                  <div style={{ position: "absolute", inset: 0, border: "4px solid #22d3ee", borderRadius: "50%", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
                  <i className="fa-solid fa-database" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#22d3ee", fontSize: 20 }} />
                </div>
                <h3 className="orb" style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 8 }}>ĐANG MÃ HÓA & TRUYỀN DỮ LIỆU...</h3>
                <p className="mono glow-blue" style={{ fontSize: 12, color: "#22d3ee" }}>Đang kết nối tới Ban Giám Sát CLB Khoa Học qua giao thức bảo mật.</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* ══ SCREEN 6 — Success Badge ══ */}
            {screen === 6 && (
              <div className="tech-card" style={{ padding: "32px 28px", borderRadius: 12, textAlign: "center" }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "rgba(6,46,37,0.8)", border: "2px solid #34d399", marginBottom: 12, boxShadow: "0 0 30px #00ff66" }}>
                    <i className="fa-solid fa-check" style={{ fontSize: 28, color: "#34d399" }} />
                  </div>
                  <h2 className="orb glow-green" style={{ fontSize: 24, fontWeight: 900, color: "#34d399", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>ĐĂNG KÝ THÀNH CÔNG!</h2>
                  <p style={{ color: "#e2e8f0", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>
                    CHÚC MỪNG ĐẶC VỤ <strong style={{ color: "#67e8f9" }}>{data.name}</strong>! Đơn ứng tuyển <strong style={{ color: "#4ade80" }}>{data.department}</strong> đã được mã hóa gửi về Ban Giám Sát CLB Khoa Học Việt Anh 2.
                  </p>
                </div>

                {/* DIGITAL ID BADGE */}
                <div id="badgeCard" className="pulse-border" style={{ maxWidth: 400, margin: "0 auto 16px", padding: "20px 24px", borderRadius: 12, background: "#030712", border: "2px solid rgba(0,240,255,0.8)", boxShadow: "0 0 30px rgba(0,240,255,0.25)", textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(0,240,255,0.2)", paddingBottom: 12, marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <i className="fa-solid fa-atom" style={{ color: "#22d3ee", fontSize: 18 }} />
                      <div>
                        <div className="orb" style={{ fontSize: 11, color: "white", fontWeight: 700, letterSpacing: 2 }}>FUNLAB RECRUIT BADGE</div>
                        <div className="mono" style={{ fontSize: 9, color: "#64748b" }}>TRƯỜNG VIỆT ANH 2</div>
                      </div>
                    </div>
                    <span className="mono" style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(6,46,37,0.8)", color: "#4ade80", fontSize: 10, border: "1px solid #166534" }}>{data.level} AGENT</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 88, height: 88, borderRadius: 8, background: "rgba(8,28,60,0.5)", border: "1px solid #1e3a5f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#22d3ee" }}>
                      <i className="fa-solid fa-user-astronaut" style={{ fontSize: 34 }} />
                      <span className="mono" style={{ fontSize: 8, marginTop: 4, color: "#67e8f9" }}>EXPLORER</span>
                    </div>
                    <div className="mono" style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                      <div><div style={{ color: "#475569", fontSize: 9 }}>MÃ ĐẶC VỤ:</div><div style={{ color: "#67e8f9", fontWeight: 700 }}>{data.agentCode}</div></div>
                      <div><div style={{ color: "#475569", fontSize: 9 }}>HỌ TÊN:</div><div style={{ color: "white", fontWeight: 600, fontFamily: "Inter,sans-serif" }}>{data.name}</div></div>
                      <div><div style={{ color: "#475569", fontSize: 9 }}>LỚP / VỊ TRÍ:</div><div style={{ color: "#4ade80", fontWeight: 700 }}>{data.studentClass} | {data.department}</div></div>
                    </div>
                  </div>

                  <div className="mono" style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(30,58,138,0.5)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#475569" }}>
                    <span>THỜI GIAN: <span style={{ color: "#64748b" }}>{data.timestamp}</span></span>
                    <i className="fa-solid fa-barcode" style={{ color: "rgba(0,240,255,0.6)", fontSize: 16 }} />
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  <button onClick={downloadBadge} className="btn-cyber mono" style={{ padding: "10px 20px", borderRadius: 8, fontSize: 12, display: "flex", alignItems: "center", gap: 8, color: "#67e8f9" }}>
                    <i className="fa-solid fa-download" /> TẢI THẺ ĐẶC VỤ (PNG)
                  </button>
                  <button onClick={reset} className="mono" style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(15,23,42,0.8)", border: "1px solid #334155", color: "#94a3b8", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
                    <i className="fa-solid fa-rotate-left" /> ĐĂNG KÝ BẠN KHÁC
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* FOOTER */}
        <footer style={{ position: "relative", zIndex: 10, padding: "10px 20px", borderTop: "1px solid rgba(0,240,255,0.15)", background: "rgba(2,6,23,0.9)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <div className="mono" style={{ fontSize: 11, color: "#475569" }}>© CLB KHOA HỌC TRƯỜNG VIỆT ANH 2 | FUNLAB PORTAL</div>
          <div className="mono" style={{ fontSize: 11, color: "rgba(0,240,255,0.7)" }}>
            <i className="fa-solid fa-shield-halved" style={{ marginRight: 4 }} />STATUS: ONLINE RECRUITMENT
          </div>
        </footer>
      </div>
    </>
  );
}
