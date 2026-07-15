'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { supabaseServer } from '@/lib/supabase';
import {
  getLessonForStudent,
  getSubmission,
  getQuizKey,
  submissionKind,
  REFLECTION_MIN_WORDS,
  gradePractice,
  PRACTICE_TOTAL,
  PRACTICE_MIN_WORDS,
} from '@/lib/data';

export type SubmitState = {
  ok?: boolean;
  error?: string;
  savedAt?: string;
};

function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Save an activity submission. Text, link, or image URL only — never a file.
export async function submitActivity(
  activityId: string,
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const session = getSession();
  if (!session) return { error: 'Your session ended. Please sign in again.' };

  const result = await getLessonForStudent(session.sid, session.class, activityId);
  if (!result) return { error: 'We could not find that lesson.' };
  if (result.lesson.locked)
    return { error: 'Finish the earlier lessons first — this one is locked.' };

  // Can't edit after a teacher has graded it.
  const existing = await getSubmission(session.sid, activityId);
  if (existing?.status === 'Graded')
    return { error: 'This has already been graded, so it can no longer be changed.' };

  const kind = submissionKind(result.lesson.activity.submission_type);
  const content = String(formData.get('content') ?? '').trim();

  if (!content) {
    return {
      error:
        kind === 'text'
          ? 'Please write your answer before submitting.'
          : 'Please paste your link before submitting.',
    };
  }
  if ((kind === 'link' || kind === 'image') && !isHttpUrl(content)) {
    return {
      error:
        "That doesn't look like a valid link. It should start with http:// or https://.",
    };
  }
  if (kind === 'text' && content.length > 8000) {
    return { error: 'That answer is very long. Please keep it under 8000 characters.' };
  }

  try {
    const supabase = supabaseServer();
    const { error } = await supabase.from('submissions').upsert(
      {
        student_id: session.sid,
        activity_id: activityId,
        content,
        status: 'Submitted',
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,activity_id' }
    );
    if (error) throw error;
  } catch {
    return { error: 'We could not save your submission. Please try again in a moment.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/lesson/${activityId}`);
  return { ok: true, savedAt: new Date().toISOString() };
}

export type ReflectionState = { ok?: boolean; error?: string; done?: boolean };

// Save a student's reflection and auto-credit it when it's a genuine response
// (at least REFLECTION_MIN_WORDS words). No AI — just a length check in code.
export async function saveReflection(
  activityId: string,
  _prev: ReflectionState,
  formData: FormData
): Promise<ReflectionState> {
  const session = getSession();
  if (!session) return { error: 'Your session ended. Please sign in again.' };

  const result = await getLessonForStudent(session.sid, session.class, activityId);
  if (!result) return { error: 'We could not find that lesson.' };
  if (result.lesson.locked) return { error: 'This lesson is locked.' };

  const text = String(formData.get('reflection') ?? '').trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  if (words < REFLECTION_MIN_WORDS) {
    return {
      error: `Write a little more — at least ${REFLECTION_MIN_WORDS} words (you have ${words}).`,
    };
  }

  try {
    const supabase = supabaseServer();
    const { data: existing } = await supabase
      .from('submissions')
      .select('submission_id')
      .eq('student_id', session.sid)
      .eq('activity_id', activityId)
      .maybeSingle();

    const res = existing
      ? await supabase
          .from('submissions')
          .update({ reflection: text })
          .eq('student_id', session.sid)
          .eq('activity_id', activityId)
      : await supabase.from('submissions').insert({
          student_id: session.sid,
          activity_id: activityId,
          reflection: text,
          status: 'Not started', // reflection alone does not submit the activity
        });
    if (res.error) {
      // Most likely the reflection column isn't added yet.
      if (res.error.code === '42703' || /reflection/i.test(res.error.message)) {
        return { error: 'Reflections are not switched on yet — please ask your teacher.' };
      }
      throw res.error;
    }
  } catch {
    return { error: 'We could not save your reflection. Please try again.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/lesson/${activityId}`);
  return { ok: true, done: true };
}

export type PracticeState = {
  ok?: boolean;
  error?: string;
  score?: number;
  total?: number;
  completed?: boolean;
  thorough?: boolean;
};

// Save the guided-practice response and auto-grade it on completion (no AI).
export async function savePractice(
  activityId: string,
  _prev: PracticeState,
  formData: FormData
): Promise<PracticeState> {
  const session = getSession();
  if (!session) return { error: 'Your session ended. Please sign in again.' };

  const result = await getLessonForStudent(session.sid, session.class, activityId);
  if (!result) return { error: 'We could not find that lesson.' };
  if (result.lesson.locked) return { error: 'This lesson is locked.' };

  const text = String(formData.get('practice') ?? '').trim();
  const graded = gradePractice(text);
  if (!graded.completed) {
    return {
      error: `Write a little more to complete the practice — at least ${PRACTICE_MIN_WORDS} words (you have ${graded.words}).`,
    };
  }

  try {
    const supabase = supabaseServer();
    const { data: existing } = await supabase
      .from('submissions')
      .select('submission_id')
      .eq('student_id', session.sid)
      .eq('activity_id', activityId)
      .maybeSingle();

    const payload = { practice: text, practice_score: graded.score };
    const res = existing
      ? await supabase
          .from('submissions')
          .update(payload)
          .eq('student_id', session.sid)
          .eq('activity_id', activityId)
      : await supabase.from('submissions').insert({
          student_id: session.sid,
          activity_id: activityId,
          status: 'Not started',
          ...payload,
        });
    if (res.error) {
      if (res.error.code === '42703' || /practice/i.test(res.error.message)) {
        return { error: 'Graded practice is not switched on yet — please ask your teacher.' };
      }
      throw res.error;
    }
  } catch {
    return { error: 'We could not save your practice. Please try again.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/lesson/${activityId}`);
  return {
    ok: true,
    score: graded.score,
    total: PRACTICE_TOTAL,
    completed: graded.completed,
    thorough: graded.thorough,
  };
}

export type QuizState = {
  scored?: boolean;
  error?: string;
  score?: number;
  total?: number;
  // per question: the correct letter and what the student chose
  review?: Array<{ quiz_id: string; correct: string; chosen: string | null; isCorrect: boolean }>;
};

// Auto-grade a quiz attempt server-side and save a QuizResults row.
export async function submitQuiz(
  activityId: string,
  _prev: QuizState,
  formData: FormData
): Promise<QuizState> {
  const session = getSession();
  if (!session) return { error: 'Your session ended. Please sign in again.' };

  const result = await getLessonForStudent(session.sid, session.class, activityId);
  if (!result) return { error: 'We could not find that lesson.' };
  if (result.lesson.locked)
    return { error: 'Finish the earlier lessons first — this one is locked.' };

  const key = await getQuizKey(activityId);
  if (key.length === 0) return { error: 'This lesson has no quiz.' };

  // Every question must be answered.
  const review = key.map((k) => {
    const chosen = formData.get(k.quiz_id);
    const chosenStr = chosen == null ? null : String(chosen);
    return {
      quiz_id: k.quiz_id,
      correct: k.correct,
      chosen: chosenStr,
      isCorrect: chosenStr === k.correct,
    };
  });
  if (review.some((r) => !r.chosen)) {
    return { error: 'Please answer every question before submitting.', total: key.length };
  }

  const score = review.filter((r) => r.isCorrect).length;

  try {
    const supabase = supabaseServer();
    const { error } = await supabase.from('quiz_results').insert({
      student_id: session.sid,
      activity_id: activityId,
      score,
      date: new Date().toISOString(),
    });
    if (error) throw error;
  } catch {
    return { error: 'We could not save your quiz. Please try again in a moment.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/lesson/${activityId}`);
  return { scored: true, score, total: key.length, review };
}
