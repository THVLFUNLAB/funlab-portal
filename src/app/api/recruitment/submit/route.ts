import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/recruitment/submit
 * Nhận dữ liệu từ form tuyển thành viên (HTML standalone)
 * và lưu vào bảng recruitment_submissions trong Supabase
 * Dùng service role key để bypass RLS
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name, student_class, level, registration_type, department,
      vom_understanding, station1_answer, station2_answer, challenge_answer,
      experience, portfolio, aspiration, agent_code
    } = body;

    // Validate bắt buộc
    if (!name || !student_class || !department) {
      console.error("[recruitment/submit] Missing required fields:", { name, student_class, department });
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    console.log("[recruitment/submit] Inserting:", { name, student_class, level, department, agent_code });

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("recruitment_submissions")
      .insert({
        name:              name,
        student_class:     student_class,
        level:             level             || "THCS",
        department:        department,
        registration_type: registration_type  || "VÒM KHOA HỌC",
        vom_understanding: vom_understanding  || null,
        station1_answer:   station1_answer   || null,
        station2_answer:   station2_answer   || null,
        challenge_answer:  challenge_answer  || null,
        experience:        experience        || null,
        portfolio:         portfolio         || null,
        aspiration:        aspiration        || null,
        agent_code:        agent_code        || null,
      })
      .select("id, agent_code")
      .single();

    if (error) {
      console.error("[recruitment/submit] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Lỗi ghi dữ liệu: " + error.message },
        { status: 500 }
      );
    }

    console.log("[recruitment/submit] Success, id:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });

  } catch (err) {
    console.error("[recruitment/submit] Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
