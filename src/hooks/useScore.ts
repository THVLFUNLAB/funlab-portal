import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useScore() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateUserScore = async (score: number, studentName?: string, episodeId: number = 6) => {
    setIsUpdating(true);
    try {
      const nameToSave = studentName || "Tuyển thủ Funlab";
      const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase");
      
      const newEntry = {
        episode_id: episodeId,
        student_name: nameToSave,
        score: score
      };

      if (isMock) {
        const mockData = { id: Date.now(), ...newEntry, created_at: new Date().toISOString() };
        window.dispatchEvent(new CustomEvent("mock_leaderboard_insert", { detail: mockData }));
      } else {
         const { error } = await supabase.from('leaderboard').insert([newEntry]);
         if (error) console.error("Supabase insert error:", error.message);
      }
    } catch(e) {
      console.error("Error updating score", e);
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateUserScore, isUpdating };
}
