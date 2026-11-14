// Server-side data access for the Mathematics app. Uses the service-role client
// (never reaches the browser), scoped in code to the signed-in student.

import { supabaseServer } from './supabase';
import { LESSONS } from './lessons';

// Make sure every lesson in the registry has a row in math_lessons (locked by
// default). Insert-and-ignore, so existing rows and their unlock state are never
// touched. This lets a newly deployed lesson appear in the teacher dashboard
// with no manual SQL. Error-tolerant: does nothing if the table is missing.
export async function ensureLessonsRegistered(): Promise<void> {
  try {
    const supabase = supabaseServer();
    const withTerm = await supabase
      .from('math_lessons')
      .upsert(
        LESSONS.map((l) => ({ lesson_id: l.id, title: l.title, order: l.order, term: l.term, unlocked: false })),
        { onConflict: 'lesson_id', ignoreDuplicates: true }
      );
    if (withTerm.error) {
      // The term column is not there yet (migration 0012 not run): register without it.
      await supabase
        .from('math_lessons')
        .upsert(
          LESSONS.map((l) => ({ lesson_id: l.id, title: l.title, order: l.order, unlocked: false })),
          { onConflict: 'lesson_id', ignoreDuplicates: true }
        );
    }
  } catch {
    /* table not there yet; nothing to do */
  }
}

// Which terms are open to students (the teacher's switch on the Mathematics tab).
// A closed term cannot be entered even if its lessons are unlocked. If the table is
// not there yet or cannot be read, fall back to the intended setup: Term 1 closed,
// Term 2 open.
export async function getTermStates(): Promise<Record<number, boolean>> {
  const fallback: Record<number, boolean> = { 1: false, 2: true };
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.from('math_terms').select('term, unlocked');
    if (error || !data || data.length === 0) return fallback;
    const out = { ...fallback };
    for (const r of data) out[r.term as number] = Boolean(r.unlocked);
    return out;
  } catch {
    return fallback;
  }
}

// Whether a lesson is open for students. Lessons are locked by default; the
// teacher unlocks them from the dashboard. Error-tolerant: if the table is not
// there yet (migration not run) or the read fails, the lesson stays LOCKED, so
// nothing is answerable before the teacher is ready.
export async function getLessonUnlocked(lessonId: string): Promise<boolean> {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('math_lessons')
      .select('unlocked')
      .eq('lesson_id', lessonId)
      .maybeSingle();
    if (error) return false;
    return Boolean(data?.unlocked);
  } catch {
    return false;
  }
}

// Whether this student has already submitted this lesson (results are final once
// written). Used to show the recorded score instead of letting them redo it.
export async function getExistingResult(
  studentId: string,
  lessonId: string,
): Promise<{ points: number; quiz_score: number } | null> {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('math_results')
      .select('points, quiz_score')
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId)
      .maybeSingle();
    if (error || !data) return null;
    return { points: data.points as number, quiz_score: data.quiz_score as number };
  } catch {
    return null;
  }
}
