'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { gradeForCode } from '@/lib/classCodes';
import { supabaseServer } from '@/lib/supabase';
import { SESSION_COOKIE, serialize, cookieOptions } from '@/lib/session';
import { rateLimit, tooManyMessage } from '@/lib/rateLimit';

export type LoginState = { error?: string };

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
      class: student.class as 'G9' | 'G10',
    }),
    cookieOptions
  );

  redirect('/dashboard');
}
