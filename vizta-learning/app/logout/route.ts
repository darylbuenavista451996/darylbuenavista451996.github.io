import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/session';
import { BASE_PATH } from '@/lib/basePath';

// Clear the session cookie and return to the landing page. A relative Location
// keeps the user on the current host (viztasystems.com) when served via proxy.
export async function POST() {
  cookies().delete(SESSION_COOKIE);
  return new NextResponse(null, { status: 303, headers: { Location: `${BASE_PATH}/` } });
}
