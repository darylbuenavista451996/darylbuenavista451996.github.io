// Teacher-side data operations (service-role, server only). These are the raw DB
// operations; the Server Actions that call them verify the teacher session first.

import { supabaseServer } from './supabase';
import type { ClassName } from './classCodes';
import type { Module } from './data';

export type RosterEntry = {
  student_id: string;
  name: string;
  student_number: string;
  class: string;
  moduleTitle: string | null;
  complete: number;
  total: number;
  pct: number;
};

// All students with their progress in their class's module.
export async function getRoster(): Promise<RosterEntry[]> {
  const supabase = supabaseServer();
  const [students, modules, activities, submissions, quizResults] = await Promise.all([
    supabase.from('students').select('student_id, name, student_number, class').order('class').order('student_number'),
    supabase.from('modules').select('module_id, title, grade_class, "order"'),
    supabase.from('activities').select('activity_id, module_id'),
    supabase.from('submissions').select('student_id, activity_id'),
    supabase.from('quiz_results').select('student_id, activity_id'),
  ]);
  for (const r of [students, modules, activities, submissions, quizResults]) {
    if (r.error) throw r.error;
  }

  // First module per class (matches the student dashboard's choice).
  const moduleByClass = new Map<string, { module_id: string; title: string }>();
  for (const m of (modules.data ?? []).slice().sort((a, b) => (a.order as number) - (b.order as number))) {
    if (!moduleByClass.has(m.grade_class)) moduleByClass.set(m.grade_class, { module_id: m.module_id, title: m.title });
  }
  const actsByModule = new Map<string, Set<string>>();
  for (const a of activities.data ?? []) {
    if (!actsByModule.has(a.module_id)) actsByModule.set(a.module_id, new Set());
    actsByModule.get(a.module_id)!.add(a.activity_id);
  }
  const subSet = new Set((submissions.data ?? []).map((s) => `${s.student_id}|${s.activity_id}`));
  const quizSet = new Set((quizResults.data ?? []).map((q) => `${q.student_id}|${q.activity_id}`));

  return (students.data ?? []).map((s) => {
    const mod = moduleByClass.get(s.class);
    const acts = mod ? actsByModule.get(mod.module_id) ?? new Set<string>() : new Set<string>();
    const total = acts.size;
    let complete = 0;
    for (const aid of acts) {
      if (subSet.has(`${s.student_id}|${aid}`) && quizSet.has(`${s.student_id}|${aid}`)) complete++;
    }
    return {
      student_id: s.student_id,
      name: s.name,
      student_number: s.student_number,
      class: s.class,
      moduleTitle: mod?.title ?? null,
      complete,
      total,
      pct: total === 0 ? 0 : Math.round((complete / total) * 100),
    };
  });
}

export type ClassInsight = {
  cls: string;
  moduleTitle: string | null;
  students: number;
  avgProgress: number; // mean % across students
  notStarted: number; // 0% complete
  finished: number; // 100% complete
  avgQuizPct: number | null; // mean of latest quiz scores, null if no quizzes taken
};

// A quick per-class pulse for the overview: class size, average progress, how
// many haven't started, how many finished, and the average quiz score.
export async function getClassInsights(): Promise<ClassInsight[]> {
  const [roster, quiz] = await Promise.all([getRoster(), getQuizScores()]);

  // Average quiz percentage per class from the quiz-scores matrix.
  const quizPctByClass = new Map<string, number | null>();
  for (const c of quiz.byClass) {
    let sum = 0;
    let n = 0;
    for (const row of c.rows) {
      for (const cell of row.cells) {
        if (cell && cell.total > 0) {
          sum += (cell.score / cell.total) * 100;
          n++;
        }
      }
    }
    quizPctByClass.set(c.cls, n === 0 ? null : Math.round(sum / n));
  }

  const byClass = new Map<string, RosterEntry[]>();
  for (const s of roster) {
    if (!byClass.has(s.class)) byClass.set(s.class, []);
    byClass.get(s.class)!.push(s);
  }

  const out: ClassInsight[] = [];
  for (const [cls, students] of byClass) {
    const n = students.length;
    const avgProgress = n === 0 ? 0 : Math.round(students.reduce((a, s) => a + s.pct, 0) / n);
    const notStarted = students.filter((s) => s.complete === 0).length;
    const finished = students.filter((s) => s.total > 0 && s.complete === s.total).length;
    out.push({
      cls,
      moduleTitle: students[0]?.moduleTitle ?? null,
      students: n,
      avgProgress,
      notStarted,
      finished,
      avgQuizPct: quizPctByClass.get(cls) ?? null,
    });
  }
  out.sort((a, b) => a.cls.localeCompare(b.cls));
  return out;
}

export type GradeQueueItem = {
  student_id: string;
  student_name: string;
  activity_id: string;
  activity_title: string;
  rubric_total: number | null;
  content: string | null;
  submission_type: string | null;
  status: string;
  grade: number | null;
  feedback: string | null;
  submitted_at: string | null;
  reflection: string | null;
  practice: string | null;
  practice_score: number | null;
};

// Submissions for the teacher to review (default: not yet graded).
export async function getGradeQueue(includeGraded = false): Promise<GradeQueueItem[]> {
  const supabase = supabaseServer();
  let q = supabase
    .from('submissions')
    .select('student_id, activity_id, content, status, grade, feedback, submitted_at')
    .order('submitted_at', { ascending: true });
  if (!includeGraded) q = q.eq('status', 'Submitted');
  const [subs, students, acts] = await Promise.all([
    q,
    supabase.from('students').select('student_id, name'),
    supabase.from('activities').select('activity_id, title, rubric_total, submission_type'),
  ]);
  for (const r of [subs, students, acts]) if (r.error) throw r.error;

  const nameById = new Map((students.data ?? []).map((s) => [s.student_id, s.name]));
  const actById = new Map((acts.data ?? []).map((a) => [a.activity_id, a]));

  // Reflections + practice, fetched separately and error-tolerantly (columns
  // may not exist yet). Keyed by student+activity.
  const reflByKey = new Map<string, string | null>();
  const refl = await supabase.from('submissions').select('student_id, activity_id, reflection');
  if (!refl.error) {
    for (const r of refl.data ?? [])
      reflByKey.set(`${r.student_id}|${r.activity_id}`, (r as { reflection?: string | null }).reflection ?? null);
  }
  const pracByKey = new Map<string, { text: string | null; score: number | null }>();
  const prac = await supabase.from('submissions').select('student_id, activity_id, practice, practice_score');
  if (!prac.error) {
    for (const r of prac.data ?? [])
      pracByKey.set(`${r.student_id}|${r.activity_id}`, {
        text: (r as { practice?: string | null }).practice ?? null,
        score: (r as { practice_score?: number | null }).practice_score ?? null,
      });
  }

  return (subs.data ?? []).map((s) => {
    const a = actById.get(s.activity_id);
    return {
      student_id: s.student_id,
      student_name: nameById.get(s.student_id) ?? s.student_id,
      activity_id: s.activity_id,
      activity_title: a?.title ?? s.activity_id,
      rubric_total: a?.rubric_total ?? null,
      content: s.content,
      submission_type: a?.submission_type ?? null,
      status: s.status,
      grade: s.grade,
      feedback: s.feedback,
      submitted_at: s.submitted_at,
      reflection: reflByKey.get(`${s.student_id}|${s.activity_id}`) ?? null,
      practice: pracByKey.get(`${s.student_id}|${s.activity_id}`)?.text ?? null,
      practice_score: pracByKey.get(`${s.student_id}|${s.activity_id}`)?.score ?? null,
    };
  });
}

export async function setGrade(
  studentId: string,
  activityId: string,
  grade: number,
  feedback: string | null
): Promise<void> {
  const supabase = supabaseServer();
  const { error } = await supabase
    .from('submissions')
    .update({ status: 'Graded', grade, feedback })
    .eq('student_id', studentId)
    .eq('activity_id', activityId);
  if (error) throw error;
}

export async function addStudent(input: {
  name: string;
  student_number: string;
  class: ClassName;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = supabaseServer();
  const { error } = await supabase.from('students').insert({
    name: input.name,
    student_number: input.student_number,
    class: input.class,
  });
  if (error) {
    if (error.code === '23505')
      return { ok: false, error: 'A student with that number already exists in this class.' };
    return { ok: false, error: 'Could not add the student. Please try again.' };
  }
  return { ok: true };
}

// Insert many students at once. Duplicates (same student number within a class)
// are skipped, not errored, so re-running an import is safe. Returns how many
// rows were newly added and how many were skipped as already-present.
export async function bulkAddStudents(
  rows: Array<{ name: string; student_number: string; class: ClassName }>
): Promise<{ ok: true; added: number; skipped: number } | { ok: false; error: string }> {
  if (rows.length === 0) return { ok: true, added: 0, skipped: 0 };
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('students')
    .upsert(rows, { onConflict: 'class,student_number', ignoreDuplicates: true })
    .select('student_id');
  if (error) return { ok: false, error: 'Could not import the roster. Please try again.' };
  const added = data?.length ?? 0;
  return { ok: true, added, skipped: rows.length - added };
}

export async function setModuleUnlocked(moduleId: string, unlocked: boolean): Promise<void> {
  const supabase = supabaseServer();
  const { error } = await supabase.from('modules').update({ unlocked }).eq('module_id', moduleId);
  if (error) throw error;
}

export async function updateActivityVideo(
  activityId: string,
  video_url: string,
  video_title: string
): Promise<void> {
  const supabase = supabaseServer();
  const { error } = await supabase
    .from('activities')
    .update({ video_url, video_title })
    .eq('activity_id', activityId);
  if (error) throw error;
}

export type ActivityEdit = {
  activity_id: string;
  title: string;
  lesson_goal: string | null;
  before_hook: string | null;
  activity_brief: string | null;
  after_bridge: string | null;
};

// The editable student-facing text of one lesson.
export async function getActivityForEdit(activityId: string): Promise<ActivityEdit | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('activities')
    .select('activity_id, title, lesson_goal, before_hook, activity_brief, after_bridge')
    .eq('activity_id', activityId)
    .maybeSingle();
  if (error) throw error;
  return (data as ActivityEdit) ?? null;
}

// Save edited lesson text. Empty strings are stored as null so the lesson page
// hides the section rather than showing a blank.
export async function updateActivityText(
  activityId: string,
  fields: { title: string; lesson_goal: string; before_hook: string; activity_brief: string; after_bridge: string }
): Promise<void> {
  const supabase = supabaseServer();
  const clean = (s: string) => (s.trim() === '' ? null : s.trim());
  const { error } = await supabase
    .from('activities')
    .update({
      title: fields.title.trim(),
      lesson_goal: clean(fields.lesson_goal),
      before_hook: clean(fields.before_hook),
      activity_brief: clean(fields.activity_brief),
      after_bridge: clean(fields.after_bridge),
    })
    .eq('activity_id', activityId);
  if (error) throw error;
}

export type QuizCell = { score: number; total: number } | null;
export type QuizScoresView = {
  byClass: Array<{
    cls: string;
    tasks: Array<{ activity_id: string; order: number; title: string; total: number }>;
    rows: Array<{
      student_id: string;
      name: string;
      student_number: string;
      cells: QuizCell[];
    }>;
  }>;
};

// Per-student quiz scores, grouped by class, one column per task.
export async function getQuizScores(): Promise<QuizScoresView> {
  const supabase = supabaseServer();
  const [students, modules, activities, quizzes, results] = await Promise.all([
    supabase.from('students').select('student_id, name, student_number, class').order('class').order('student_number'),
    supabase.from('modules').select('module_id, title, grade_class, "order"'),
    supabase.from('activities').select('activity_id, module_id, "order", title'),
    supabase.from('quizzes').select('activity_id'),
    supabase.from('quiz_results').select('student_id, activity_id, score, date'),
  ]);
  for (const r of [students, modules, activities, quizzes, results]) if (r.error) throw r.error;

  const moduleByClass = new Map<string, string>();
  for (const m of (modules.data ?? []).slice().sort((a, b) => (a.order as number) - (b.order as number))) {
    if (!moduleByClass.has(m.grade_class)) moduleByClass.set(m.grade_class, m.module_id);
  }
  const tasksByModule = new Map<string, Array<{ activity_id: string; order: number; title: string }>>();
  for (const a of activities.data ?? []) {
    if (!tasksByModule.has(a.module_id)) tasksByModule.set(a.module_id, []);
    tasksByModule.get(a.module_id)!.push({ activity_id: a.activity_id, order: a.order as number, title: a.title });
  }
  for (const list of tasksByModule.values()) list.sort((x, y) => x.order - y.order);

  const totals = new Map<string, number>();
  for (const q of quizzes.data ?? []) totals.set(q.activity_id, (totals.get(q.activity_id) ?? 0) + 1);

  // latest score per student+activity
  const latest = new Map<string, { score: number; date: string }>();
  for (const r of results.data ?? []) {
    const key = `${r.student_id}|${r.activity_id}`;
    const prev = latest.get(key);
    if (!prev || String(r.date) > prev.date) latest.set(key, { score: r.score, date: String(r.date) });
  }

  const byClass: QuizScoresView['byClass'] = [];
  for (const [cls, moduleId] of moduleByClass) {
    const tasks = (tasksByModule.get(moduleId) ?? []).map((t) => ({
      ...t,
      total: totals.get(t.activity_id) ?? 0,
    }));
    const rows = (students.data ?? [])
      .filter((s) => s.class === cls)
      .map((s) => ({
        student_id: s.student_id,
        name: s.name,
        student_number: s.student_number,
        cells: tasks.map((t) => {
          const hit = latest.get(`${s.student_id}|${t.activity_id}`);
          return hit ? { score: hit.score, total: t.total } : null;
        }),
      }));
    byClass.push({ cls, tasks, rows });
  }
  return { byClass };
}

export async function getModules(): Promise<Module[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('modules').select('*').order('grade_class').order('order');
  if (error) throw error;
  return (data ?? []) as Module[];
}

export async function getActivitiesBrief(): Promise<
  Array<{ activity_id: string; title: string; module_id: string; video_url: string | null; video_title: string | null }>
> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('activities')
    .select('activity_id, title, module_id, video_url, video_title')
    .order('module_id')
    .order('order');
  if (error) throw error;
  return data ?? [];
}
