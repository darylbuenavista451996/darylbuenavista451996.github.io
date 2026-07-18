// A small in-memory rate limiter for server actions. It slows brute-force
// attempts (guessing student numbers, or the teacher sign-up code) without any
// external service. Note: on serverless each instance keeps its own counters,
// so this is a speed bump, not a hard wall — Supabase Auth adds its own limits
// on top for password sign-in. Good enough for a school-sized audience.

import { headers } from 'next/headers';

type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

// Best-effort client identifier from proxy headers (Vercel sets these). Falls
// back to a constant so the limit still applies globally if headers are absent.
export function clientKey(): string {
  const h = headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}

// Allow up to `limit` actions per `windowMs` for a given key+purpose. Returns
// whether the action is allowed and, if not, how many seconds until it resets.
export function rateLimit(
  purpose: string,
  opts: { limit: number; windowMs: number }
): { ok: boolean; retryAfterSec: number } {
  const key = `${purpose}:${clientKey()}`;
  const now = Date.now();
  const hit = buckets.get(key);

  if (!hit || now >= hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    // Opportunistic cleanup so the map can't grow without bound.
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
    }
    return { ok: true, retryAfterSec: 0 };
  }

  if (hit.count >= opts.limit) {
    return { ok: false, retryAfterSec: Math.ceil((hit.resetAt - now) / 1000) };
  }
  hit.count++;
  return { ok: true, retryAfterSec: 0 };
}

// A friendly "try again later" message with a rough wait time.
export function tooManyMessage(retryAfterSec: number): string {
  const mins = Math.ceil(retryAfterSec / 60);
  const wait = retryAfterSec <= 60 ? 'a moment' : `about ${mins} minute${mins === 1 ? '' : 's'}`;
  return `Too many attempts. Please wait ${wait} and try again.`;
}
