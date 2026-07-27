import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/recruitment/submit
 * Nhận dữ liệu từ form tuyển thành viên (HTML standalone)
 * Dùng service role key để bypass RLS
 * Tự động retry nếu cột migration chưa được thêm vào DB
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name, student_class, level, registration_type, department,
      vom_understanding, station1_answer, station2_answer, challenge_answer,
      experience, portfolio, aspiration, agent_code
    } = body;

    if (!name || !student_class || !department) {
      console.error("[recruitment/submit] Missing required fields:", { name, student_class, department });
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    console.log("[recruitment/submit] Inserting:", { name, student_class, level, department, agent_code });

    const supabase = createAdminClient();

    // Build insert — bao gồm cả cột migration (registration_type, vom_understanding)
    const insertData: Record<string, string | null> = {
      name:             name,
      student_class:    student_class,
      level:            level        || "THCS",
      department:       department,
      registration_type: registration_type || "VOM KHOA HOC",
      vom_understanding: vom_understanding  || null,
      station1_answer:  station1_answer  || null,
      station2_answer:  station2_answer  || null,
      challenge_answer: challenge_answer || null,
      experience:       experience       || null,
      portfolio:        portfolio        || null,
      aspiration:       aspiration       || null,
      agent_code:       agent_code       || null,
    };

    let { data, error } = await supabase
      .from("recruitment_submissions")
      .insert(insertData)
      .select("id, agent_code")
      .single();

    // Nếu cột migration chưa tồn tại trong DB, retry không có cột đó
    if (error && (error.message.includes("registration_type") || error.message.includes("vom_understanding"))) {
      console.warn("[recruitment/submit] Optional columns missing, retrying without them:", error.message);
      const fallbackData: Record<string, string | null> = {
        name:             insertData.name,
        student_class:    insertData.student_class,
        level:            insertData.level,
        department:       insertData.department,
        station1_answer:  insertData.station1_answer,
        station2_answer:  insertData.station2_answer,
        challenge_answer: insertData.challenge_answer,
        experience:       insertData.experience,
        portfolio:        insertData.portfolio,
        aspiration:       insertData.aspiration,
        agent_code:       insertData.agent_code,
      };
      const retry = await supabase
        .from("recruitment_submissions")
        .insert(fallbackData)
        .select("id, agent_code")
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("[recruitment/submit] Supabase insert error:", error);
      return NextResponse.json({ error: "Lỗi ghi dữ liệu: " + error.message }, { status: 500 });
    }

    console.log("[recruitment/submit] Success, id:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });

  } catch (err) {
    console.error("[recruitment/submit] Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
