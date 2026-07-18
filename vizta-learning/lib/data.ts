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

// One item in the term strip: a module and where the student stands in it.
export type ModuleStripItem = {
  module_id: string;
  title: string;
  term: string;
  order: number;
  total: number;
  completeCount: number;
  complete: boolean;
  available: boolean; // teacher-unlocked AND earlier terms finished
  isCurrent: boolean; // the module the dashboard is showing
};

export type DashboardView = {
  module: Module;
  lessons: LessonView[];
  total: number;
  completeCount: number;
  progressPct: number;
  dueNext: LessonView | null;
  moduleComplete: boolean; // the shown module is fully done
  moduleAvailable: boolean; // the shown module is open to the student
  allComplete: boolean; // EVERY module for the class is done (course complete)
  modules: ModuleStripItem[]; // the term strip, in order
  nextModuleId: string | null; // next term to move into once this one is done
};

// All modules for a class, in term order.
export async function getModulesForClass(cls: ClassName): Promise<Module[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('grade_class', cls)
    .order('order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Module[];
}

// The first module for a class (kept for callers that only need one module).
export async function getModuleForClass(cls: ClassName): Promise<Module | null> {
  const mods = await getModulesForClass(cls);
  return mods[0] ?? null;
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

// Assemble the dashboard view for a student across all their class's modules.
// Terms unlock in order: a module opens once the teacher has unlocked it AND the
// previous term is fully complete. By default the view shows the student's
// current term (the first open, unfinished module); pass `moduleId` to view a
// specific term (e.g. to revisit a finished one).
export async function getDashboard(
  studentId: string,
  cls: ClassName,
  moduleId?: string
): Promise<DashboardView | null> {
  const modules = await getModulesForClass(cls);
  if (modules.length === 0) return null;

  // Fetch every activity across all the class's modules, and the student's
  // progress against them, in as few queries as possible.
  const supabase = supabaseServer();
  const { data: allActs, error: actErr } = await supabase
    .from('activities')
    .select('*')
    .in('module_id', modules.map((m) => m.module_id))
    .order('order', { ascending: true });
  if (actErr) throw actErr;
  const activities = (allActs ?? []) as Activity[];
  const { subs, quizzes } = await getProgressMaps(
    studentId,
    activities.map((a) => a.activity_id)
  );

  const actsByModule = new Map<string, Activity[]>();
  for (const a of activities) {
    if (!actsByModule.has(a.module_id)) actsByModule.set(a.module_id, []);
    actsByModule.get(a.module_id)!.push(a);
  }

  const isComplete = (a: Activity) => {
    const sub = subs.get(a.activity_id);
    const hasSubmission = sub?.status === 'Submitted' || sub?.status === 'Graded';
    return hasSubmission && quizzes.has(a.activity_id);
  };

  // Per-module totals + sequential term availability.
  type ModInfo = { module: Module; total: number; completeCount: number; complete: boolean; available: boolean };
  const info: ModInfo[] = [];
  let chainOpen: boolean = true; // earlier terms all complete so far
  for (const m of modules) {
    const acts = actsByModule.get(m.module_id) ?? [];
    const total = acts.length;
    const completeCount = acts.filter(isComplete).length;
    const complete = total > 0 && completeCount === total;
    const available: boolean = m.unlocked && chainOpen;
    info.push({ module: m, total, completeCount, complete, available });
    chainOpen = available && complete; // next term only opens when this one is done
  }

  // Current term: first available, unfinished module; else the last available;
  // else the very first (shown locked).
  const current =
    info.find((i) => i.available && !i.complete) ??
    [...info].reverse().find((i) => i.available) ??
    info[0];

  const target = (moduleId && info.find((i) => i.module.module_id === moduleId)) || current;
  const targetActs = actsByModule.get(target.module.module_id) ?? [];

  const lessons: LessonView[] = [];
  let prevComplete = true; // first lesson of an open module is always open
  for (const activity of targetActs) {
    const sub = subs.get(activity.activity_id);
    // The activity counts as submitted only when its status says so — a row can
    // exist for a reflection alone (status "Not started"), which must not count.
    const hasSubmission = sub?.status === 'Submitted' || sub?.status === 'Graded';
    const hasQuiz = quizzes.has(activity.activity_id);
    const complete = hasSubmission && hasQuiz;
    // If the whole module is closed to the student, every lesson is locked.
    const locked = !target.available || !prevComplete;
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
  const targetIdx = info.findIndex((i) => i.module.module_id === target.module.module_id);
  const nextModuleId = info[targetIdx + 1]?.module.module_id ?? null;

  const strip: ModuleStripItem[] = info.map((i) => ({
    module_id: i.module.module_id,
    title: i.module.title,
    term: i.module.term,
    order: i.module.order,
    total: i.total,
    completeCount: i.completeCount,
    complete: i.complete,
    available: i.available,
    isCurrent: i.module.module_id === target.module.module_id,
  }));

  return {
    module: target.module,
    lessons,
    total,
    completeCount,
    progressPct,
    dueNext,
    moduleComplete: target.complete,
    moduleAvailable: target.available,
    allComplete: info.every((i) => i.complete),
    modules: strip,
    nextModuleId,
  };
}

export type StudentGradeRow = {
  activity_id: string;
  order: number;
  title: string;
  is_performance_task: boolean;
  status: LessonStatus;
  grade: number | null;
  rubric_total: number | null;
  quizScore: number | null;
  quizTotal: number;
  practiceScore: number | null;
  practiceTotal: number;
  complete: boolean;
  locked: boolean;
};

export type StudentGradesView = {
  module: Module;
  rows: StudentGradeRow[];
  // Totals across everything scored so far.
  earned: number;
  possible: number;
};

// A student-facing grade book: for each task, the teacher's grade, the quiz
// score and the auto-graded activity score. Read-only; scoped to this student.
export async function getStudentGrades(
  studentId: string,
  cls: ClassName
): Promise<StudentGradesView | null> {
  const dash = await getDashboard(studentId, cls);
  if (!dash) return null;
  const supabase = supabaseServer();
  const activityIds = dash.lessons.map((l) => l.activity.activity_id);

  // Quiz item counts (the total each quiz is out of).
  const quizTotals = new Map<string, number>();
  if (activityIds.length > 0) {
    const { data: qz } = await supabase
      .from('quizzes')
      .select('activity_id')
      .in('activity_id', activityIds);
    for (const q of qz ?? [])
      quizTotals.set(q.activity_id, (quizTotals.get(q.activity_id) ?? 0) + 1);
  }

  // Latest quiz score per activity.
  const quizScores = new Map<string, number>();
  if (activityIds.length > 0) {
    const { data: qr } = await supabase
      .from('quiz_results')
      .select('activity_id, score, date')
      .eq('student_id', studentId)
      .in('activity_id', activityIds)
      .order('date', { ascending: false });
    for (const r of qr ?? [])
      if (!quizScores.has(r.activity_id)) quizScores.set(r.activity_id, r.score);
  }

  // Practice auto-scores (error-tolerant — column may not exist yet).
  const practiceScores = new Map<string, number | null>();
  {
    const { data: pr, error } = await supabase
      .from('submissions')
      .select('activity_id, practice_score')
      .eq('student_id', studentId)
      .in('activity_id', activityIds.length ? activityIds : ['__none__']);
    if (!error)
      for (const r of pr ?? [])
        practiceScores.set(r.activity_id, (r as { practice_score?: number | null }).practice_score ?? null);
  }

  let earned = 0;
  let possible = 0;
  const rows: StudentGradeRow[] = dash.lessons.map((l) => {
    const id = l.activity.activity_id;
    const quizTotal = quizTotals.get(id) ?? 0;
    const quizScore = quizScores.has(id) ? quizScores.get(id)! : null;
    const practiceScore = practiceScores.get(id) ?? null;
    const rubricTotal = l.activity.rubric_total ?? null;

    if (l.grade != null && rubricTotal != null) { earned += l.grade; possible += rubricTotal; }
    if (quizScore != null) { earned += quizScore; possible += quizTotal; }
    if (practiceScore != null) { earned += practiceScore; possible += PRACTICE_TOTAL; }

    return {
      activity_id: id,
      order: l.activity.order,
      title: l.activity.title,
      is_performance_task: l.activity.is_performance_task,
      status: l.status,
      grade: l.grade,
      rubric_total: rubricTotal,
      quizScore,
      quizTotal,
      practiceScore,
      practiceTotal: PRACTICE_TOTAL,
      complete: l.complete,
      locked: l.locked,
    };
  });

  return { module: dash.module, rows, earned, possible };
}

// The single lesson view for a student, with the same lock logic applied so a
// student can't jump ahead by editing the URL. Works across every term, and
// keeps a lesson locked if its module (or an earlier one) isn't finished yet.
export async function getLessonForStudent(
  studentId: string,
  cls: ClassName,
  activityId: string
): Promise<{ lesson: LessonView; module: Module } | null> {
  const supabase = supabaseServer();
  const { data: act, error } = await supabase
    .from('activities')
    .select('module_id')
    .eq('activity_id', activityId)
    .maybeSingle();
  if (error) throw error;
  if (!act) return null;

  const dash = await getDashboard(studentId, cls, act.module_id);
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

// Guided practice is auto-graded on completion (no AI): 10 points for doing it
// (a real attempt) + 10 points for enough detail. Total 20.
export const PRACTICE_TOTAL = 20;
export const PRACTICE_MIN_WORDS = 15;
export const PRACTICE_THOROUGH_WORDS = 50;
export function gradePractice(text: string | null | undefined): {
  words: number;
  completed: boolean;
  thorough: boolean;
  score: number;
} {
  const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const completed = words >= PRACTICE_MIN_WORDS;
  const thorough = words >= PRACTICE_THOROUGH_WORDS;
  return { words, completed, thorough, score: (completed ? 10 : 0) + (thorough ? 10 : 0) };
}

// The student's saved practice + its auto-score. Error-tolerant (columns may
// not exist yet).
export async function getPractice(
  studentId: string,
  activityId: string
): Promise<{ text: string | null; score: number | null }> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('submissions')
    .select('practice, practice_score')
    .eq('student_id', studentId)
    .eq('activity_id', activityId)
    .maybeSingle();
  if (error) return { text: null, score: null };
  return {
    text: (data?.practice as string) ?? null,
    score: (data?.practice_score as number) ?? null,
  };
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
