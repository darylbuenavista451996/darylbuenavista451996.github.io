// Mints a short-lived signed link to the Mathematics app's read-only teacher preview
// (lesson + answer key). Signed with the shared SESSION_SECRET.
import crypto from 'node:crypto';

export const PREVIEWABLE_MATH = new Set(['discriminant', 'completing-the-square', 'sum-product-roots']);

export function mathPreviewUrl(lessonId: string): string | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16 || !PREVIEWABLE_MATH.has(lessonId)) return null;
  const payload = Buffer.from(
    JSON.stringify({ k: 'math-preview', exp: Math.floor(Date.now() / 1000) + 60 * 60 })
  ).toString('base64url');
  const mac = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `/web-platforms/mathematics/preview/${encodeURIComponent(lessonId)}?t=${payload}.${mac}`;
}
