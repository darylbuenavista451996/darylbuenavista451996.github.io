// Dashboard — the heart of the app. Shows the student's module, its lessons in
// order, a progress percentage, status badges, sequential locks, and what's due
// next. Reads real data (server-side) scoped to the signed-in student.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import { getSession } from '@/lib/session';
import { getDashboard, type LessonView } from '@/lib/data';

export const dynamic = 'force-dynamic';

function StatusBadge({ lesson }: { lesson: LessonView }) {
  if (lesson.complete) return <span className="badge badge-done">Complete</span>;
  if (lesson.status === 'Graded')
    return <span className="badge badge-graded">Graded{lesson.grade != null ? ` · ${lesson.grade}` : ''}</span>;
  if (lesson.status === 'Submitted')
    return <span className="badge badge-submitted">Submitted</span>;
  return <span className="badge badge-muted">Not started</span>;
}

export default async function DashboardPage() {
  const session = getSession();
  if (!session) redirect('/login');

  let dash;
  try {
    dash = await getDashboard(session.sid, session.class);
  } catch {
    return (
      <main className="page">
        <div className="card">
          <Brand />
          <h1>We couldn&apos;t load your lessons</h1>
          <p className="lede">
            There was a problem reaching the server. Please refresh, or try again
            in a moment.
          </p>
          <SignOut />
        </div>
      </main>
    );
  }

  if (!dash) {
    return (
      <main className="page">
        <div className="card">
          <Brand />
          <h1>No module yet</h1>
          <p className="lede">
            Your class doesn&apos;t have a module loaded yet. Ask your teacher to
            seed the Term 1 content.
          </p>
          <SignOut />
        </div>
      </main>
    );
  }

  const { module, lessons, progressPct, completeCount, total, dueNext, allComplete } = dash;

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <div className="topbar">
          <Brand />
          <div className="topbar-right">
            <span className="who">
              {session.name} · <span className="badge">{session.class === 'G9' ? 'Grade 9' : 'Grade 10'}</span>
            </span>
            <SignOut compact />
          </div>
        </div>

        <div className="module-head">
          <span className="eyebrow">{module.term} · {module.weeks ? `${module.weeks} weeks` : ''}</span>
          <h1>{module.title}</h1>
          {module.output ? (
            <p className="goal"><strong>Your goal this term:</strong> {module.output}</p>
          ) : null}
        </div>

        <div className="progress-wrap" aria-label={`Progress: ${progressPct} percent`}>
          <div className="progress-row">
            <span className="progress-label">Your progress</span>
            <span className="progress-pct">{progressPct}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="progress-sub">{completeCount} of {total} lessons complete</p>
        </div>

        {allComplete ? (
          <div className="banner banner-success" role="status">
            🎉 You finished every lesson in this module! Your certificate is coming
            in a later step.
          </div>
        ) : dueNext ? (
          <div className="banner" role="status">
            <strong>Up next:</strong> {dueNext.activity.week ? `${dueNext.activity.week} — ` : ''}
            {dueNext.activity.title}
          </div>
        ) : null}

        <ol className="lesson-list">
          {lessons.map((l, i) => {
            const a = l.activity;
            const inner = (
              <>
                <span className="lesson-num">{i + 1}</span>
                <span className="lesson-main">
                  <span className="lesson-title">{a.title}</span>
                  <span className="lesson-meta">
                    {a.week ?? ''}
                    {a.is_performance_task ? ' · Performance task' : ''}
                  </span>
                </span>
                <span className="lesson-right">
                  {l.locked ? <span className="lock" aria-label="Locked">🔒</span> : <StatusBadge lesson={l} />}
                </span>
              </>
            );
            if (l.locked) {
              return (
                <li key={a.activity_id} className="lesson lesson-locked" aria-disabled="true" title="Finish the lesson before this one to unlock">
                  {inner}
                </li>
              );
            }
            return (
              <li key={a.activity_id} className="lesson">
                <Link className="lesson-link" href={`/lesson/${a.activity_id}`}>
                  {inner}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}

function SignOut({ compact }: { compact?: boolean }) {
  return (
    <form action="/logout" method="post">
      <button className={compact ? 'btn btn-ghost btn-sm' : 'btn btn-ghost'} type="submit">
        Sign out
      </button>
    </form>
  );
}
