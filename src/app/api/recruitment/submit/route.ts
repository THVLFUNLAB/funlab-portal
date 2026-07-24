import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/recruitment/submit
 * Nhận dữ liệu từ form tuyển thành viên mới (HTML standalone)
 * và lưu vào bảng recruitment_submissions trong Supabase
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
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("recruitment_submissions")
      .insert({
        name:             name,
        student_class:    student_class,
        level:            level            || "THCS",
        department:       department,
        registration_type: registration_type || "VÒM KHOA HỌC",
        vom_understanding: vom_understanding  || null,
        station1_answer:  station1_answer   || null,
        station2_answer:  station2_answer   || null,
        challenge_answer: challenge_answer  || null,
        experience:       experience        || null,
        portfolio:        portfolio         || null,
        aspiration:       aspiration        || null,
        agent_code:       agent_code        || null,
      });

    if (error) {
      console.error("[recruitment/submit] Supabase error:", error.message);
      // Không fail request — form đã lưu local, đây là backup
      return NextResponse.json({ warning: error.message }, { status: 200 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[recruitment/submit] Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
