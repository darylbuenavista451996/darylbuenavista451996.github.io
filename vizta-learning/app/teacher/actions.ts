'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireTeacher, teacherServerClient } from '@/lib/teacherAuth';
import {
  setGrade,
  addStudent as addStudentDb,
  setModuleUnlocked,
  updateActivityVideo,
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
