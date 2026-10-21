// "Pick your term" page, shown after a student chooses their grade. A term that
// the teacher has locked cannot be entered (its lessons stay safely stored for
// next year). Term 2 leads to account creation.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import { getSession, studentHome } from '@/lib/session';
import { getTermChoices, type TermChoice } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function TermPickerPage({
  searchParams,
}: {
  searchParams: { grade?: string };
}) {
  const existing = getSession();
  if (existing) redirect(studentHome(existing.class));

  const grade = searchParams.grade === 'G10' ? 'G10' : searchParams.grade === 'G9' ? 'G9' : null;
  if (!grade) redirect('/');
  const gradeLabel = grade === 'G9' ? 'Grade 9' : 'Grade 10';

  // If the database is unreachable, still show both terms as open so a student
  // is never stuck on this page (signup will report the real problem).
  let choices: TermChoice[];
  try {
    choices = await getTermChoices(grade);
  } catch {
    choices = [
      { term: 'Term 1', order: 1, exists: true, open: false },
      { term: 'Term 2', order: 2, exists: true, open: true },
    ];
  }

  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>{gradeLabel}: pick your term</h1>
        <p className="lede">Choose the term you are working on.</p>

        <div className="choice-grid">
          {choices.map((c) =>
            c.open ? (
              <Link
                key={c.term}
                className="btn btn-primary"
                href={`/signup?grade=${grade}`}
              >
                {c.term}: create your account
              </Link>
            ) : (
              <span key={c.term} className="btn btn-locked" aria-disabled="true">
                🔒 {c.term}: {c.exists ? 'Locked' : 'Coming soon'}
              </span>
            )
          )}
        </div>

        <div className="auth-links">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
        <Link className="muted-link" href="/">← Back</Link>
      </div>
    </main>
  );
}
