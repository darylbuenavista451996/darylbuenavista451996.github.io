// Teacher authentication via Supabase Auth (email + password). Teachers are
// adults, so email is fine here — this is entirely separate from student login.
//
// The teacher session lives in cookies managed by @supabase/ssr. Teacher pages
// verify the session server-side with requireTeacher(); the actual data writes
// still go through the service-role client, gated behind that check.

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

function env() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      'Teacher auth needs NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }
  return { url, anon };
}

// Server-side Supabase client bound to the request cookies (for auth only).
export function teacherServerClient() {
  const { url, anon } = env();
  const cookieStore = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        // In a Server Component the cookie store is read-only; ignore. Session
        // refresh writes happen in Server Actions / Route Handlers where it works.
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          /* read-only context */
        }
      },
    },
  });
}

// The signed-in teacher, or null.
export async function getTeacher() {
  const supabase = teacherServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Guard for teacher pages/actions: redirects to the teacher login if not signed in.
export async function requireTeacher() {
  const user = await getTeacher();
  if (!user) redirect('/teacher/login');
  return user;
}
