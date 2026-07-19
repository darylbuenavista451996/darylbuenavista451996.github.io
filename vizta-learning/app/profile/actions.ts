'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { supabaseServer } from '@/lib/supabase';
import { AVATAR_BUCKET, MAX_AVATAR_BYTES, ALLOWED_AVATAR_TYPES } from '@/lib/avatar';
import { ensureAvatarBucket } from '@/lib/avatarStore';
import { rateLimit, tooManyMessage } from '@/lib/rateLimit';

export type AvatarState = { ok?: boolean; error?: string; message?: string };

export async function uploadAvatar(_prev: AvatarState, formData: FormData): Promise<AvatarState> {
  const session = getSession();
  if (!session) return { error: 'Your session ended. Please sign in again.' };

  const limit = rateLimit('avatar-upload', { limit: 20, windowMs: 600_000 });
  if (!limit.ok) return { error: tooManyMessage(limit.retryAfterSec) };

  const file = formData.get('photo');
  if (!(file instanceof File) || file.size === 0) return { error: 'Please choose a photo first.' };
  if (!ALLOWED_AVATAR_TYPES.includes(file.type))
    return { error: 'Please use a JPG, PNG or WEBP image.' };
  if (file.size > MAX_AVATAR_BYTES)
    return { error: 'That photo is too big. Please pick one under 4 MB.' };

  const path = `${session.sid}/avatar`;
  try {
    await ensureAvatarBucket();
    const supabase = supabaseServer();
    const bytes = Buffer.from(await file.arrayBuffer());
    const up = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: true });
    if (up.error) throw up.error;

    const { error } = await supabase
      .from('students')
      .update({ avatar_path: path })
      .eq('student_id', session.sid);
    if (error) {
      if (error.code === '42703')
        return { error: 'Photos are not switched on yet — please ask your teacher.' };
      throw error;
    }
  } catch {
    return { error: 'We could not save your photo. Please try again in a moment.' };
  }

  revalidatePath('/profile');
  revalidatePath('/dashboard');
  return { ok: true, message: 'Photo updated.' };
}

export async function removeMyAvatar(_prev: AvatarState): Promise<AvatarState> {
  const session = getSession();
  if (!session) return { error: 'Your session ended. Please sign in again.' };

  const path = `${session.sid}/avatar`;
  try {
    const supabase = supabaseServer();
    await supabase.storage.from(AVATAR_BUCKET).remove([path]);
    await supabase.from('students').update({ avatar_path: null }).eq('student_id', session.sid);
  } catch {
    return { error: 'We could not remove your photo. Please try again.' };
  }
  revalidatePath('/profile');
  revalidatePath('/dashboard');
  return { ok: true, message: 'Photo removed.' };
}
