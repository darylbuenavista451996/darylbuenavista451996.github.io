// Server-only Supabase Storage helpers for student photos. Everything here runs
// with the service-role client; the bucket is private, so images are only ever
// reachable through short-lived signed URLs we generate here.

import 'server-only';
import { supabaseServer } from './supabase';
import { AVATAR_BUCKET } from './avatar';

const SIGNED_URL_TTL = 60 * 60; // 1 hour

// Create the private avatars bucket if it doesn't exist yet, so the teacher
// never has to set it up by hand. Safe to call on every upload.
export async function ensureAvatarBucket(): Promise<void> {
  const supabase = supabaseServer();
  const { data } = await supabase.storage.getBucket(AVATAR_BUCKET);
  if (data) return;
  await supabase.storage.createBucket(AVATAR_BUCKET, {
    public: false,
    fileSizeLimit: '5MB',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  });
}

// A signed URL for one student's photo, or null (no photo / not available yet).
export async function signedAvatarUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.storage.from(AVATAR_BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
    if (error) return null;
    return data?.signedUrl ?? null;
  } catch {
    return null;
  }
}

// Signed URLs for many photos at once (roster). Returns a map path -> url.
export async function signedAvatarUrls(paths: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const unique = Array.from(new Set(paths.filter(Boolean)));
  if (unique.length === 0) return out;
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.storage.from(AVATAR_BUCKET).createSignedUrls(unique, SIGNED_URL_TTL);
    if (error || !data) return out;
    for (const row of data) {
      if (row.signedUrl && row.path) out.set(row.path, row.signedUrl);
    }
  } catch {
    /* storage not set up yet — fall back to initials everywhere */
  }
  return out;
}

// The student's stored avatar path, read error-tolerantly (column may not exist
// until the migration is run).
export async function getAvatarPath(studentId: string): Promise<string | null> {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('students')
      .select('avatar_path')
      .eq('student_id', studentId)
      .maybeSingle();
    if (error) return null;
    return (data as { avatar_path?: string | null } | null)?.avatar_path ?? null;
  } catch {
    return null;
  }
}
