import { createClient } from '@supabase/supabase-js';

// Fallback to a syntactically valid URL if user hasn't set it yet to prevent createClient from throwing an error.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseUrl = (url && url.startsWith('http')) ? url : 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
