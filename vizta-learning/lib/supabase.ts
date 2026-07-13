// Server-only Supabase client.
//
// For our custom student login (class code + student number, no Supabase Auth),
// all student-data reads and writes happen on the server through this client,
// scoped by the signed session cookie. The service-role key therefore NEVER
// reaches the browser. Import this only from server code (Server Components,
// Server Actions, Route Handlers) — never from a "use client" file.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function supabaseServer(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase env missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.'
    );
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
