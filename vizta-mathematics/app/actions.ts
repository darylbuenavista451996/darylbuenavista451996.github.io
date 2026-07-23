'use server';

// Record a finished lesson's reward points for the signed-in student. Written
// ONCE per student per lesson: if a row already exists it is left untouched, so
// a student can never change or inflate a recorded score. This is the official
// record the teacher exports to CSV.

import { getSession } from '@/lib/session';
import { supabaseServer } from '@/lib/supabase';

export type RecordState = { ok: boolean; already?: boolean; error?: string };

export async function recordResult(input: {
  lessonId: string;
  points: number;
  quizScore: number;
  tabSwitches: number;
}): Promise<RecordState> {
  const session = getSession();
  if (!session) return { ok: false, error: 'Not signed in.' };

  // The lesson must exist, but it does NOT need to be currently unlocked: a
  // student can only reach a finished state by having taken it while it was
  // open, and they may reconnect to sync after the teacher has locked it again.
  const supabase = supabaseServer();
  try {
    const lesson = await supabase
      .from('math_lessons')
      .select('lesson_id')
      .eq('lesson_id', input.lessonId)
      .maybeSingle();
    if (lesson.error || !lesson.data) {
      return { ok: false, error: 'Unknown lesson.' };
    }

    const { error } = await supabase.from('math_results').insert({
      student_id: session.sid,
      lesson_id: input.lessonId,
      points: Math.max(0, Math.round(input.points)),
      quiz_score: Math.max(0, Math.round(input.quizScore)),
      tab_switches: Math.max(0, Math.round(input.tabSwitches)),
    });
    if (error) {
      // 23505 = unique violation = already recorded. That is success: the first
      // submission stands.
      if (error.code === '23505') return { ok: true, already: true };
      return { ok: false, error: 'Could not save. It will try again when you are online.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not reach the server. It will try again when you are online.' };
  }
}
