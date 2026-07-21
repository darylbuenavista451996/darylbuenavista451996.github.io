// Mathematics home. Where Grade 9 Mathematics (M9) students land after signing
// in. Lists the available math lessons. These lessons are self-contained
// interactive pages (not the Media Arts module system), so this page stays
// simple: a greeting and a list of lessons to open.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import { getSession } from '@/lib/session';
import { BASE_PATH } from '@/lib/basePath';

export const dynamic = 'force-dynamic';

type Lesson = {
  href: string;
  title: string;
  blurb: string;
  status: 'ready' | 'soon';
};

const LESSONS: Lesson[] = [
  {
    href: '/math/parallel-perpendicular',
    title: 'Parallel & Perpendicular Lines',
    blurb:
      'Check whether two lines are parallel, perpendicular, or neither, and find the equation of a line through a point.',
    status: 'ready',
  },
];

function SignOut() {
  return (
    <form action={`${BASE_PATH}/logout`} method="post">
      <button className="btn btn-ghost btn-sm" type="submit">
        Sign out
      </button>
    </form>
  );
}

export default function MathHome() {
  const session = getSession();
  if (!session) redirect('/login');

  const firstName = session.name.split(' ')[0] || session.name;

  return (
    <main className="page">
      <div className="card mlz-card">
        <div className="math-head">
          <Brand subtitle="Mathematics · Grade 9" />
          <SignOut />
        </div>

        <h1 className="mlz-title">Hi {firstName}. Let&apos;s do some math.</h1>
        <p className="mlz-lead">
          Open a lesson to start. Each one works on your phone, and once you have
          opened it with internet, it keeps working even with no connection.
        </p>

        <div className="math-lessons">
          {LESSONS.map((l) =>
            l.status === 'ready' ? (
              <Link key={l.href} className="math-lesson" href={l.href}>
                <span className="math-lesson-tag ready">Ready</span>
                <span className="math-lesson-title">{l.title}</span>
                <span className="math-lesson-blurb">{l.blurb}</span>
                <span className="math-lesson-go">Open lesson →</span>
              </Link>
            ) : (
              <div key={l.href} className="math-lesson soon">
                <span className="math-lesson-tag soon">Coming soon</span>
                <span className="math-lesson-title">{l.title}</span>
                <span className="math-lesson-blurb">{l.blurb}</span>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
