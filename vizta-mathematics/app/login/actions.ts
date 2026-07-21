'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase';
import { verifyPassword } from '@/lib/studentAuth';
import { SESSION_COOKIE, serialize, cookieOptions } from '@/lib/session';
import { rateLimit, tooManyMessage } from '@/lib/rateLimit';

export type LoginState = { error?: string };

// Email + password login. Accounts are shared with the rest of Vizta Learning
// (same students table), so a student signs in with the email and password they
// registered with.
export async function loginWithEmail(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const limit = rateLimit('math-login', { limit: 15, windowMs: 60_000 });
  if (!limit.ok) return { error: tooManyMessage(limit.retryAfterSec) };

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Please enter your email and password.' };

  let student;
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('students')
      .select('student_id, name, student_number, class, password_hash')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    student = data;
  } catch {
    return { error: 'We could not reach the server. Please try again.' };
  }

  // Same message whether the email is unknown or the password is wrong.
  if (!student || !verifyPassword(password, student.password_hash as string | null)) {
    return { error: 'That email or password is incorrect. Please try again.' };
  }

  cookies().set(
    SESSION_COOKIE,
    serialize({
      sid: student.student_id,
      name: student.name,
      student_number: student.student_number ?? '',
      class: student.class as 'G9' | 'G10' | 'M9',
    }),
    cookieOptions
  );

  redirect('/');
}
