'use client';

// Browser-side Supabase client for the teacher login form only. Uses the public
// anon key (safe for the browser). Sessions are stored in cookies by @supabase/ssr
// so the server can read them.
import { createBrowserClient } from '@supabase/ssr';

export function teacherBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  return createBrowserClient(url, anon);
}
