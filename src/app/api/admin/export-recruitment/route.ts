import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * [M-02] GET /api/admin/export-recruitment
 * Xuất toàn bộ danh sách đơn tuyển thành viên ra file CSV.
 * Hỗ trợ filter: ?level=THCS|THPT, ?dept=..., ?q=tên
 */
export async function GET(request: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const adminToken   = cookieStore.get("admin_token")?.value;
  if (!adminToken || adminToken !== "authenticated") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") ?? "";
  const dept  = searchParams.get("dept")  ?? "";
  const q     = searchParams.get("q")     ?? "";

  const supabase = await createClient();

  let query = supabase
    .from("recruitment_submissions")
    .select("*")
    .order("submitted_at", { ascending: false })
    .limit(1000);

  if (level) query = query.eq("level", level);
  if (dept)  query = query.eq("department", dept);
  if (q)     query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;

  if (error) {
    return new NextResponse(`Lỗi: ${error.message}`, { status: 500 });
  }

  // Tạo CSV
  const header = [
    "STT", "Họ và Tên", "Lớp", "Khối", "Ban/Vị Trí",
    "Trạm 1", "Trạm 2", "Thử Thách", "Kinh Nghiệm",
    "Nguyện Vọng", "Portfolio", "Mã Đặc Vụ", "Thời Gian Nộp"
  ];

  const escapeCSV = (val: unknown): string => {
    if (val == null) return "";
    const str = String(val).replace(/"/g, '""');
    return str.includes(",") || str.includes("\n") || str.includes('"')
      ? `"${str}"` : str;
  };

  const csvRows = [
    header.join(","),
    ...(data ?? []).map((row, i) => [
      i + 1,
      escapeCSV(row.name),
      escapeCSV(row.student_class),
      escapeCSV(row.level),
      escapeCSV(row.department),
      escapeCSV(row.station1_answer),
      escapeCSV(row.station2_answer),
      escapeCSV(row.challenge_answer),
      escapeCSV(row.experience),
      escapeCSV(row.aspiration),
      escapeCSV(row.portfolio),
      escapeCSV(row.agent_code),
      escapeCSV(row.submitted_at ? new Date(row.submitted_at).toLocaleString("vi-VN") : ""),
    ].join(",")),
  ];

  const csvContent = "\uFEFF" + csvRows.join("\r\n"); // BOM for Excel Vietnamese support

  const fileName = `funlab-tuyen-thanh-vien-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
