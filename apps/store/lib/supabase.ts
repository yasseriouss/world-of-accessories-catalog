import { createClient } from '@supabase/supabase-js';

// Server-side (service role where needed) + anonymous client for public catalog
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);
