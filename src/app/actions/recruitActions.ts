'use server';

import { createClient } from "@/utils/supabase/server";

export interface RecruitmentPayload {
  name: string;
  studentClass: string;
  level: string;
  department: string;
  station1Answer: string;
  station2Answer: string;
  challengeAnswer: string;
  experience: string;
  portfolio: string;
  aspiration: string;
  agentCode: string;
  timestamp: string;
}

export async function saveRecruitment(data: RecruitmentPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('recruitment_submissions')
      .insert({
        name:             data.name,
        student_class:    data.studentClass,
        level:            data.level,
        department:       data.department,
        station1_answer:  data.station1Answer || null,
        station2_answer:  data.station2Answer || null,
        challenge_answer: data.challengeAnswer || null,
        experience:       data.experience,
        portfolio:        data.portfolio || null,
        aspiration:       data.aspiration,
        agent_code:       data.agentCode,
      });

    if (error) {
      console.error('[Recruit] Supabase error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Recruit] Unexpected error:', err);
    return { success: false, error: 'Lỗi hệ thống không xác định.' };
  }
}
