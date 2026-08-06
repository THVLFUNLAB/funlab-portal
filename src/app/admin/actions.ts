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

  // [FIX S-01] Chỉ dùng biến SERVER-ONLY (không có NEXT_PUBLIC_)
  // Biến NEXT_PUBLIC_ bị nhúng vào bundle client → lộ mật khẩu admin
  const expectedCode = process.env.ADMIN_SECRET_CODE;
  if (!expectedCode) {
    console.error('[Admin] ADMIN_SECRET_CODE chưa được cấu hình trong .env.local / Vercel env');
    return { success: false, error: 'Hệ thống chưa được cấu hình. Liên hệ admin.' };
  }

  if (code === expectedCode) {
    (await cookies()).set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 ngày
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

  // Lấy danh sách điểm cống hiến
  const { data: creatorScores } = await supabaseAdmin.from('video_contributors').select('*, profiles(full_name, class_name)');

  return { profiles, episodes, systemScores, leaderboard, creatorScores };
}

export async function updateUserProfile(userId: string, newClass: string, newFullName: string) {
  const { error } = await supabaseAdmin.from('profiles').update({ 
    class_name: newClass,
    full_name: newFullName
  }).eq('id', userId);
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

export async function saveGameCode(episodeId: number, gameCode: string) {
  const { error } = await supabaseAdmin.from('episodes').update({ 
    game_code: gameCode,
    updated_at: new Date().toISOString()
  }).eq('id', episodeId);
  if (!error) {
    revalidatePath(`/episode/${episodeId}`);
    revalidatePath('/admin/dashboard');
  }
  return { success: !error, error: error?.message };
}

export async function addCreatorScore(userId: string, episodeId: number, role: string, bonusScore: number, notes: string) {
  const { error } = await supabaseAdmin.from('video_contributors').insert({
    user_id: userId,
    episode_id: episodeId,
    role: role,
    bonus_score: bonusScore,
    notes: notes
  });
  if (!error) {
    revalidatePath('/', 'layout');
    revalidatePath('/admin/dashboard');
  }
  return { success: !error, error: error?.message };
}

export async function deleteCreatorScore(id: string) {
  const { error } = await supabaseAdmin.from('video_contributors').delete().eq('id', id);
  if (!error) {
    revalidatePath('/', 'layout');
    revalidatePath('/admin/dashboard');
  }
  return { success: !error, error: error?.message };
}
