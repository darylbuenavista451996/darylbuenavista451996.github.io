// Mathematics front page.
//   * Signed out: a "pick your term" page. A closed term is greyed out and cannot be
//     entered (its lessons stay stored for next year). The open term leads to account
//     creation. Same idea as the Media Arts term picker.
//   * Signed in: the student's lessons, grouped by term. Lessons in a closed term are
//     shown locked.
import Link from 'next/link';
import Brand from './Brand';
import Avatar from './Avatar';
import { getSession } from '@/lib/session';
import { BASE_PATH } from '@/lib/basePath';
import { LESSONS, windowLabel, windowDay, windowState } from '@/lib/lessons';
import { ensureLessonsRegistered, getTermStates } from '@/lib/mathData';
import { getAvatarPath, signedAvatarUrl } from '@/lib/avatarStore';

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

// Terms that have lessons, newest first.
function termsInUse(): number[] {
  return [...new Set(LESSONS.map((l) => l.term))].sort((a, b) => a - b);
}

function TermPicker({ states }: { states: Record<number, boolean> }) {
  const terms = termsInUse();
  return (
    <main className="page">
      <div className="card">
        <Brand subtitle="Mathematics · Grade 9" />
        <h1>Mathematics: pick your term</h1>
        <p className="lede">Choose the term you are working on.</p>

        <div className="choice-grid">
          {terms.map((t) =>
            states[t] ? (
              <Link key={t} className="btn btn-primary" href="/signup">
                Term {t}: create your account
              </Link>
            ) : (
              <span key={t} className="btn btn-locked" aria-disabled="true">
                🔒 Term {t}: Locked
              </span>
            )
          )}
        </div>

        <p className="footer">
          {/* Teachers manage everything (including Mathematics) from the shared teacher
              dashboard, which lives in the Media Arts app. */}
          <a className="teacher-link" href="https://viztasystems.com/web-platforms/media-arts/teacher/login">
            Teacher sign in
          </a>
        </p>
      </div>
    </main>
  );
}

export default async function MathHome() {
  const session = getSession();
  const states = await getTermStates();
  if (!session) return <TermPicker states={states} />;

  await ensureLessonsRegistered();

  const firstName = session.name.split(' ')[0] || session.name;
  const avatarSrc = await signedAvatarUrl(await getAvatarPath(session.sid));
  // Newest term first, so the open term is at the top.
  const terms = termsInUse().reverse();

  return (
    <main className="page">
      <div className="card mlz-card">
        <div className="math-head">
          <Brand subtitle="Mathematics · Grade 9" />
          <div className="topbar-right">
            <Link href="/profile" className="who-avatar" title="Add or change your photo">
              <Avatar name={session.name} src={avatarSrc} size={44} />
            </Link>
            <SignOut />
          </div>
        </div>

        <h1 className="mlz-title">Hi {firstName}. Let&apos;s do some math.</h1>
        <p className="mlz-lead">
          Open a lesson to start. Watch the video while you have internet. After
          that, the reading, activities, and quiz keep working even if your
          connection drops.
        </p>

        {terms.map((t) => {
          const lessons = LESSONS.filter((l) => l.term === t).sort((a, b) => a.order - b.order);
          const open = states[t];
          return (
            <section key={t} className="math-term">
              <h2 className="math-term-title">
                Term {t}
                {!open ? <span className="math-term-closed">🔒 Closed</span> : null}
              </h2>
              <div className="math-lessons">
                {lessons.map((l, i) => {
                  const tag = l.window ? windowDay(l) : `Lesson ${i + 1}`;
                  const ws = windowState(l);
                  if (!open) {
                    return (
                      <div key={l.id} className="math-lesson soon" aria-disabled="true">
                        <span className="math-lesson-tag soon">{tag}</span>
                        <span className="math-lesson-title">{l.title}</span>
                        <span className="math-lesson-blurb">This term is closed. Your teacher keeps these lessons for next year.</span>
                      </div>
                    );
                  }
                  if (l.window && ws !== 'open') {
                    return (
                      <div key={l.id} className="math-lesson soon" aria-disabled="true">
                        <span className="math-lesson-tag soon">{tag}</span>
                        <span className="math-lesson-title">{l.title}</span>
                        <span className="math-lesson-blurb">{l.blurb}</span>
                        <span className="math-lesson-blurb"><strong>{ws === 'after' ? 'Closed. Was open ' : '🔒 Opens '}{windowLabel(l)}</strong></span>
                      </div>
                    );
                  }
                  return (
                    <Link key={l.id} className="math-lesson" href={`/${l.id}`}>
                      <span className="math-lesson-tag ready">{tag}</span>
                      <span className="math-lesson-title">{l.title}</span>
                      <span className="math-lesson-blurb">{l.blurb}</span>
                      {l.window ? <span className="math-lesson-blurb"><strong>Open today until {windowLabel(l).split(' to ')[1]}</strong></span> : null}
                      <span className="math-lesson-go">Open lesson →</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
