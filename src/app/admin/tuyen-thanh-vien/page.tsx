import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

interface Submission {
  id: string;
  name: string;
  student_class: string;
  level: string;
  department: string;
  station1_answer: string | null;
  station2_answer: string | null;
  challenge_answer: string | null;
  experience: string | null;
  portfolio: string | null;
  aspiration: string | null;
  agent_code: string | null;
  submitted_at: string;
}

export const metadata = {
  title: "Admin — Danh Sách Đăng Ký Funlab",
};

export default async function RecruitAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; dept?: string; q?: string }>;
}) {
  // Admin auth check via cookie
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_token");
  if (!isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", color: "#f43f5e" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <div style={{ fontSize: 16, marginBottom: 16 }}>TRUY CẬP BỊ TỪ CHỐI — Cần đăng nhập Admin</div>
          <Link href="/admin/login" style={{ color: "#22d3ee", textDecoration: "underline" }}>→ Đến trang đăng nhập Admin</Link>
        </div>
      </div>
    );
  }

  const params = await searchParams;
  const supabase = await createClient();

  // Fetch all submissions
  let query = supabase
    .from("recruitment_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (params.level) query = query.eq("level", params.level);
  if (params.dept)  query = query.eq("department", params.dept);
  if (params.q)     query = query.ilike("name", `%${params.q}%`);

  const { data: submissions, error } = await query.limit(500);

  // Stats
  const { count: totalCount } = await supabase
    .from("recruitment_submissions")
    .select("*", { count: "exact", head: true });

  const { data: deptStats } = await supabase
    .from("recruitment_submissions")
    .select("department");

  const deptCounts: Record<string, number> = {};
  (deptStats ?? []).forEach((r) => {
    deptCounts[r.department] = (deptCounts[r.department] ?? 0) + 1;
  });

  const { data: lvlStats } = await supabase
    .from("recruitment_submissions")
    .select("level");

  const thcsCount = (lvlStats ?? []).filter(r => r.level === "THCS").length;
  const thptCount = (lvlStats ?? []).filter(r => r.level === "THPT").length;

  const allDepts = [...new Set((deptStats ?? []).map(r => r.department))];

  if (error) {
    return (
      <div style={{ padding: 32, background: "#030712", color: "#f87171", fontFamily: "monospace" }}>
        Lỗi tải dữ liệu: {error.message}
      </div>
    );
  }

  const rows = (submissions ?? []) as Submission[];

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@700;900&display=swap');
        .orb { font-family: 'Orbitron', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        table { border-collapse: collapse; width: 100%; }
        th { background: rgba(8,28,60,0.8); color: #67e8f9; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 10px 12px; text-align: left; border-bottom: 1px solid rgba(0,240,255,0.3); white-space: nowrap; }
        td { padding: 10px 12px; border-bottom: 1px solid rgba(30,58,138,0.3); font-size: 13px; vertical-align: top; }
        tr:hover td { background: rgba(8,28,60,0.4); }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
        .badge-thcs { background: rgba(8,51,68,0.6); color: #67e8f9; border: 1px solid #0e4d64; }
        .badge-thpt { background: rgba(6,46,37,0.6); color: #4ade80; border: 1px solid #065f38; }
        .inp-filter { background: rgba(8,15,30,0.8); border: 1px solid rgba(0,240,255,0.25); border-radius: 6px; padding: 8px 12px; color: white; font-size: 13px; outline: none; }
        .inp-filter:focus { border-color: #22d3ee; }
        .stat-card { background: rgba(8,15,30,0.8); border: 1px solid rgba(0,240,255,0.2); border-radius: 10px; padding: 16px 20px; }
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .table-scroll { overflow-x: auto; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ borderBottom: "1px solid rgba(0,240,255,0.2)", background: "rgba(2,6,23,0.9)", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 className="orb" style={{ fontSize: 18, color: "#22d3ee", fontWeight: 900, letterSpacing: 2 }}>
            FUNLAB RECRUIT — ADMIN DASHBOARD
          </h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 2, fontFamily: "monospace" }}>
            Tổng hợp đơn đăng ký tuyển thành viên CLB Khoa Học
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* [M-02] Nút xuất CSV — tải ngay về máy thầy, mở được bằng Excel */}
          <a
            href={`/api/admin/export-recruitment${params.level ? `?level=${params.level}` : ''}${params.dept ? `&dept=${params.dept}` : ''}${params.q ? `&q=${params.q}` : ''}`}
            download
            style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80", fontSize: 12, textDecoration: "none", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 6, background: "rgba(21,128,61,0.1)" }}
          >
            ⬇ Xuất CSV ({rows.length} đơn)
          </a>
          <Link href="/tuyen-thanh-vien" style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid rgba(0,240,255,0.3)", color: "#22d3ee", fontSize: 12, textDecoration: "none", fontFamily: "monospace" }}>
            ← Xem Form Tuyển
          </Link>
          <Link href="/admin/dashboard" style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #334155", color: "#94a3b8", fontSize: 12, textDecoration: "none", fontFamily: "monospace" }}>
            Admin Dashboard
          </Link>
        </div>
      </header>

      <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
          <div className="stat-card">
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>TỔNG ĐƠN</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#22d3ee", fontFamily: "monospace" }}>{totalCount ?? 0}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>THCS</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#67e8f9", fontFamily: "monospace" }}>{thcsCount}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4 }}>THPT</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#4ade80", fontFamily: "monospace" }}>{thptCount}</div>
          </div>
          {Object.entries(deptCounts).slice(0, 4).map(([dept, count]) => (
            <div key={dept} className="stat-card">
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 4, lineHeight: 1.3 }}>{dept.toUpperCase()}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#c084fc", fontFamily: "monospace" }}>{count}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <form method="GET" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, alignItems: "center" }}>
          <input name="q" className="inp-filter" defaultValue={params.q ?? ""} placeholder="🔍 Tìm theo tên..." style={{ minWidth: 200 }} />
          <select name="level" className="inp-filter" defaultValue={params.level ?? ""}>
            <option value="">Tất cả khối</option>
            <option value="THCS">THCS</option>
            <option value="THPT">THPT</option>
          </select>
          <select name="dept" className="inp-filter" defaultValue={params.dept ?? ""}>
            <option value="">Tất cả ban</option>
            {allDepts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button type="submit" style={{ padding: "8px 16px", borderRadius: 6, background: "rgba(0,240,255,0.15)", border: "1px solid #22d3ee", color: "#22d3ee", fontSize: 13, cursor: "pointer" }}>
            Lọc
          </button>
          {(params.q || params.level || params.dept) && (
            <Link href="/admin/tuyen-thanh-vien" style={{ padding: "8px 12px", borderRadius: 6, background: "rgba(244,63,94,0.1)", border: "1px solid #f43f5e", color: "#f87171", fontSize: 13, textDecoration: "none" }}>
              Xóa lọc
            </Link>
          )}
          <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 12, color: "#64748b" }}>
            Hiển thị: <strong style={{ color: "#e2e8f0" }}>{rows.length}</strong> kết quả
          </span>
        </form>

        {/* TABLE */}
        <div className="table-scroll" style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,240,255,0.2)" }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>HỌ TÊN</th>
                <th>LỚP</th>
                <th>KHỐI</th>
                <th>VỊ TRÍ / BAN</th>
                <th className="hide-mobile">TRẠM 1</th>
                <th className="hide-mobile">TRẠM 2</th>
                <th className="hide-mobile">THÁCH</th>
                <th>KINH NGHIỆM</th>
                <th>NGUYỆN VỌNG</th>
                <th className="hide-mobile">PORTFOLIO</th>
                <th>MÃ ĐẶC VỤ</th>
                <th>THỜI GIAN</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={13} style={{ textAlign: "center", padding: 48, color: "#475569", fontFamily: "monospace" }}>
                    Chưa có đơn đăng ký nào.
                  </td>
                </tr>
              ) : rows.map((r, i) => (
                <tr key={r.id}>
                  <td className="mono" style={{ color: "#475569", fontSize: 11 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600, color: "white", whiteSpace: "nowrap" }}>{r.name}</td>
                  <td className="mono" style={{ color: "#94a3b8" }}>{r.student_class}</td>
                  <td>
                    <span className={`badge ${r.level === "THPT" ? "badge-thpt" : "badge-thcs"}`}>{r.level}</span>
                  </td>
                  <td style={{ whiteSpace: "nowrap", color: "#c084fc", fontSize: 12 }}>{r.department}</td>
                  <td className="hide-mobile mono" style={{ fontSize: 11, color: r.station1_answer === "A" ? "#4ade80" : "#fb923c" }}>
                    {r.station1_answer ?? "—"}
                  </td>
                  <td className="hide-mobile mono" style={{ fontSize: 11, color: r.station2_answer === "A" ? "#4ade80" : "#fb923c" }}>
                    {r.station2_answer ?? "—"}
                  </td>
                  <td className="hide-mobile" style={{ fontSize: 11, color: "#94a3b8", maxWidth: 80 }}>
                    {r.challenge_answer ? r.challenge_answer.charAt(0) : "—"}
                  </td>
                  <td style={{ maxWidth: 200, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                    <div style={{ maxHeight: 80, overflow: "hidden", textOverflow: "ellipsis" }}>{r.experience ?? "—"}</div>
                  </td>
                  <td style={{ maxWidth: 200, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                    <div style={{ maxHeight: 80, overflow: "hidden" }}>{r.aspiration ?? "—"}</div>
                  </td>
                  <td className="hide-mobile" style={{ fontSize: 11 }}>
                    {r.portfolio && r.portfolio !== "Không cung cấp" ? (
                      <a href={r.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: "#22d3ee", textDecoration: "none", fontSize: 11 }}>🔗 Xem link</a>
                    ) : <span style={{ color: "#475569" }}>—</span>}
                  </td>
                  <td className="mono" style={{ fontSize: 11, color: "#67e8f9", whiteSpace: "nowrap" }}>{r.agent_code ?? "—"}</td>
                  <td className="mono" style={{ fontSize: 10, color: "#475569", whiteSpace: "nowrap" }}>
                    {new Date(r.submitted_at).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EXPORT HINT */}
        <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(8,28,60,0.5)", border: "1px solid rgba(0,240,255,0.15)", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>
          <span>💡</span>
          <span>Để xuất CSV: Vào Supabase Dashboard → Table Editor → <strong style={{ color: "#94a3b8" }}>recruitment_submissions</strong> → Export CSV</span>
        </div>

      </div>
    </div>
  );
}
