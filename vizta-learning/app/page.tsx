// Landing page. Warm, simple, mint and navy. The student picks their grade,
// then goes to login (the grade choice pre-fills the class code hint).
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from './Brand';
import { getSession } from '@/lib/session';

export default function LandingPage() {
  // Already signed in? Go straight to the dashboard.
  if (getSession()) redirect('/dashboard');

  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Welcome. Let&apos;s make something.</h1>
        <p className="lede">
          This is your self-paced Media Arts course. Watch, practice, and check
          what you learned, one lesson at a time. Choose your grade to begin.
        </p>

        <div className="choice-grid">
          <Link className="btn btn-primary" href="/login?grade=G9">
            I&apos;m in Grade 9
          </Link>
          <Link className="btn btn-navy" href="/login?grade=G10">
            I&apos;m in Grade 10
          </Link>
        </div>

        <p className="footer">learn.viztasystems.com</p>
      </div>
    </main>
  );
}
