'use server'

import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function verifyAdminCode(formData: FormData) {
  const code = formData.get('code') as string;
  const expectedCode = process.env.NEXT_PUBLIC_ADMIN_CODE || 'funlab2024';
  
  if (code === expectedCode) {
    (await cookies()).set('admin_token', code, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 60 * 60 * 24 // 1 ngày
    });
    return { success: true };
  }
  return { success: false, error: 'Mã truy cập không hợp lệ!' };
}

export async function logoutAdmin() {
  (await cookies()).delete('admin_token');
  return { success: true };
}

export async function getDashboardData() {
  // Bypass RLS 
  const { data: profiles } = await supabaseAdmin.from('profiles').select('*').order('full_name');
  const { data: episodes } = await supabaseAdmin.from('episodes').select('*').order('id');
  
  // Lấy danh sách điểm mốc 0 (Phạt/Thưởng) để thống kê
  const { data: systemScores } = await supabaseAdmin.from('episode_scores').select('*').eq('episode_id', 0).order('created_at', { ascending: false });

  // Lấy tổng điểm từ view
  const { data: leaderboard } = await supabaseAdmin.from('overall_leaderboard').select('*');

  return { profiles, episodes, systemScores, leaderboard };
}

export async function updateUserClass(userId: string, newClass: string) {
  const { error } = await supabaseAdmin.from('profiles').update({ class_name: newClass }).eq('id', userId);
  if (!error) {
    revalidatePath('/', 'layout');
    revalidatePath('/admin/dashboard');
  }
  return { success: !error, error: error?.message };
}

export async function addSystemScore(userId: string, score: number, reason: string) {
  // Ghi chú lý do vào 1 cột note nếu có, mặc định vứt vào episode_id = 0
  const { error } = await supabaseAdmin.from('episode_scores').insert({
    user_id: userId,
    episode_id: 0,
    score: score,
  });
  if (!error) {
    revalidatePath('/', 'layout');
    revalidatePath('/admin/dashboard');
  }
  return { success: !error, error: error?.message };
}

export async function toggleEpisodeStatus(episodeId: number, isActive: boolean) {
  const { error } = await supabaseAdmin.from('episodes').update({ is_active: isActive }).eq('id', episodeId);
  if (!error) {
    revalidatePath('/', 'layout');
    revalidatePath('/admin/dashboard');
  }
  return { success: !error, error: error?.message };
}

export async function upsertEpisodeData(ep: { id: number, title: string, thumbnail_url: string, video_url: string, description: string, is_active: boolean }) {
  const { error } = await supabaseAdmin.from('episodes').upsert({ 
    id: ep.id,
    title: ep.title,
    thumbnail_url: ep.thumbnail_url,
    video_url: ep.video_url,
    description: ep.description,
    is_active: ep.is_active,
    updated_at: new Date().toISOString()
  });
  if (!error) {
    revalidatePath('/', 'layout');
    revalidatePath('/admin/dashboard');
    // Revalidate trang chi tiết tập nếu có
    revalidatePath(`/episode/${ep.id}`);
  }
  return { success: !error, error: error?.message };
}
