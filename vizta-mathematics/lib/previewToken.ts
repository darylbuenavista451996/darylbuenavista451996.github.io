// Short-lived signed link minted by the teacher dashboard so the teacher can read a
// lesson and its answer key without a student account. Signed with the shared
// SESSION_SECRET; it only unlocks the read-only preview page, never a student session.
import crypto from 'node:crypto';

export function verifyPreviewToken(token: string | undefined, lessonId: string): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret || secret.length < 16) return false;
  const dot = token.indexOf('.');
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const a = Buffer.from(mac), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const d = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { k?: string; exp?: number };
    return d.k === 'math-preview' && typeof d.exp === 'number' && d.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}
