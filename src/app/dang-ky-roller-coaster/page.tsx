"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight, Users, Star, Rocket, Shield, CheckCircle,
  AlertCircle, Loader2, Trophy, Zap, ArrowLeft, PartyPopper
} from "lucide-react";

// ─── Kiểu dữ liệu ───────────────────────────────────────────────────────────
type Division = "A" | "B" | "C";

interface FormData {
  team_name: string;
  slogan: string;
  division: Division | "";
  leader_name: string;
  leader_class: string;
  leader_email: string;
  leader_phone: string;
  member2: string;
  member3: string;
  member4: string;
  member5: string;
  agreed: boolean;
}

interface RegisteredTeam {
  id: string;
  team_name: string;
  slogan: string | null;
  division: Division;
  leader_name: string;
  leader_class: string;
  created_at: string;
}

// ─── Config bảng đấu ────────────────────────────────────────────────────────
const DIVISIONS = [
  {
    id: "A" as Division,
    label: "Bảng A",
    grade: "Khối 6 – 7",
    challenge: "Tháp cao 50cm + dốc xoắn",
    icon: "🏗️",
    color: "from-green-500 to-emerald-600",
    border: "border-green-500/40",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.25)]",
    bg: "bg-green-500/10",
    text: "text-green-400",
  },
  {
    id: "B" as Division,
    label: "Bảng B",
    grade: "Khối 8 – 9",
    challenge: "Vòng lượn 360° + giữ bi lâu nhất",
    icon: "🔄",
    color: "from-cyan-500 to-blue-600",
    border: "border-cyan-500/40",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.25)]",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
  },
  {
    id: "C" as Division,
    label: "Bảng C",
    grade: "Khối 10 – 11",
    challenge: "Vòng Clothoid Loop + cơ cấu bập bênh",
    icon: "⚙️",
    color: "from-purple-500 to-violet-600",
    border: "border-purple-500/40",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
  },
] as const;

const INITIAL: FormData = {
  team_name: "", slogan: "", division: "",
  leader_name: "", leader_class: "", leader_email: "", leader_phone: "",
  member2: "", member3: "", member4: "", member5: "",
  agreed: false,
};

// ─── Component chính ─────────────────────────────────────────────────────────
export default function RollerCoasterPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [step, setStep] = useState<"form" | "submitting" | "success">("form");
  const [submitError, setSubmitError] = useState("");
  const [teams, setTeams] = useState<RegisteredTeam[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [registrationId, setRegistrationId] = useState("");

  // Load danh sách đội đã đăng ký
  useEffect(() => {
    fetch("/api/roller-coaster/submit")
      .then(r => r.json())
      .then(d => { if (d.teams) setTeams(d.teams); })
      .finally(() => setLoadingTeams(false));
  }, [step]); // reload sau mỗi lần submit

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // ── Validation ──
  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.team_name.trim()) e.team_name = "Vui lòng nhập tên đội";
    if (!form.division) e.division = "Vui lòng chọn bảng đấu";
    if (!form.leader_name.trim()) e.leader_name = "Vui lòng nhập họ tên đội trưởng";
    if (!form.leader_class.trim()) e.leader_class = "Vui lòng nhập lớp đội trưởng";
    if (!form.leader_email.trim()) e.leader_email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.leader_email))
      e.leader_email = "Email không hợp lệ";
    if (!form.member2.trim()) e.member2 = "Cần ít nhất 3 thành viên (thành viên 2 bắt buộc)";
    if (!form.member3.trim()) e.member3 = "Cần ít nhất 3 thành viên (thành viên 3 bắt buộc)";
    if (!form.agreed) e.agreed = "Vui lòng đọc và xác nhận cam kết";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep("submitting");
    setSubmitError("");
    try {
      const res = await fetch("/api/roller-coaster/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi không xác định");
      setRegistrationId(data.id || "");
      setStep("success");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Lỗi không xác định");
      setStep("form");
    }
  };

  const selectedDiv = DIVISIONS.find(d => d.id === form.division);

  // ─── UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-x-hidden">
      {/* Particle background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 animate-pulse"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 4}s`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 pb-24">

        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Về trang chủ
        </Link>

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Banner */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-3xl blur-2xl opacity-30 scale-110" />
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl px-8 py-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-4xl">🎢</span>
                <span className="text-4xl">📄</span>
                <span className="text-4xl">🏆</span>
              </div>
              <div className="text-xs font-bold tracking-[0.3em] text-cyan-400 uppercase mb-2">
                STEM Challenge — VA Science Club
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                <span className="text-white">PAPER ROLLER COASTER</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                  SHOWDOWN
                </span>
              </h1>
              <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">
                Chào mừng các <span className="text-yellow-400 font-bold">kỹ sư tương lai</span> đến với đấu trường tàu lượn giấy.
                Điền thông tin để hoàn tất đăng ký. <span className="text-red-400 font-semibold">Hạn nộp: hết tuần này.</span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-4 h-4 text-cyan-400" />
              <span><span className="text-white font-bold">{teams.length}</span> đội đã đăng ký</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-4 h-4 text-purple-400" />
              <span>3 – 5 thành viên / đội</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>15:00 Thứ Năm cuối tháng</span>
            </div>
          </div>
        </motion.div>

        {/* ── SUCCESS STATE ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="relative inline-flex items-center justify-center w-28 h-28 mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                <div className="relative w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50">
                  <PartyPopper className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Đăng ký thành công! 🎉</h2>
              <p className="text-slate-400 mb-2">
                Đội <span className="text-cyan-400 font-bold">"{form.team_name}"</span> đã vào danh sách thi đấu.
              </p>
              {registrationId && (
                <p className="text-slate-500 text-sm mb-8">
                  Mã đăng ký: <span className="font-mono text-slate-300">#{registrationId.slice(0, 8).toUpperCase()}</span>
                </p>
              )}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 max-w-md mx-auto mb-8 text-left">
                <div className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Nhắc nhở quan trọng:
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">⚠️</span>Không sử dụng dao rọc giấy (đặc biệt khối 6–7)</li>
                  <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">📦</span>Chỉ dùng vật liệu giấy theo quy định</li>
                  <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">📍</span>Địa điểm: Sảnh Thể Dục Tầng 3</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">🕒</span>Giờ thi: 15:00 Thứ Năm tuần cuối tháng</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setForm(INITIAL); setStep("form"); }}
                  className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors"
                >
                  Đăng ký đội khác
                </button>
                <Link href="/" className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl text-sm font-bold hover:brightness-110 transition-all">
                  Về trang chủ
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── FORM ───────────────────────────────────────────────────── */}
          {(step === "form" || step === "submitting") && (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Error banner */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {submitError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── PHẦN 1: THÔNG TIN ĐỘI ────────────────────────── */}
              <Section icon="🏆" title="Phần 1 — Thông Tin Đội Thi">
                {/* Tên đội */}
                <Field label="Tên đội thi *" error={errors.team_name} hint='Ví dụ: The Gravity Benders, Paper Rockets...'>
                  <input
                    type="text"
                    value={form.team_name}
                    onChange={e => set("team_name", e.target.value)}
                    placeholder="Nhập tên đội sáng tạo của bạn..."
                    className={inputClass(!!errors.team_name)}
                  />
                </Field>

                {/* Slogan */}
                <Field label="Slogan của đội (tuỳ chọn)" hint="Câu khẩu hiệu thể hiện tinh thần đội bạn">
                  <input
                    type="text"
                    value={form.slogan}
                    onChange={e => set("slogan", e.target.value)}
                    placeholder='Ví dụ: "Không có gì là bất khả thi!"'
                    className={inputClass(false)}
                  />
                </Field>

                {/* Bảng đấu */}
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Chọn Bảng Đấu *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {DIVISIONS.map(div => (
                      <button
                        key={div.id}
                        type="button"
                        onClick={() => set("division", div.id)}
                        className={`
                          relative p-4 rounded-xl border-2 text-left transition-all duration-200 group
                          ${form.division === div.id
                            ? `${div.border} ${div.glow} ${div.bg}`
                            : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"
                          }
                        `}
                      >
                        {form.division === div.id && (
                          <CheckCircle className={`absolute top-3 right-3 w-4 h-4 ${div.text}`} />
                        )}
                        <div className="text-2xl mb-2">{div.icon}</div>
                        <div className={`font-black text-base ${form.division === div.id ? div.text : "text-white"}`}>
                          {div.label}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{div.grade}</div>
                        <div className="text-xs text-slate-500 mt-2 leading-relaxed">{div.challenge}</div>
                      </button>
                    ))}
                  </div>
                  {errors.division && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.division}</p>}
                </div>

                {/* Preview bảng đã chọn */}
                <AnimatePresence>
                  {selectedDiv && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center gap-3 ${selectedDiv.bg} border ${selectedDiv.border} rounded-xl px-4 py-3 text-sm`}
                    >
                      <span className="text-xl">{selectedDiv.icon}</span>
                      <div>
                        <span className={`font-bold ${selectedDiv.text}`}>{selectedDiv.label} — {selectedDiv.grade}:</span>
                        <span className="text-slate-300 ml-2">{selectedDiv.challenge}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Section>

              {/* ── PHẦN 2: THÔNG TIN THÀNH VIÊN ─────────────────── */}
              <Section icon="👥" title="Phần 2 — Thông Tin Thành Viên">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-300 text-sm flex items-start gap-2">
                  <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>Mỗi đội từ <strong>3 đến 5 thành viên</strong>. Thành viên 4 và 5 không bắt buộc.</span>
                </div>

                {/* Đội trưởng */}
                <div className="bg-slate-800/60 border border-cyan-500/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-black text-sm text-slate-200 uppercase tracking-widest">Đội trưởng</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Họ và tên *" error={errors.leader_name}>
                      <input type="text" value={form.leader_name} onChange={e => set("leader_name", e.target.value)}
                        placeholder="Họ và tên đầy đủ" className={inputClass(!!errors.leader_name)} />
                    </Field>
                    <Field label="Lớp *" error={errors.leader_class}>
                      <input type="text" value={form.leader_class} onChange={e => set("leader_class", e.target.value)}
                        placeholder="Ví dụ: 9D1, 11A2..." className={inputClass(!!errors.leader_class)} />
                    </Field>
                    <Field label="Email liên lạc *" error={errors.leader_email}>
                      <input type="email" value={form.leader_email} onChange={e => set("leader_email", e.target.value)}
                        placeholder="email@example.com" className={inputClass(!!errors.leader_email)} />
                    </Field>
                    <Field label="Số điện thoại / Zalo">
                      <input type="tel" value={form.leader_phone} onChange={e => set("leader_phone", e.target.value)}
                        placeholder="Số điện thoại (tuỳ chọn)" className={inputClass(false)} />
                    </Field>
                  </div>
                </div>

                {/* Các thành viên khác */}
                <div className="space-y-3">
                  {[
                    { field: "member2" as keyof FormData, label: "Thành viên 2 *", required: true, error: errors.member2 },
                    { field: "member3" as keyof FormData, label: "Thành viên 3 *", required: true, error: errors.member3 },
                    { field: "member4" as keyof FormData, label: "Thành viên 4 (tuỳ chọn)", required: false, error: undefined },
                    { field: "member5" as keyof FormData, label: "Thành viên 5 (tuỳ chọn)", required: false, error: undefined },
                  ].map(m => (
                    <Field key={m.field} label={m.label} error={m.error}
                      hint="Họ tên + Lớp, ví dụ: Nguyễn Văn A - 8B2">
                      <input
                        type="text"
                        value={form[m.field] as string}
                        onChange={e => set(m.field, e.target.value)}
                        placeholder={`Họ tên + Lớp${m.required ? "" : " (không bắt buộc)"}`}
                        className={inputClass(!!m.error)}
                      />
                    </Field>
                  ))}
                </div>
              </Section>

              {/* ── PHẦN 3: CAM KẾT ──────────────────────────────── */}
              <Section icon="📜" title="Phần 3 — Cam Kết & Xác Nhận">
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 text-sm text-slate-300 leading-relaxed">
                  <p className="font-bold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Nội dung cam kết:
                  </p>
                  <p className="italic text-slate-400">
                    "Đội chúng tôi đã đọc kỹ nội dung dự án, cam kết tuân thủ quy định an toàn
                    (đặc biệt về việc <strong className="text-red-400 not-italic">không sử dụng dao rọc giấy</strong> đối với khối 6–7
                    và <strong className="text-yellow-400 not-italic">chỉ dùng vật liệu giấy</strong>) và sẽ tham gia thi đấu trực tiếp vào
                    <strong className="text-cyan-400 not-italic"> 15h00 Thứ Năm tuần cuối tháng tại Sảnh Thể Dục Tầng 3</strong>."
                  </p>
                </div>

                <label className={`
                  flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${form.agreed
                    ? "border-green-500/50 bg-green-500/10"
                    : errors.agreed
                    ? "border-red-500/50 bg-red-500/5"
                    : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"
                  }
                `}>
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                    ${form.agreed ? "bg-green-500 border-green-500" : "border-slate-600"}
                  `}>
                    {form.agreed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input type="checkbox" className="sr-only" checked={form.agreed}
                    onChange={e => set("agreed", e.target.checked)} />
                  <span className={`text-sm font-bold ${form.agreed ? "text-green-400" : "text-slate-300"}`}>
                    Tôi đồng ý với toàn bộ điều khoản và cam kết trên.
                  </span>
                </label>
                {errors.agreed && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.agreed}</p>}
              </Section>

              {/* ── NÚT SUBMIT ───────────────────────────────────── */}
              <motion.button
                type="submit"
                disabled={step === "submitting"}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full relative overflow-hidden py-4 rounded-2xl font-black text-lg tracking-wide transition-all
                  ${step === "submitting"
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 via-purple-600 to-orange-500 text-white hover:brightness-110 shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]"
                  }
                `}
              >
                {step === "submitting" ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang gửi đăng ký...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Rocket className="w-5 h-5" />
                    Đăng Ký Tham Chiến
                    <ChevronRight className="w-5 h-5" />
                  </span>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ── BẢNG DANH SÁCH CÁC ĐỘI ĐÃ ĐĂNG KÝ ─────────────── */}
        {step !== "submitting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-black text-white">
                Danh Sách Đội Đã Đăng Ký
                <span className="ml-3 text-sm font-normal text-slate-400">({teams.length} đội)</span>
              </h2>
            </div>

            {loadingTeams ? (
              <div className="text-center py-12 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                Đang tải danh sách...
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-12 text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                <span className="text-4xl mb-3 block">🎢</span>
                Chưa có đội nào đăng ký — hãy là người đầu tiên!
              </div>
            ) : (
              <div className="space-y-3">
                {teams.map((team, i) => {
                  const div = DIVISIONS.find(d => d.id === team.division);
                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border bg-slate-800/40
                        ${div?.border || "border-slate-700/50"}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
                        ${div?.bg || "bg-slate-700"} ${div?.text || "text-white"}
                      `}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate">{team.team_name}</div>
                        {team.slogan && <div className="text-xs text-slate-500 italic truncate">"{team.slogan}"</div>}
                        <div className="text-xs text-slate-400 mt-0.5">
                          Đội trưởng: {team.leader_name} · {team.leader_class}
                        </div>
                      </div>
                      <div className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${div?.bg} ${div?.text} ${div?.border} border`}>
                        {div?.label || team.division}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Helper components ───────────────────────────────────────────────────────
function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/60 backdrop-blur-sm border border-white/8 rounded-2xl p-6 space-y-5"
    >
      <h2 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-widest border-b border-slate-800 pb-4">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </motion.div>
  );
}

function Field({ label, error, hint, children }: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-slate-300">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {children}
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `
    w-full bg-slate-800/60 border rounded-xl px-4 py-3 text-sm text-slate-100
    placeholder:text-slate-600 outline-none transition-all
    focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50
    ${hasError
      ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
      : "border-slate-700/50 hover:border-slate-600/70"
    }
  `;
}
