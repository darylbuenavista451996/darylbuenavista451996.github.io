'use server';

import crypto from 'node:crypto';
import { supabaseServer } from '@/lib/supabase';
import { rateLimit, tooManyMessage } from '@/lib/rateLimit';

export type SignupState = { ok?: boolean; error?: string };

function codeOk(provided: string): boolean {
  const expected = process.env.TEACHER_SIGNUP_CODE;
  if (!expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Create a teacher account, gated by a secret teacher code. The code is checked
// server-side, and the account is created (already confirmed) with the
// service-role admin API — so the public can't self-register as a teacher and
// reach students' data.
export async function signUpTeacher(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  // The teacher code is the highest-value guess target, so limit hard:
  // 6 attempts per 10 minutes per IP.
  const limit = rateLimit('teacher-signup', { limit: 6, windowMs: 600_000 });
  if (!limit.ok) return { error: tooManyMessage(limit.retryAfterSec) };

  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const code = String(formData.get('code') ?? '');

  if (!process.env.TEACHER_SIGNUP_CODE) {
    return { error: 'Teacher sign-up is not switched on yet. Ask your admin to set a teacher code.' };
  }
  if (!email || !email.includes('@')) return { error: 'Please enter a valid email.' };
  if (password.length < 8) return { error: 'Use a password of at least 8 characters.' };
  if (!codeOk(code)) return { error: 'That teacher code is incorrect. Ask your school admin for it.' };

  try {
    const supabase = supabaseServer();
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // no confirmation email needed
    });
    if (error) {
      if (/already|exists|registered/i.test(error.message)) {
        return { error: 'An account with that email already exists. Try signing in or resetting your password.' };
      }
      throw error;
    }
  } catch {
    return { error: 'Could not create the account. Please try again in a moment.' };
  }
  return { ok: true };
}
