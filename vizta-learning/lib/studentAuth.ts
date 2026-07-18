// Password hashing for student self-registration — server only.
//
// Uses Node's built-in scrypt (no dependency). We store a versioned string:
//   scrypt$<base64 salt>$<base64 hash>
// Verification is constant-time. Students are the only place we hold a
// password; teachers use Supabase Auth instead.

import crypto from 'node:crypto';

const KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEY_LEN);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!stored) return false;
  const [scheme, saltB64, hashB64] = stored.split('$');
  if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64');
  let actual: Buffer;
  try {
    actual = crypto.scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length);
  } catch {
    return false;
  }
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

// A short, readable temporary password a teacher can hand to a student who
// forgot theirs (no ambiguous characters like O/0 or l/1).
export function generateTempPassword(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) out += alphabet[bytes[i] % alphabet.length];
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}
