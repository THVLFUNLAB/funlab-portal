import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { User, Trophy, Star, Zap, BookOpen, ArrowLeft, Edit3, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Hồ Sơ Cá Nhân | Funlab",
  description: "Xem điểm số, huy hiệu và lịch sử thi đấu của bạn trên Funlab Challenge.",
};

import { calculateRank, RankInfo } from "@/utils/rankHelper";

// Mảng tĩnh phục vụ hiển thị toàn bộ huy hiệu
const ALL_RANKS = [
  { id: "rookie", label: "Tân Binh Khám Phá", min: 0, icon: "🔰", color: "#94a3b8" },
  { id: "explorer", label: "Nhà Thám Hiểm Sơ Cấp", min: 100, icon: "🔭", color: "#34d399" },
  { id: "engineer", label: "Kỹ Sư Sáng Tạo", min: 250, icon: "⚡", color: "#60a5fa" },
  { id: "master", label: "Chuyên Gia Funlab", min: 450, icon: "🔮", color: "#c084fc" },
  { id: "ambassador", label: "Đại Sứ Khoa Học", min: 700, icon: "🌌", color: "#f59e0b" },
  { id: "legend", label: "Huyền Thoại STEM", min: 1000, icon: "👑", color: "#ef4444" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

// ── Page ──────────────────────────────────────────────────────
export default async function ProfilePage() {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  // Lấy profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Lấy điểm theo từng tập
  const { data: episodeScores } = await supabase
    .from("episode_scores")
    .select("episode_id, score, time_in_seconds, level, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Lấy tổng điểm năm + ranking từ leaderboard
  const { data: yearlyRow } = await supabase
    .from("overall_leaderboard")
    .select("total_score, rank")
    .eq("user_id", user.id)
    .maybeSingle();

  const totalScore = yearlyRow?.total_score ?? episodeScores?.reduce((s, r) => s + r.score, 0) ?? 0;
  const rank = yearlyRow?.rank ?? null;
  const rankInfo = calculateRank(totalScore);
  const episodeCount = episodeScores?.length ?? 0;
  const avgScore = episodeCount > 0 ? Math.round(totalScore / episodeCount) : 0;

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Học Sinh";
  const className   = profile?.class_name || "—";
  const initials    = getInitials(displayName);

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: float 4s ease-in-out infinite; }
        .card { background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; }
        .stat-card { background: rgba(8,15,30,0.8); border: 1px solid rgba(0,240,255,0.15); border-radius: 12px; padding: 20px; }
        .ep-row:hover { background: rgba(8,28,60,0.4); }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(2,6,23,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
          <ArrowLeft size={16} />
          Trang chủ
        </Link>
        <span style={{ fontFamily: "var(--font-noto-serif, serif)", fontSize: 15, fontWeight: 700, color: "#22d3ee", letterSpacing: 2 }}>
          HỒ SƠ CÁ NHÂN
        </span>
        <Link href="/profile/edit" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: 13, border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 8 }}>
          <Edit3 size={13} />
          Chỉnh sửa
        </Link>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>

        {/* ── AVATAR + INFO ── */}
        <div className="card" style={{ padding: "32px", marginBottom: 24, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
          {/* Avatar */}
          <div className="float" style={{ flexShrink: 0 }}>
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "linear-gradient(135deg, #0e7490, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 900, color: "white",
              boxShadow: "0 0 30px rgba(6,182,212,0.4), 0 0 0 3px rgba(6,182,212,0.2)",
              fontFamily: "monospace",
            }}>
              {initials}
            </div>
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", margin: "0 0 4px" }}>
              {displayName}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: "#94a3b8", background: "rgba(51,65,85,0.5)", padding: "3px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)" }}>
                📚 {className}
              </span>
              <span style={{ fontSize: 12, color: "#64748b", padding: "3px 10px", fontFamily: "monospace" }}>
                {user.email}
              </span>
            </div>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, border: `1px solid ${ALL_RANKS.find(r => r.id === rankInfo.id)?.color}40`, background: `${ALL_RANKS.find(r => r.id === rankInfo.id)?.color}15`, fontSize: 13, fontWeight: 700, color: ALL_RANKS.find(r => r.id === rankInfo.id)?.color }}>
              <span>{ALL_RANKS.find(r => r.id === rankInfo.id)?.icon}</span>
              {rankInfo.badge}
              {rankInfo.stars > 0 && <span style={{marginLeft: 4}}> {'⭐'.repeat(rankInfo.stars)} </span>}
            </div>
          </div>

          {/* Score big */}
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "monospace", color: "#22d3ee", lineHeight: 1, textShadow: "0 0 30px rgba(34,211,238,0.5)" }}>
              {totalScore}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 2, marginTop: 4, fontFamily: "monospace" }}>
              TỔNG ĐIỂM
            </div>
            {rank && (
              <div style={{ marginTop: 8, fontSize: 13, color: "#f59e0b", fontWeight: 700 }}>
                🏅 Hạng #{rank}
              </div>
            )}
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <BookOpen size={16} color="#22d3ee" />
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>Tập đã chơi</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#22d3ee", fontFamily: "monospace" }}>{episodeCount}</div>
          </div>
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Zap size={16} color="#a78bfa" />
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>Điểm TB/tập</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#a78bfa", fontFamily: "monospace" }}>{avgScore}</div>
          </div>
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Trophy size={16} color="#f59e0b" />
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>Xếp hạng</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#f59e0b", fontFamily: "monospace" }}>{rank ? `#${rank}` : "—"}</div>
          </div>
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Star size={16} color="#4ade80" />
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>Điểm tối đa</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#4ade80", fontFamily: "monospace" }}>{episodeCount * 50}</div>
          </div>
        </div>

        {/* ── BADGES ── */}
        <div className="card" style={{ padding: "24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20, fontFamily: "monospace" }}>
            🎖️ Huy Hiệu
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {ALL_RANKS.map((b) => {
              const unlocked = totalScore >= b.min;
              return (
                <div key={b.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 18px", borderRadius: 12,
                  background: unlocked ? `${b.color}12` : "rgba(30,41,59,0.4)",
                  border: `1px solid ${unlocked ? b.color + "40" : "rgba(255,255,255,0.05)"}`,
                  opacity: unlocked ? 1 : 0.4,
                  filter: unlocked ? "none" : "grayscale(1)",
                  transition: "all 0.3s",
                }}>
                  <span style={{ fontSize: 28 }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: unlocked ? b.color : "#475569" }}>{b.label}</div>
                    <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>
                      {unlocked ? "✅ Đã đạt" : `Cần ${b.min} HP`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── EPISODE HISTORY ── */}
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20, fontFamily: "monospace" }}>
            📋 Lịch Sử Thi Đấu
          </h2>
          {episodeScores && episodeScores.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {episodeScores.map((ep, i) => (
                <div key={i} className="ep-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
                      {ep.episode_id}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Tập {ep.episode_id}</div>
                      <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>
                        {new Date(ep.created_at).toLocaleDateString("vi-VN")}
                        {ep.time_in_seconds ? ` · ${Math.floor(ep.time_in_seconds / 60)}ph${ep.time_in_seconds % 60}s` : ""}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: ep.score >= 40 ? "#4ade80" : ep.score >= 20 ? "#f59e0b" : "#f87171", fontFamily: "monospace" }}>
                      {ep.score}<span style={{ fontSize: 13, color: "#64748b" }}>/50</span>
                    </div>
                    {ep.level && (
                      <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>{ep.level}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎮</div>
              <p style={{ fontSize: 14 }}>Bạn chưa hoàn thành tập nào.<br />Hãy bắt đầu thi đấu ngay!</p>
              <Link href="/" style={{ display: "inline-block", marginTop: 16, padding: "10px 24px", borderRadius: 10, background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", color: "#22d3ee", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                → Vào Funlab Challenge
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
