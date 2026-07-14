// Server-side data access + progress logic for the dashboard and lesson pages.
// All reads use the service-role client, scoped in code to the current student.

import { supabaseServer } from './supabase';
import type { ClassName } from './classCodes';

export type RubricRow = { criteria: string; points: number };

// A block within a lesson's self-paced flow. Optional per activity.
export type LessonSection = {
  type: 'read' | 'watch' | 'do' | 'reflect';
  title: string;
  minutes?: number;
  body?: string;
  video_url?: string;
  video_title?: string;
  video_note?: string;
};

export type Activity = {
  activity_id: string;
  module_id: string;
  order: number;
  week: string | null;
  title: string;
  competency_code: string | null; // hidden from students; kept server-side
  is_performance_task: boolean;
  lesson_goal: string | null;
  before_hook: string | null;
  watch_for: string[] | null;
  video_title: string | null;
  video_channel: string | null;
  video_url: string | null;
  after_bridge: string | null;
  activity_brief: string | null;
  submission_type: string | null;
  tool: string | null;
  ai_note: string | null;
  rubric: RubricRow[] | null;
  rubric_total: number | null;
  sections: LessonSection[] | null;
};

export type Module = {
  module_id: string;
  title: string;
  grade_class: string;
  term: string;
  order: number;
  weeks: number | null;
  output: string | null;
  content_standard: string | null;
  performance_standard: string | null;
  unlocked: boolean;
};

export type LessonStatus = 'Not started' | 'Submitted' | 'Graded';

export type LessonView = {
  activity: Activity;
  status: LessonStatus; // from the submission
  hasSubmission: boolean;
  hasQuiz: boolean; // student has a quiz result for this activity
  complete: boolean; // submission AND quiz — the brief's definition
  locked: boolean; // sequential unlocking
  grade: number | null;
};

export type DashboardView = {
  module: Module;
  lessons: LessonView[];
  total: number;
  completeCount: number;
  progressPct: number;
  dueNext: LessonView | null;
  allComplete: boolean;
};

// The module shown for a class. Term 1 has one module per class; picking the
// first by order keeps this correct as later terms add more.
export async function getModuleForClass(cls: ClassName): Promise<Module | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('grade_class', cls)
    .order('order', { ascending: true })
    .limit(1);
  if (error) throw error;
  return (data?.[0] as Module) ?? null;
}

async function getActivities(moduleId: string): Promise<Activity[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('module_id', moduleId)
    .order('order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Activity[];
}

async function getProgressMaps(studentId: string, activityIds: string[]) {
  const supabase = supabaseServer();
  const subs = new Map<string, { status: LessonStatus; grade: number | null }>();
  const quizzes = new Set<string>();
  if (activityIds.length === 0) return { subs, quizzes };

  const [{ data: subRows, error: subErr }, { data: qrRows, error: qrErr }] =
    await Promise.all([
      supabase
        .from('submissions')
        .select('activity_id, status, grade')
        .eq('student_id', studentId)
        .in('activity_id', activityIds),
      supabase
        .from('quiz_results')
        .select('activity_id')
        .eq('student_id', studentId)
        .in('activity_id', activityIds),
    ]);
  if (subErr) throw subErr;
  if (qrErr) throw qrErr;

  for (const r of subRows ?? [])
    subs.set(r.activity_id, {
      status: (r.status as LessonStatus) ?? 'Submitted',
      grade: r.grade ?? null,
    });
  for (const r of qrRows ?? []) quizzes.add(r.activity_id);
  return { subs, quizzes };
}

// Assemble the full dashboard view for a student, including sequential locks.
export async function getDashboard(
  studentId: string,
  cls: ClassName
): Promise<DashboardView | null> {
  const module = await getModuleForClass(cls);
  if (!module) return null;

  const activities = await getActivities(module.module_id);
  const { subs, quizzes } = await getProgressMaps(
    studentId,
    activities.map((a) => a.activity_id)
  );

  const lessons: LessonView[] = [];
  let prevComplete = true; // first lesson is always open
  for (const activity of activities) {
    const sub = subs.get(activity.activity_id);
    // The activity counts as submitted only when its status says so — a row can
    // exist for a reflection alone (status "Not started"), which must not count.
    const hasSubmission = sub?.status === 'Submitted' || sub?.status === 'Graded';
    const hasQuiz = quizzes.has(activity.activity_id);
    const complete = hasSubmission && hasQuiz;
    const locked = !prevComplete;
    lessons.push({
      activity,
      status: sub?.status ?? 'Not started',
      hasSubmission,
      hasQuiz,
      complete,
      locked,
      grade: sub?.grade ?? null,
    });
    prevComplete = complete;
  }

  const total = lessons.length;
  const completeCount = lessons.filter((l) => l.complete).length;
  const progressPct = total === 0 ? 0 : Math.round((completeCount / total) * 100);
  const dueNext = lessons.find((l) => !l.locked && !l.complete) ?? null;

  return {
    module,
    lessons,
    total,
    completeCount,
    progressPct,
    dueNext,
    allComplete: total > 0 && completeCount === total,
  };
}

// The single lesson view for a student, with the same lock logic applied so a
// student can't jump ahead by editing the URL. Returns null if not found or
// not part of the student's class module.
export async function getLessonForStudent(
  studentId: string,
  cls: ClassName,
  activityId: string
): Promise<{ lesson: LessonView; module: Module } | null> {
  const dash = await getDashboard(studentId, cls);
  if (!dash) return null;
  const lesson = dash.lessons.find((l) => l.activity.activity_id === activityId);
  if (!lesson) return null;
  return { lesson, module: dash.module };
}

export type QuizItem = {
  quiz_id: string;
  order: number;
  question: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
};

// Quiz items for an activity, WITHOUT the answer key. The `correct` column is
// never selected here, so the right answers never reach the browser. Scoring
// (Step 4) happens server-side where the key is read separately.
export async function getQuizItems(activityId: string): Promise<QuizItem[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('quizzes')
    .select('quiz_id, order, question, option_a, option_b, option_c, option_d')
    .eq('activity_id', activityId)
    .order('order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as QuizItem[];
}

export type SubmissionRow = {
  content: string | null;
  status: LessonStatus;
  grade: number | null;
  feedback: string | null;
};

// The student's current submission for an activity (if any).
export async function getSubmission(
  studentId: string,
  activityId: string
): Promise<SubmissionRow | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('submissions')
    .select('content, status, grade, feedback')
    .eq('student_id', studentId)
    .eq('activity_id', activityId)
    .maybeSingle();
  if (error) throw error;
  return (data as SubmissionRow) ?? null;
}

// A reflection counts as complete when it's a genuine response: at least this
// many words. Pure app logic — no AI, no external service.
export const REFLECTION_MIN_WORDS = 15;
export function reflectionDone(text: string | null | undefined): boolean {
  if (!text) return false;
  return text.trim().split(/\s+/).filter(Boolean).length >= REFLECTION_MIN_WORDS;
}

// The student's saved reflection for an activity. Error-tolerant: if the
// reflection column doesn't exist yet (migration not run), returns null instead
// of throwing, so the rest of the app keeps working.
export async function getReflection(
  studentId: string,
  activityId: string
): Promise<string | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('submissions')
    .select('reflection')
    .eq('student_id', studentId)
    .eq('activity_id', activityId)
    .maybeSingle();
  if (error) return null;
  return (data?.reflection as string) ?? null;
}

export type QuizResultRow = { score: number; date: string };

// The student's most recent quiz attempt for an activity (if any).
export async function getLatestQuizResult(
  studentId: string,
  activityId: string
): Promise<QuizResultRow | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('quiz_results')
    .select('score, date')
    .eq('student_id', studentId)
    .eq('activity_id', activityId)
    .order('date', { ascending: false })
    .limit(1);
  if (error) throw error;
  return (data?.[0] as QuizResultRow) ?? null;
}

// Answer key for an activity's quiz — SERVER ONLY. Used to score a quiz attempt.
// Never call this from client code; it exposes the `correct` column.
export async function getQuizKey(
  activityId: string
): Promise<Array<{ quiz_id: string; correct: string }>> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('quizzes')
    .select('quiz_id, correct')
    .eq('activity_id', activityId)
    .order('order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Array<{ quiz_id: string; correct: string }>;
}

// Turn a YouTube watch/short URL into an embeddable URL. Returns null when the
// value isn't a real video link (some rows carry a teacher instruction instead
// of a final URL) so the page can show a friendly placeholder.
export function youtubeEmbed(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  let id: string | null = null;
  const watch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  const short = trimmed.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  const embed = trimmed.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (watch) id = watch[1];
  else if (short) id = short[1];
  else if (embed) id = embed[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

// Map the data's submission_type text to an input kind for the lesson form.
export function submissionKind(t: string | null): 'text' | 'link' | 'image' {
  const s = (t ?? '').toLowerCase();
  if (s.includes('link')) return 'link';
  if (s.includes('image')) return 'image';
  return 'text';
}
