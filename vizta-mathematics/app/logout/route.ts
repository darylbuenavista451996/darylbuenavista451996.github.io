import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/session';
import { BASE_PATH } from '@/lib/basePath';

// Clear the session cookie and return to sign-in. A full path (not a bare
// trailing slash) matches the proxy's rewrite rule when served via the proxy.
export async function POST() {
  cookies().delete(SESSION_COOKIE);
  return new NextResponse(null, { status: 303, headers: { Location: `${BASE_PATH}/login` } });
}
