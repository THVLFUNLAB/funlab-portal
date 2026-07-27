import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client dùng SERVICE_ROLE key
 * Dùng cho API routes server-side cần bypass RLS (insert không cần auth)
 * KHÔNG dùng ở phía client (browser)
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var');
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
