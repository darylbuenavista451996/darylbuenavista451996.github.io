'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { supabaseServer } from '@/lib/supabase';
import { getSideTaskSubmission, WEBSITE_TASK_ID } from '@/lib/sideTask';

export type SideTaskState = { ok?: boolean; error?: string; savedAt?: string };

function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// Save (or update) the student's published website link. They may change it
// while they are still improving the site; once the teacher has graded it, it is
// locked so the mark always matches what was checked.
export async function submitWebsite(
  _prev: SideTaskState,
  formData: FormData
): Promise<SideTaskState> {
  const session = getSession();
  if (!session) return { error: 'Your session ended. Please sign in again.' };
  if (session.class === 'M9') return { error: 'This task is for Media Arts classes.' };

  const existing = await getSideTaskSubmission(session.sid, WEBSITE_TASK_ID);
  if (existing && existing.grade != null)
    return { error: 'Your teacher has already graded this, so the link can no longer be changed.' };

  const url = String(formData.get('url') ?? '').trim();
  if (!url) return { error: 'Please paste your published website link first.' };
  if (!isHttpUrl(url))
    return { error: 'That does not look like a web link. It should start with https://' };
  if (url.length > 500) return { error: 'That link is too long. Please check it and try again.' };

  try {
    const supabase = supabaseServer();
    const now = new Date().toISOString();
    const { error } = await supabase.from('side_task_submissions').upsert(
      {
        student_id: session.sid,
        task_id: WEBSITE_TASK_ID,
        url,
        submitted_at: now,
        updated_at: now,
      },
      { onConflict: 'student_id,task_id' }
    );
    if (error) {
      // Table not created yet.
      if (error.code === '42P01' || /side_task_submissions/i.test(error.message)) {
        return { error: 'This task is not switched on yet — please tell your teacher.' };
      }
      throw error;
    }
  } catch {
    return { error: 'We could not save your link. Please try again in a moment.' };
  }

  revalidatePath('/side-task/website');
  revalidatePath('/dashboard');
  return { ok: true, savedAt: new Date().toISOString() };
}
