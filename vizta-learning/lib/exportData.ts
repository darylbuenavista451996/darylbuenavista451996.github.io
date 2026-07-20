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
  days_present: number;
  days_late: number;
  days_absent: number;
};

// Per-student attendance totals, read error-tolerantly (table may not exist).
async function attendanceTotals(): Promise<Map<string, { Present: number; Late: number; Absent: number }>> {
  const supabase = supabaseServer();
  const totals = new Map<string, { Present: number; Late: number; Absent: number }>();
  const att = await supabase.from('attendance').select('student_id, status');
  if (att.error) return totals;
  for (const a of att.data ?? []) {
    const t = totals.get(a.student_id) ?? { Present: 0, Late: 0, Absent: 0 };
    const st = a.status as 'Present' | 'Late' | 'Absent';
    if (st === 'Present' || st === 'Late' || st === 'Absent') t[st]++;
    totals.set(a.student_id, t);
  }
  return totals;
}

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

  const attTotals = await attendanceTotals();

  const rows: ExportRow[] = [];
  for (const s of students.data ?? []) {
    const mod = moduleByClass.get(s.class);
    if (!mod) continue;
    const at = attTotals.get(s.student_id) ?? { Present: 0, Late: 0, Absent: 0 };
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
        days_present: at.Present,
        days_late: at.Late,
        days_absent: at.Absent,
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
    'days_present', 'days_late', 'days_absent',
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

// A classic attendance sheet: one row per student, one column per date (P/L/A),
// plus totals. Error-tolerant if the attendance table isn't there yet.
export type AttendanceSheet = {
  dates: string[];
  rows: Array<{
    class: string;
    student_number: string;
    student_name: string;
    byDate: Record<string, string>;
    present: number;
    late: number;
    absent: number;
  }>;
};

const SHORT: Record<string, string> = { Present: 'P', Late: 'L', Absent: 'A' };

export async function getAttendanceSheet(): Promise<AttendanceSheet> {
  const supabase = supabaseServer();
  const students = await supabase
    .from('students')
    .select('student_id, name, student_number, class')
    .order('class')
    .order('name');
  if (students.error) throw students.error;

  const marks = new Map<string, Array<{ date: string; status: string }>>();
  const dateSet = new Set<string>();
  const att = await supabase.from('attendance').select('student_id, date, status');
  if (!att.error) {
    for (const a of att.data ?? []) {
      const d = String(a.date);
      dateSet.add(d);
      if (!marks.has(a.student_id)) marks.set(a.student_id, []);
      marks.get(a.student_id)!.push({ date: d, status: a.status });
    }
  }
  const dates = Array.from(dateSet).sort();

  const rows = (students.data ?? []).map((s) => {
    const byDate: Record<string, string> = {};
    let present = 0, late = 0, absent = 0;
    for (const m of marks.get(s.student_id) ?? []) {
      byDate[m.date] = SHORT[m.status] ?? '';
      if (m.status === 'Present') present++;
      else if (m.status === 'Late') late++;
      else if (m.status === 'Absent') absent++;
    }
    return { class: s.class, student_number: s.student_number ?? '', student_name: s.name, byDate, present, late, absent };
  });
  return { dates, rows };
}

export function attendanceToCsv(sheet: AttendanceSheet): string {
  const esc = (v: unknown) => {
    if (v == null) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ['class', 'student_number', 'student_name', ...sheet.dates, 'Present', 'Late', 'Absent'];
  const lines = [header.map(esc).join(',')];
  for (const r of sheet.rows) {
    const cells = [
      r.class, r.student_number, r.student_name,
      ...sheet.dates.map((d) => r.byDate[d] ?? ''),
      r.present, r.late, r.absent,
    ];
    lines.push(cells.map(esc).join(','));
  }
  return lines.join('\n');
}
