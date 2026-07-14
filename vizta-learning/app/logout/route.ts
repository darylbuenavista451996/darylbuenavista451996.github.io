import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/session';

// Clear the session cookie and return to the landing page.
export async function POST(request: Request) {
  cookies().delete(SESSION_COOKIE);
  return NextResponse.redirect(new URL('/', request.url));
}
