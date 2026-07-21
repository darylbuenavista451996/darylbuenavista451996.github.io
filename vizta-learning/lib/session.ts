// Student session — a small signed, httpOnly cookie.
//
// Golden rules honored here:
//   - No passwords stored. The cookie only carries who the student is.
//   - No student number in the URL (it lives only in this signed cookie).
//   - Only name, student number, and class are ever held.
//
// The cookie value is  base64url(payload) + "." + base64url(hmacSHA256).
// It is signed with SESSION_SECRET so it cannot be forged or edited.

import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'vizta_session';
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

export type StudentSession = {
  sid: string; // student_id (uuid)
  name: string;
  student_number: string;
  class: 'G9' | 'G10' | 'M9';
  iat: number; // issued-at, seconds
};

// Where a student lands after signing in. Mathematics students (M9) get the
// Mathematics home; Media Arts grades keep the module dashboard.
export function studentHome(cls: StudentSession['class']): string {
  return cls === 'M9' ? '/math' : '/dashboard';
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      'SESSION_SECRET is missing or too short. Set a long random value in .env.'
    );
  }
  return s;
}

const b64url = (buf: Buffer | string) =>
  Buffer.from(buf).toString('base64url');

function sign(payloadB64: string): string {
  return crypto.createHmac('sha256', secret()).update(payloadB64).digest('base64url');
}

export function serialize(session: Omit<StudentSession, 'iat'>): string {
  const full: StudentSession = { ...session, iat: Math.floor(Date.now() / 1000) };
  const payload = b64url(JSON.stringify(full));
  return `${payload}.${sign(payload)}`;
}

export function verify(token: string | undefined): StudentSession | null {
  if (!token) return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  // constant-time compare to resist timing attacks
  const expected = sign(payload);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as StudentSession;
    if (!data.sid || !data.class) return null;
    if (Math.floor(Date.now() / 1000) - data.iat > MAX_AGE_SECONDS) return null;
    return data;
  } catch {
    return null;
  }
}

// Read the current student session from the request cookies (server only).
export function getSession(): StudentSession | null {
  return verify(cookies().get(SESSION_COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE_SECONDS,
};
