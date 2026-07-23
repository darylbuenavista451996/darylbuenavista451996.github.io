// Mathematics home. Where students land after signing in. Lists the math lessons
// from the registry, and makes sure each is registered (locked) in the teacher
// dashboard.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from './Brand';
import { getSession } from '@/lib/session';
import { BASE_PATH } from '@/lib/basePath';
import { LESSONS } from '@/lib/lessons';
import { ensureLessonsRegistered } from '@/lib/mathData';

export const dynamic = 'force-dynamic';

function SignOut() {
  return (
    <form action={`${BASE_PATH}/logout`} method="post">
      <button className="btn btn-ghost btn-sm" type="submit">
        Sign out
      </button>
    </form>
  );
}

export default async function MathHome() {
  const session = getSession();
  if (!session) redirect('/login');

  await ensureLessonsRegistered();

  const firstName = session.name.split(' ')[0] || session.name;
  const lessons = [...LESSONS].sort((a, b) => a.order - b.order);

  return (
    <main className="page">
      <div className="card mlz-card">
        <div className="math-head">
          <Brand subtitle="Mathematics · Grade 9" />
          <SignOut />
        </div>

        <h1 className="mlz-title">Hi {firstName}. Let&apos;s do some math.</h1>
        <p className="mlz-lead">
          Open a lesson to start. Watch the video while you have internet. After
          that, the reading, activities, and quiz keep working even if your
          connection drops.
        </p>

        <div className="math-lessons">
          {lessons.map((l) => (
            <Link key={l.id} className="math-lesson" href={`/${l.id}`}>
              <span className="math-lesson-tag ready">Lesson {l.order}</span>
              <span className="math-lesson-title">{l.title}</span>
              <span className="math-lesson-blurb">{l.blurb}</span>
              <span className="math-lesson-go">Open lesson →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
