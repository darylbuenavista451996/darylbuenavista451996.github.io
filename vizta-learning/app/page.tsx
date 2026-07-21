// Landing page. Warm, simple, mint and navy. The student picks their grade,
// then goes to login (the grade choice pre-fills the class code hint).
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from './Brand';
import { getSession, studentHome } from '@/lib/session';

export default function LandingPage() {
  // Already signed in? Go straight to the right home for the student's class.
  const session = getSession();
  if (session) redirect(studentHome(session.class));

  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Welcome. Let&apos;s make something.</h1>
        <p className="lede">
          This is your self-paced Media Arts course. Watch, practice, and check
          what you learned, one lesson at a time. Create your account to begin.
          Pick your grade:
        </p>

        <div className="choice-grid">
          <Link className="btn btn-primary" href="/signup?grade=G9">
            I&apos;m in Grade 9
          </Link>
          <Link className="btn btn-navy" href="/signup?grade=G10">
            I&apos;m in Grade 10
          </Link>
        </div>

        <div className="auth-links">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>

        <p className="footer">
          learn.viztasystems.com
          <span className="footer-sep">·</span>
          <Link className="teacher-link" href="/teacher/login">Teacher sign in</Link>
        </p>
      </div>
    </main>
  );
}
