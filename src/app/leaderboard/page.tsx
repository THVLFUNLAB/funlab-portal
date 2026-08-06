import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal, Star, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Bảng Xếp Hạng | Funlab Challenge",
  description: "Bảng xếp hạng học sinh Funlab Challenge — xem thứ hạng, điểm số và huy hiệu của toàn trường.",
};

const BADGE_MAP: Record<string, { icon: string; color: string }> = {
  master:   { icon: "🏆", color: "#f59e0b" },
  engineer: { icon: "⚡", color: "#3b82f6" },
  explorer: { icon: "🔭", color: "#22d3ee" },
};

const RANK_STYLE = (rank: number) => {
  if (rank === 1) return { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", text: "#f59e0b" };
  if (rank === 2) return { bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.3)", text: "#94a3b8" };
  if (rank === 3) return { bg: "rgba(180,83,9,0.1)",     border: "rgba(180,83,9,0.3)",    text: "#b45309"  };
  return { bg: "transparent", border: "rgba(255,255,255,0.05)", text: "#64748b" };
};

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string, season?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const filterClass = params.class || "";
  const filterSeason = params.season || "season_2026_1"; // Mặc định Mùa Giải mới nhất

  // Lấy leaderboard từ overall_leaderboard view
  let query = supabase
    .from("overall_leaderboard")
    .select("user_id, total_score, rank")
    .eq("season_id", filterSeason)
    .order("total_score", { ascending: false })
    .limit(100);

  const { data: leaderboard } = await query;

  // Lấy profiles để có tên + lớp
  const userIds = leaderboard?.map((r) => r.user_id) ?? [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, class_name")
    .in("id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"]);

  // Lấy badges
  const { data: badges } = await supabase
    .from("user_badges")
    .select("user_id, badge_id")
    .in("user_id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"]);

  // Merge data
  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const badgeMap   = Object.fromEntries((badges ?? []).map((b) => [b.user_id, b.badge_id]));

  let rows = (leaderboard ?? []).map((r, i) => ({
    ...r,
    rank: i + 1,
    full_name:  profileMap[r.user_id]?.full_name  ?? "Học Sinh",
    class_name: profileMap[r.user_id]?.class_name ?? "—",
    badge_id:   badgeMap[r.user_id] ?? null,
  }));

  // Lọc theo lớp nếu có
  if (filterClass) rows = rows.filter((r) => r.class_name === filterClass);

  // Danh sách lớp để filter
  const allClasses = [...new Set((profiles ?? []).map((p) => p.class_name).filter(Boolean))].sort();

  const topUser = rows[0];

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "var(--font-inter,'Inter',sans-serif)" }}>
      <style>{`
        .row-hover { transition: background 0.15s; }
        .row-hover:hover { background: rgba(8,30,60,0.5) !important; }
        .filter-btn { padding: 6px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: monospace; text-decoration: none; display: inline-block; }
        .filter-btn:hover, .filter-btn.active { border-color: rgba(6,182,212,0.5); color: #22d3ee; background: rgba(6,182,212,0.08); }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(2,6,23,0.95)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Trang chủ
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Trophy size={18} color="#f59e0b" />
          <span style={{ fontFamily: "var(--font-noto-serif,serif)", fontSize: 15, fontWeight: 700, color: "#f59e0b", letterSpacing: 2 }}>
            BẢNG VÀNG XẾP HẠNG
          </span>
        </div>
        <span style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{rows.length} HỌC SINH</span>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 16px" }}>

        {/* Top 3 Podium */}
        {!filterClass && rows.length >= 3 && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap" }}>
            {/* 2nd */}
            <div style={{ textAlign: "center", flex: "0 0 140px" }}>
              <div style={{ fontSize: 36, marginBottom: 4 }}>🥈</div>
              <div style={{ background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.25)", borderRadius: 16, padding: "16px 12px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#475569,#334155)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 16, fontWeight: 900, color: "white" }}>
                  {rows[1]?.full_name.split(' ').map((w:string)=>w[0]).slice(-2).join('').toUpperCase()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 2 }}>{rows[1]?.full_name}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{rows[1]?.class_name}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#94a3b8", fontFamily: "monospace", marginTop: 6 }}>{rows[1]?.total_score}</div>
              </div>
            </div>
            {/* 1st */}
            <div style={{ textAlign: "center", flex: "0 0 160px" }}>
              <div style={{ fontSize: 44, marginBottom: 4, animation: "shimmer 2s infinite" }}>🥇</div>
              <div style={{ background: "rgba(245,158,11,0.1)", border: "2px solid rgba(245,158,11,0.4)", borderRadius: 20, padding: "20px 16px", boxShadow: "0 0 40px rgba(245,158,11,0.15)" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#d97706,#92400e)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 18, fontWeight: 900, color: "white", boxShadow: "0 0 16px rgba(245,158,11,0.4)" }}>
                  {rows[0]?.full_name.split(' ').map((w:string)=>w[0]).slice(-2).join('').toUpperCase()}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fbbf24", marginBottom: 2 }}>{rows[0]?.full_name}</div>
                <div style={{ fontSize: 11, color: "#78350f", fontFamily: "monospace" }}>{rows[0]?.class_name}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#f59e0b", fontFamily: "monospace", marginTop: 6, textShadow: "0 0 12px rgba(245,158,11,0.5)" }}>{rows[0]?.total_score}</div>
              </div>
            </div>
            {/* 3rd */}
            <div style={{ textAlign: "center", flex: "0 0 140px" }}>
              <div style={{ fontSize: 36, marginBottom: 4 }}>🥉</div>
              <div style={{ background: "rgba(180,83,9,0.08)", border: "1px solid rgba(180,83,9,0.25)", borderRadius: 16, padding: "16px 12px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#92400e,#78350f)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 16, fontWeight: 900, color: "white" }}>
                  {rows[2]?.full_name.split(' ').map((w:string)=>w[0]).slice(-2).join('').toUpperCase()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 2 }}>{rows[2]?.full_name}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{rows[2]?.class_name}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#b45309", fontFamily: "monospace", marginTop: 6 }}>{rows[2]?.total_score}</div>
              </div>
            </div>
          </div>
        )}

        {/* Lọc theo mùa giải */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace", marginRight: 4 }}>MÙA GIẢI:</span>
          <Link href={`/leaderboard?season=season_2026_1${filterClass ? '&class=' + filterClass : ''}`} className={`filter-btn ${filterSeason === 'season_2026_1' ? 'active' : ''}`}>Năm Học 2026-2027</Link>
          <Link href={`/leaderboard?season=season_2025_1${filterClass ? '&class=' + filterClass : ''}`} className={`filter-btn ${filterSeason === 'season_2025_1' ? 'active' : ''}`}>Kho Lưu Trữ (25-26)</Link>
        </div>

        {/* Filter theo lớp */}
        {allClasses.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace", marginRight: 4 }}>LỚP:</span>
            <Link href={`/leaderboard?season=${filterSeason}`} className={`filter-btn ${!filterClass ? 'active' : ''}`}>Tất cả</Link>
            {allClasses.map(c => (
              <Link key={c} href={`/leaderboard?season=${filterSeason}&class=${c}`} className={`filter-btn ${filterClass === c ? 'active' : ''}`}>{c}</Link>
            ))}
          </div>
        )}

        {/* Full table */}
        <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 60px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
            {["#", "HỌC SINH", "LỚP", "ĐIỂM", "HUY HIỆU"].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, color: "#475569", fontFamily: "monospace", letterSpacing: 1, textAlign: i >= 2 ? "center" : "left" }}>{h}</span>
            ))}
          </div>

          {rows.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#475569" }}>
              <Trophy size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <p>Chưa có dữ liệu xếp hạng.</p>
            </div>
          ) : (
            rows.map((r) => {
              const s = RANK_STYLE(r.rank);
              const badge = r.badge_id ? BADGE_MAP[r.badge_id] : null;
              return (
                <div key={r.user_id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 60px", padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: s.bg, alignItems: "center" }}>
                  {/* Rank */}
                  <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: r.rank <= 3 ? 18 : 13, color: s.text, textAlign: "left" }}>
                    {r.rank <= 3 ? ["🥇","🥈","🥉"][r.rank-1] : `#${r.rank}`}
                  </div>
                  {/* Name */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: r.rank <= 3 ? s.text : "#e2e8f0" }}>{r.full_name}</div>
                  </div>
                  {/* Class */}
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", background: "rgba(51,65,85,0.4)", padding: "2px 8px", borderRadius: 4 }}>{r.class_name}</span>
                  </div>
                  {/* Score */}
                  <div style={{ textAlign: "center", fontFamily: "monospace", fontWeight: 900, fontSize: 18, color: r.rank === 1 ? "#f59e0b" : r.rank <= 3 ? s.text : "#22d3ee" }}>
                    {r.total_score}
                  </div>
                  {/* Badge */}
                  <div style={{ textAlign: "center", fontSize: 20 }}>
                    {badge ? <span title={r.badge_id ?? ""}>{badge.icon}</span> : ""}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#1e293b", marginTop: 20, fontFamily: "monospace" }}>
          CẬP NHẬT SAU MỖI LẦN NỘP ĐIỂM · FUNLAB CHALLENGE
        </p>
      </div>
    </div>
  );
}
