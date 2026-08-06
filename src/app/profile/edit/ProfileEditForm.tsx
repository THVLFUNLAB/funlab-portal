'use client';

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";
import Link from "next/link";
import { ArrowLeft, User, BookOpen, Save, AlertCircle } from "lucide-react";

const CLASS_OPTIONS = [
  "6A1","6A2","6A3","6A4","6A5","6A6",
  "7B1","7B2","7B3","7B4","7B5","7B6",
  "8C1","8C2","8C3","8C4","8C5","8C6",
  "9D1","9D2","9D3","9D4","9D5",
  "10A1","10A2","10A3","10A4",
  "11B1","11B2",
  "12C1","12C2","12C3",
];

interface Props {
  defaultName: string;
  defaultClass: string;
}

export default function ProfileEditForm({ defaultName, defaultClass }: Props) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    null
  );

  const initials = defaultName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() || '?';

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "var(--font-inter,'Inter',sans-serif)", display: "flex", flexDirection: "column" }}>
      <style>{`
        .input-field { width:100%;padding:12px 16px;border-radius:10px;background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.1);color:white;font-size:15px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s;box-sizing:border-box; }
        .input-field:focus { border-color:rgba(6,182,212,0.6);box-shadow:0 0 0 3px rgba(6,182,212,0.1); }
        .input-field::placeholder { color:#475569; }
        .btn-save { display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px 24px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,#0891b2,#1d4ed8);color:white;font-size:15px;font-weight:700;font-family:inherit;transition:all .2s;box-shadow:0 6px 20px rgba(6,182,212,0.3); }
        .btn-save:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 10px 28px rgba(6,182,212,0.4); }
        .btn-save:disabled { opacity:0.6;cursor:not-allowed; }
        select.input-field option { background:#0f172a; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom:"1px solid rgba(255,255,255,0.07)",padding:"14px 24px",display:"flex",alignItems:"center",gap:16,background:"rgba(2,6,23,0.9)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50 }}>
        <Link href="/profile" style={{ display:"flex",alignItems:"center",gap:6,color:"#94a3b8",textDecoration:"none",fontSize:14,fontWeight:500,padding:"6px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)" }}>
          <ArrowLeft size={15} /> Hồ sơ
        </Link>
        <span style={{ fontFamily:"var(--font-noto-serif,serif)",fontSize:15,fontWeight:700,color:"#22d3ee",letterSpacing:2 }}>
          CHỈNH SỬA HỒ SƠ
        </span>
      </header>

      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 16px" }}>
        <div style={{ width:"100%",maxWidth:460 }}>

          {/* Avatar */}
          <div style={{ textAlign:"center",marginBottom:32 }}>
            <div style={{ width:72,height:72,borderRadius:"50%",margin:"0 auto 12px",background:"linear-gradient(135deg,#0e7490,#1d4ed8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:900,color:"white",fontFamily:"monospace",boxShadow:"0 0 24px rgba(6,182,212,0.3)" }}>
              {initials}
            </div>
            <p style={{ color:"#64748b",fontSize:13 }}>Ảnh đại diện tự động từ tên</p>
          </div>

          {/* Card */}
          <div style={{ background:"rgba(15,23,42,0.7)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"32px",backdropFilter:"blur(12px)" }}>

            {/* Error banner */}
            {state?.error && (
              <div style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,marginBottom:20,color:"#f87171",fontSize:14 }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {state.error}
              </div>
            )}

            <form action={formAction}>
              {/* Họ tên */}
              <div style={{ marginBottom:22 }}>
                <label style={{ display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:1 }}>
                  <User size={13} color="#22d3ee" /> Họ và Tên
                </label>
                <input name="full_name" type="text" className="input-field" defaultValue={defaultName} placeholder="Nhập họ và tên đầy đủ..." maxLength={60} required autoFocus />
                <p style={{ fontSize:11,color:"#475569",marginTop:6 }}>Tên hiển thị trên bảng xếp hạng</p>
              </div>

              {/* Lớp */}
              <div style={{ marginBottom:28 }}>
                <label style={{ display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:1 }}>
                  <BookOpen size={13} color="#a78bfa" /> Lớp
                </label>
                <select name="class_name" className="input-field" defaultValue={defaultClass} required style={{ appearance:"none" }}>
                  <option value="" disabled>-- Chọn lớp --</option>
                  {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ height:1,background:"rgba(255,255,255,0.06)",marginBottom:24 }} />

              <button type="submit" className="btn-save" disabled={pending}>
                {pending
                  ? <><div style={{ width:16,height:16,border:"2px solid white",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} /> Đang lưu...</>
                  : <><Save size={16} /> Lưu Thay Đổi</>
                }
              </button>

              <Link href="/profile" style={{ display:"flex",alignItems:"center",justifyContent:"center",marginTop:12,padding:"11px",borderRadius:12,background:"rgba(30,41,59,0.6)",color:"#64748b",textDecoration:"none",fontSize:14,fontWeight:500,border:"1px solid rgba(255,255,255,0.06)" }}>
                Huỷ
              </Link>
            </form>
          </div>

          <p style={{ textAlign:"center",fontSize:11,color:"#334155",marginTop:16,fontFamily:"monospace" }}>
            FUNLAB PORTAL · DỮ LIỆU ĐƯỢC MÃ HÓA
          </p>
        </div>
      </div>
    </div>
  );
}
