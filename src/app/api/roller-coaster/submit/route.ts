import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/roller-coaster/submit
 * Nhận dữ liệu đăng ký tham gia Paper Roller Coaster Showdown
 * Lưu vào bảng roller_coaster_registrations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      team_name, slogan, division,
      leader_name, leader_class, leader_email, leader_phone,
      member2, member3, member4, member5,
      agreed
    } = body;

    // Validate bắt buộc
    if (!team_name || !division || !leader_name || !leader_class || !leader_email || !agreed) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Kiểm tra tên đội trùng
    const { data: existing } = await supabase
      .from("roller_coaster_registrations")
      .select("id")
      .ilike("team_name", team_name.trim())
      .single();

    if (existing) {
      return NextResponse.json({ error: "Tên đội này đã được đăng ký. Vui lòng chọn tên khác!" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("roller_coaster_registrations")
      .insert({
        team_name:    team_name.trim(),
        slogan:       slogan?.trim() || null,
        division,
        leader_name:  leader_name.trim(),
        leader_class: leader_class.trim(),
        leader_email: leader_email.trim(),
        leader_phone: leader_phone?.trim() || null,
        member2:      member2?.trim() || null,
        member3:      member3?.trim() || null,
        member4:      member4?.trim() || null,
        member5:      member5?.trim() || null,
        agreed:       true,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[roller-coaster/submit] DB error:", error);
      return NextResponse.json({ error: "Lỗi ghi dữ liệu: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });

  } catch (err) {
    console.error("[roller-coaster/submit] Unexpected:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * GET /api/roller-coaster/submit
 * Trả về danh sách đội đã đăng ký (không nhạy cảm) để hiển thị public
 */
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("roller_coaster_registrations")
    .select("id, team_name, slogan, division, leader_name, leader_class, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ teams: data });
}
