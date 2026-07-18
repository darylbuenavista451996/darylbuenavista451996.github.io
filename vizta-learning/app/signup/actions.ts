'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { gradeForCode } from '@/lib/classCodes';
import { supabaseServer } from '@/lib/supabase';
import { hashPassword } from '@/lib/studentAuth';
import { SESSION_COOKIE, serialize, cookieOptions } from '@/lib/session';
import { rateLimit, tooManyMessage } from '@/lib/rateLimit';

export type SignupState = { error?: string };

// Students create their own account: name + email + password, plus a class code
// so they're enrolled in the right grade (and randoms can't join). The account
// lives in the students table with a salted password hash — separate from the
// teacher (Supabase Auth) system, so a student can never reach teacher pages.
export async function signUpStudent(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const limit = rateLimit('student-signup', { limit: 10, windowMs: 600_000 });
  if (!limit.ok) return { error: tooManyMessage(limit.retryAfterSec) };

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const classCode = String(formData.get('classCode') ?? '').trim();

  if (!name) return { error: 'Please enter your full name.' };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: 'Please enter a valid email address.' };
  if (password.length < 8) return { error: 'Use a password of at least 8 characters.' };

  const grade = gradeForCode(classCode);
  if (!grade)
    return {
      error:
        "That class code isn't recognized. Check the spelling, or ask your teacher for the correct code.",
    };

  let student;
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('students')
      .insert({
        name,
        email,
        password_hash: hashPassword(password),
        class: grade,
      })
      .select('student_id, name, class')
      .single();
    if (error) {
      if (error.code === '23505')
        return { error: 'An account with that email already exists. Try signing in instead.' };
      throw error;
    }
    student = data;
  } catch {
    return { error: 'We could not create your account. Please try again in a moment.' };
  }

  cookies().set(
    SESSION_COOKIE,
    serialize({
      sid: student.student_id,
      name: student.name,
      student_number: '',
      class: student.class as 'G9' | 'G10',
    }),
    cookieOptions
  );

  redirect('/dashboard');
}
