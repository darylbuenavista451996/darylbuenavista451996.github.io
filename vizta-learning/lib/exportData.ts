// Grade export for DepEd records, consumed by n8n. Produces one flat row per
// student per activity — a complete gradebook, including the DepEd competency
// code (which is hidden from students but required here). Server-only.

import { supabaseServer } from './supabase';

export type ExportRow = {
  class: string;
  student_number: string;
  student_name: string;
  module_id: string;
  module_title: string;
  activity_id: string;
  activity_title: string;
  week: string | null;
  competency_code: string | null; // hidden from students; required for DepEd
  is_performance_task: boolean;
  submission_status: string; // Not started | Submitted | Graded
  grade: number | null;
  rubric_total: number | null;
  quiz_score: number | null; // latest attempt
  practice_score: number | null; // auto, out of 20
  feedback: string | null;
  submitted_at: string | null;
};

export async function getGradeExport(): Promise<ExportRow[]> {
  const supabase = supabaseServer();
  const [students, modules, activities, submissions, quizResults] = await Promise.all([
    supabase.from('students').select('student_id, name, student_number, class').order('class').order('student_number'),
    supabase.from('modules').select('module_id, title, grade_class, "order"'),
    supabase.from('activities').select('activity_id, module_id, "order", title, week, competency_code, is_performance_task, rubric_total'),
    supabase.from('submissions').select('student_id, activity_id, status, grade, feedback, submitted_at'),
    supabase.from('quiz_results').select('student_id, activity_id, score, date'),
  ]);
  for (const r of [students, modules, activities, submissions, quizResults]) if (r.error) throw r.error;

  // First module per class, and its activities in order.
  const moduleByClass = new Map<string, { module_id: string; title: string }>();
  for (const m of (modules.data ?? []).slice().sort((a, b) => (a.order as number) - (b.order as number))) {
    if (!moduleByClass.has(m.grade_class)) moduleByClass.set(m.grade_class, { module_id: m.module_id, title: m.title });
  }
  const actsByModule = new Map<string, typeof activities.data>();
  for (const a of activities.data ?? []) {
    if (!actsByModule.has(a.module_id)) actsByModule.set(a.module_id, [] as typeof activities.data);
    actsByModule.get(a.module_id)!.push(a);
  }
  for (const list of actsByModule.values())
    list?.sort((a, b) => (a.order as number) - (b.order as number));

  const subByKey = new Map(
    (submissions.data ?? []).map((s) => [`${s.student_id}|${s.activity_id}`, s])
  );
  // practice score per student+activity — error-tolerant (column may not exist)
  const practiceByKey = new Map<string, number | null>();
  const prac = await supabase.from('submissions').select('student_id, activity_id, practice_score');
  if (!prac.error) {
    for (const r of prac.data ?? [])
      practiceByKey.set(`${r.student_id}|${r.activity_id}`, (r as { practice_score?: number | null }).practice_score ?? null);
  }
  // latest quiz score per student+activity
  const quizByKey = new Map<string, number>();
  for (const q of (quizResults.data ?? []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)))) {
    quizByKey.set(`${q.student_id}|${q.activity_id}`, q.score); // last wins = latest
  }

  const rows: ExportRow[] = [];
  for (const s of students.data ?? []) {
    const mod = moduleByClass.get(s.class);
    if (!mod) continue;
    for (const a of actsByModule.get(mod.module_id) ?? []) {
      const sub = subByKey.get(`${s.student_id}|${a.activity_id}`);
      rows.push({
        class: s.class,
        student_number: s.student_number,
        student_name: s.name,
        module_id: mod.module_id,
        module_title: mod.title,
        activity_id: a.activity_id,
        activity_title: a.title,
        week: a.week ?? null,
        competency_code: a.competency_code ?? null,
        is_performance_task: !!a.is_performance_task,
        submission_status: sub?.status ?? 'Not started',
        grade: sub?.grade ?? null,
        rubric_total: a.rubric_total ?? null,
        quiz_score: quizByKey.get(`${s.student_id}|${a.activity_id}`) ?? null,
        practice_score: practiceByKey.get(`${s.student_id}|${a.activity_id}`) ?? null,
        feedback: sub?.feedback ?? null,
        submitted_at: sub?.submitted_at ?? null,
      });
    }
  }
  return rows;
}

// Render export rows as CSV (for n8n nodes / teachers that prefer a file).
export function toCsv(rows: ExportRow[]): string {
  const cols: (keyof ExportRow)[] = [
    'class', 'student_number', 'student_name', 'module_id', 'module_title',
    'activity_id', 'activity_title', 'week', 'competency_code', 'is_performance_task',
    'submission_status', 'grade', 'rubric_total', 'quiz_score', 'practice_score', 'feedback', 'submitted_at',
  ];
  const esc = (v: unknown) => {
    if (v == null) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.join(',')];
  for (const r of rows) lines.push(cols.map((c) => esc(r[c])).join(','));
  return lines.join('\n');
}
