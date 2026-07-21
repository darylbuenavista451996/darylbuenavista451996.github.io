'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { gradeForCode } from '@/lib/classCodes';
import { supabaseServer } from '@/lib/supabase';
import { verifyPassword } from '@/lib/studentAuth';
import { SESSION_COOKIE, serialize, cookieOptions, studentHome } from '@/lib/session';
import { rateLimit, tooManyMessage } from '@/lib/rateLimit';

export type LoginState = { error?: string };

// Email + password login for students who made their own account. Kept separate
// from the class-code login below, which still works for teacher-added students.
export async function loginWithEmail(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const limit = rateLimit('student-login', { limit: 15, windowMs: 60_000 });
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

  // Same message whether the email is unknown or the password is wrong, so we
  // don't reveal which emails have accounts.
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

  redirect(studentHome(student.class as 'G9' | 'G10' | 'M9'));
}

// Class code + student number login. Teacher-adds-first model: a student can
// only log in if the teacher has already added their row. Unknown numbers get
// a plain-language "ask your teacher" message — no self-registration.
export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Slow down number-guessing: 15 tries per minute per IP.
  const limit = rateLimit('student-login', { limit: 15, windowMs: 60_000 });
  if (!limit.ok) return { error: tooManyMessage(limit.retryAfterSec) };

  const classCode = String(formData.get('classCode') ?? '').trim();
  const studentNumber = String(formData.get('studentNumber') ?? '').trim();

  if (!classCode || !studentNumber) {
    return { error: 'Please enter both your class code and your student number.' };
  }

  const grade = gradeForCode(classCode);
  if (!grade) {
    return {
      error:
        "That class code isn't recognized. Check the spelling, or ask your teacher for the correct code.",
    };
  }

  let student;
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('students')
      .select('student_id, name, student_number, class')
      .eq('class', grade)
      .eq('student_number', studentNumber)
      .maybeSingle();
    if (error) throw error;
    student = data;
  } catch {
    return {
      error:
        'We could not reach the server. Please check your connection and try again.',
    };
  }

  if (!student) {
    return {
      error:
        'We could not find that student number for this class. Ask your teacher to add you to the class list, then try again.',
    };
  }

  cookies().set(
    SESSION_COOKIE,
    serialize({
      sid: student.student_id,
      name: student.name,
      student_number: student.student_number,
      class: student.class as 'G9' | 'G10' | 'M9',
    }),
    cookieOptions
  );

  redirect(studentHome(student.class as 'G9' | 'G10' | 'M9'));
}
