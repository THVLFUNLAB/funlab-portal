import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile } from "./actions";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, User, BookOpen, Save } from "lucide-react";

export const metadata: Metadata = {
  title: "Chỉnh Sửa Hồ Sơ | Funlab",
};

const CLASS_OPTIONS = [
  "6A1","6A2","6A3","6A4","6A5","6A6","6A7","6A8","6A9","6A10",
  "7A1","7A2","7A3","7A4","7A5","7A6","7A7","7A8","7A9","7A10",
  "8A1","8A2","8A3","8A4","8A5","8A6","8A7","8A8","8A9","8A10",
  "9A1","9A2","9A3","9A4","9A5","9A6","9A7","9A8","9A9","9A10",
  "10A1","10A2","10A3","10A4","10A5","10A6","10A7","10A8","10A9","10A10",
  "11A1","11A2","11A3","11A4","11A5","11A6","11A7","11A8","11A9","11A10",
  "12A1","12A2","12A3","12A4","12A5","12A6","12A7","12A8","12A9","12A10",
  "12C1","12C2","12C3","12C4","12C5","12C6","12C7",
];

export default async function ProfileEditPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile/edit');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, class_name')
    .eq('id', user.id)
    .single();

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "var(--font-inter, 'Inter', sans-serif)", display: "flex", flexDirection: "column" }}>
      <style>{`
        .input-field {
          width: 100%; padding: 12px 16px; border-radius: 10px;
          background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1);
          color: white; font-size: 15px; font-family: inherit; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .input-field:focus { border-color: rgba(6,182,212,0.6); box-shadow: 0 0 0 3px rgba(6,182,212,0.1); }
        .input-field::placeholder { color: #475569; }
        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px 24px; border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #0891b2, #1d4ed8);
          color: white; font-size: 15px; font-weight: 700; font-family: inherit;
          transition: all 0.2s; box-shadow: 0 6px 20px rgba(6,182,212,0.3);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(6,182,212,0.4); }
        .btn-primary:active { transform: translateY(0); }
        select.input-field option { background: #0f172a; }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, background: "rgba(2,6,23,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.2s" }}>
          <ArrowLeft size={15} />
          Hồ sơ
        </Link>
        <span style={{ fontFamily: "var(--font-noto-serif, serif)", fontSize: 15, fontWeight: 700, color: "#22d3ee", letterSpacing: 2 }}>
          CHỈNH SỬA HỒ SƠ
        </span>
      </header>

      {/* Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>

          {/* Avatar preview */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", margin: "0 auto 12px",
              background: "linear-gradient(135deg, #0e7490, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 900, color: "white", fontFamily: "monospace",
              boxShadow: "0 0 24px rgba(6,182,212,0.3)",
            }}>
              {(profile?.full_name || '?').split(' ').map((w: string) => w[0]).slice(-2).join('').toUpperCase()}
            </div>
            <p style={{ color: "#64748b", fontSize: 13 }}>Ảnh đại diện tự động từ tên của bạn</p>
          </div>

          {/* Card */}
          <div style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px", backdropFilter: "blur(12px)" }}>
            <form action={updateProfile}>

              {/* Họ tên */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                  <User size={13} color="#22d3ee" />
                  Họ và Tên
                </label>
                <input
                  name="full_name"
                  type="text"
                  className="input-field"
                  defaultValue={profile?.full_name || ''}
                  placeholder="Nhập họ và tên đầy đủ..."
                  maxLength={60}
                  required
                  autoFocus
                />
                <p style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>Tên này sẽ hiển thị trên bảng xếp hạng</p>
              </div>

              {/* Lớp */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                  <BookOpen size={13} color="#a78bfa" />
                  Lớp
                </label>
                <select
                  name="class_name"
                  className="input-field"
                  defaultValue={profile?.class_name || ''}
                  required
                  style={{ appearance: "none" }}
                >
                  <option value="" disabled>-- Chọn lớp --</option>
                  {CLASS_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />

              {/* Buttons */}
              <button type="submit" className="btn-primary">
                <Save size={16} />
                Lưu Thay Đổi
              </button>

              <Link href="/profile" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 12, padding: "11px", borderRadius: 12, background: "rgba(30,41,59,0.6)", color: "#64748b", textDecoration: "none", fontSize: 14, fontWeight: 500, border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s" }}>
                Huỷ
              </Link>
            </form>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 16, fontFamily: "monospace" }}>
            FUNLAB PORTAL · DỮ LIỆU ĐƯỢC MÃ HÓA
          </p>
        </div>
      </div>
    </div>
  );
}
