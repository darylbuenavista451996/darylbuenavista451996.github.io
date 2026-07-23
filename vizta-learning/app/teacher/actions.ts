'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireTeacher, teacherServerClient } from '@/lib/teacherAuth';
import {
  setGrade,
  reopenSubmission,
  addStudent as addStudentDb,
  bulkAddStudents,
  setModuleUnlocked,
  updateActivityVideo,
  updateActivityText,
  resetStudentPassword,
  removeStudentAvatar,
  removeStudent,
  saveAttendance,
  setMathLessonUnlocked,
  type AttendanceStatus,
} from '@/lib/teacherData';
import type { ClassName } from '@/lib/classCodes';

export type ActionState = { ok?: boolean; error?: string; message?: string };

export async function signOutTeacher() {
  const supabase = teacherServerClient();
  await supabase.auth.signOut();
  redirect('/teacher/login');
}

export async function gradeSubmission(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const studentId = String(formData.get('student_id') ?? '');
  const activityId = String(formData.get('activity_id') ?? '');
  const gradeRaw = String(formData.get('grade') ?? '').trim();
  const feedback = String(formData.get('feedback') ?? '').trim() || null;
  const rubricTotal = Number(formData.get('rubric_total') ?? '') || null;

  if (!studentId || !activityId) return { error: 'Missing submission reference.' };
  const grade = Number(gradeRaw);
  if (gradeRaw === '' || Number.isNaN(grade) || grade < 0)
    return { error: 'Enter a grade of 0 or more.' };
  if (rubricTotal != null && grade > rubricTotal)
    return { error: `Grade can't be more than the rubric total (${rubricTotal}).` };

  try {
    await setGrade(studentId, activityId, grade, feedback);
  } catch {
    return { error: 'Could not save the grade. Please try again.' };
  }
  revalidatePath('/teacher/grade');
  revalidatePath('/teacher/students');
  return { ok: true, message: 'Grade saved.' };
}

export async function reopenSubmissionAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const studentId = String(formData.get('student_id') ?? '');
  const activityId = String(formData.get('activity_id') ?? '');
  if (!studentId || !activityId) return { error: 'Missing submission reference.' };
  try {
    await reopenSubmission(studentId, activityId);
  } catch {
    return { error: 'Could not reopen the submission. Please try again.' };
  }
  revalidatePath('/teacher/grade');
  revalidatePath('/dashboard');
  revalidatePath(`/lesson/${activityId}`);
  return { ok: true, message: 'Reopened — the student can edit and resubmit.' };
}

export async function addStudent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const name = String(formData.get('name') ?? '').trim();
  const studentNumber = String(formData.get('student_number') ?? '').trim();
  const cls = String(formData.get('class') ?? '').trim();

  if (!name || !studentNumber) return { error: 'Name and student number are required.' };
  if (cls !== 'G9' && cls !== 'G10') return { error: 'Please choose Grade 9 or Grade 10.' };

  const res = await addStudentDb({ name, student_number: studentNumber, class: cls as ClassName });
  if (!res.ok) return { error: res.error };
  revalidatePath('/teacher/students');
  return { ok: true, message: `Added ${name}.` };
}

// Parse one CSV line into fields, honouring double-quoted fields (so a name
// like "Dela Cruz, Juan" survives). Minimal but correct for our roster format.
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

// Normalise a class value from the CSV into 'G9' | 'G10' | null.
function normClass(raw: string): ClassName | null {
  const v = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (v === 'G9' || v === 'GRADE9' || v === '9') return 'G9';
  if (v === 'G10' || v === 'GRADE10' || v === '10') return 'G10';
  return null;
}

export async function importStudents(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const text = String(formData.get('csv') ?? '').replace(/\r\n?/g, '\n').trim();
  if (!text) return { error: 'Paste some rows first, or upload a CSV file.' };

  const lines = text.split('\n').filter((l) => l.trim() !== '');
  const rows: Array<{ name: string; student_number: string; class: ClassName }> = [];
  const problems: string[] = [];

  lines.forEach((line, idx) => {
    const cols = parseCsvLine(line);
    const name = cols[0] ?? '';
    const number = cols[1] ?? '';
    const clsRaw = cols[2] ?? '';
    // Skip an optional header row (first line that clearly names the columns).
    if (idx === 0 && /^name$/i.test(name) && /number/i.test(number)) return;
    if (!name && !number && !clsRaw) return;
    if (!name || !number || !clsRaw) {
      problems.push(`Row ${idx + 1}: needs name, number and class.`);
      return;
    }
    const cls = normClass(clsRaw);
    if (!cls) {
      problems.push(`Row ${idx + 1}: class "${clsRaw}" should be G9 or G10.`);
      return;
    }
    rows.push({ name, student_number: number, class: cls });
  });

  if (rows.length === 0)
    return { error: problems[0] ?? 'No valid rows found. Use: name, number, class (G9 or G10).' };

  const res = await bulkAddStudents(rows);
  if (!res.ok) return { error: res.error };

  revalidatePath('/teacher/students');
  const parts = [`Imported ${res.added} student${res.added === 1 ? '' : 's'}.`];
  if (res.skipped > 0) parts.push(`${res.skipped} already existed (skipped).`);
  if (problems.length > 0) parts.push(`${problems.length} row(s) had errors: ${problems.slice(0, 3).join(' ')}`);
  return { ok: true, message: parts.join(' ') };
}

export type ResetPwState = { ok?: boolean; error?: string; tempPassword?: string };

export async function resetStudentPasswordAction(
  _prev: ResetPwState,
  formData: FormData
): Promise<ResetPwState> {
  await requireTeacher();
  const studentId = String(formData.get('student_id') ?? '');
  if (!studentId) return { error: 'Missing student.' };
  const res = await resetStudentPassword(studentId);
  if (!res.ok) return { error: res.error };
  revalidatePath('/teacher/students');
  return { ok: true, tempPassword: res.tempPassword };
}

export async function removeAvatarAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const studentId = String(formData.get('student_id') ?? '');
  if (!studentId) return { error: 'Missing student.' };
  try {
    await removeStudentAvatar(studentId);
  } catch {
    return { error: 'Could not remove the photo. Please try again.' };
  }
  revalidatePath('/teacher/students');
  return { ok: true, message: 'Photo removed.' };
}

export async function removeStudentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const studentId = String(formData.get('student_id') ?? '');
  if (!studentId) return { error: 'Missing student.' };
  try {
    await removeStudent(studentId);
  } catch {
    return { error: 'Could not remove the student. Please try again.' };
  }
  revalidatePath('/teacher/students');
  return { ok: true, message: 'Student removed.' };
}

const VALID_STATUS: AttendanceStatus[] = ['Present', 'Late', 'Absent'];

export async function saveAttendanceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const date = String(formData.get('date') ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: 'Pick a valid date.' };

  const marks: Array<{ student_id: string; status: AttendanceStatus }> = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('mark_')) continue;
    const status = String(value) as AttendanceStatus;
    if (!VALID_STATUS.includes(status)) continue; // skip unmarked / blanks
    marks.push({ student_id: key.slice(5), status });
  }
  if (marks.length === 0) return { error: 'Mark at least one student before saving.' };

  const res = await saveAttendance(date, marks);
  if (!res.ok) return { error: res.error };
  revalidatePath('/teacher/attendance');
  return { ok: true, message: `Saved attendance for ${res.count} student${res.count === 1 ? '' : 's'}.` };
}

export async function toggleModule(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const moduleId = String(formData.get('module_id') ?? '');
  const unlocked = String(formData.get('unlocked') ?? '') === 'true';
  if (!moduleId) return { error: 'Missing module.' };
  try {
    await setModuleUnlocked(moduleId, unlocked);
  } catch {
    return { error: 'Could not update the module.' };
  }
  revalidatePath('/teacher/modules');
  return { ok: true, message: unlocked ? 'Module unlocked.' : 'Module locked.' };
}

export async function toggleMathLesson(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const lessonId = String(formData.get('lesson_id') ?? '');
  const unlocked = String(formData.get('unlocked') ?? '') === 'true';
  if (!lessonId) return { error: 'Missing lesson.' };
  try {
    await setMathLessonUnlocked(lessonId, unlocked);
  } catch {
    return { error: 'Could not update the lesson.' };
  }
  revalidatePath('/teacher/math');
  return { ok: true, message: unlocked ? 'Lesson unlocked.' : 'Lesson locked.' };
}

// Ping the n8n webhook to run the grade export on demand. The actual export
// pipeline (fetch endpoint -> Google Sheets) lives in n8n on the Hostinger VPS.
export async function triggerExport(_prev: ActionState): Promise<ActionState> {
  await requireTeacher();
  const webhook = process.env.N8N_EXPORT_WEBHOOK_URL;
  if (!webhook) {
    return {
      error:
        'No export webhook is configured yet. Add N8N_EXPORT_WEBHOOK_URL and set up the n8n workflow — see the README.',
    };
  }
  try {
    const res = await fetch(webhook, { method: 'POST', cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    return { error: 'Could not reach the export workflow. Please try again.' };
  }
  return { ok: true, message: 'Export started. Check your Google Sheet in a moment.' };
}

export async function updateVideo(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const activityId = String(formData.get('activity_id') ?? '');
  const url = String(formData.get('video_url') ?? '').trim();
  const title = String(formData.get('video_title') ?? '').trim();
  if (!activityId) return { error: 'Missing lesson.' };
  try {
    await updateActivityVideo(activityId, url, title);
  } catch {
    return { error: 'Could not update the video.' };
  }
  revalidatePath('/teacher/content');
  return { ok: true, message: 'Video updated.' };
}

export async function updateLessonText(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireTeacher();
  const activityId = String(formData.get('activity_id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  if (!activityId) return { error: 'Missing lesson.' };
  if (!title) return { error: 'The lesson needs a title.' };
  try {
    await updateActivityText(activityId, {
      title,
      lesson_goal: String(formData.get('lesson_goal') ?? ''),
      before_hook: String(formData.get('before_hook') ?? ''),
      activity_brief: String(formData.get('activity_brief') ?? ''),
      after_bridge: String(formData.get('after_bridge') ?? ''),
    });
  } catch {
    return { error: 'Could not save the lesson text. Please try again.' };
  }
  revalidatePath('/teacher/content');
  revalidatePath(`/teacher/content/${activityId}`);
  revalidatePath(`/lesson/${activityId}`);
  return { ok: true, message: 'Lesson text saved.' };
}
