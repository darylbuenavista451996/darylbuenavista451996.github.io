// Dashboard — the heart of the app. Shows the student's module, its lessons in
// order, a progress percentage, status badges, sequential locks, and what's due
// next. Reads real data (server-side) scoped to the signed-in student.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import Avatar from '../Avatar';
import { getSession } from '@/lib/session';
import { getDashboard, type LessonView } from '@/lib/data';
import { getAvatarPath, signedAvatarUrl } from '@/lib/avatarStore';

export const dynamic = 'force-dynamic';

function StatusBadge({ lesson }: { lesson: LessonView }) {
  if (lesson.complete) return <span className="badge badge-done">Complete</span>;
  if (lesson.status === 'Graded')
    return <span className="badge badge-graded">Graded{lesson.grade != null ? ` · ${lesson.grade}` : ''}</span>;
  if (lesson.status === 'Submitted')
    return <span className="badge badge-submitted">Submitted</span>;
  return <span className="badge badge-muted">Not started</span>;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { module?: string };
}) {
  const session = getSession();
  if (!session) redirect('/login');

  let dash;
  try {
    dash = await getDashboard(session.sid, session.class, searchParams.module);
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

  const {
    module,
    lessons,
    progressPct,
    completeCount,
    total,
    dueNext,
    allComplete,
    moduleComplete,
    moduleAvailable,
    modules,
    nextModuleId,
  } = dash;
  const showTerms = modules.length > 1;
  const avatarSrc = await signedAvatarUrl(await getAvatarPath(session.sid));

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <div className="topbar">
          <Brand />
          <div className="topbar-right">
            <Link href="/profile" className="who-avatar" title="Edit your profile photo">
              <Avatar name={session.name} src={avatarSrc} size={52} />
            </Link>
            <span className="who">
              {session.name} · <span className="badge">{session.class === 'G9' ? 'Grade 9' : 'Grade 10'}</span>
            </span>
            <Link className="btn btn-ghost btn-sm" href="/grades">My grades</Link>
            <SignOut compact />
          </div>
        </div>

        <div className="greeting">
          <h2>Hi, {session.name} 👋</h2>
          <p>Welcome back — here is your course.</p>
        </div>

        {showTerms ? (
          <nav className="term-strip" aria-label="Terms">
            {modules.map((m) => {
              const label = `${m.term}`;
              const state = m.complete ? 'done' : m.isCurrent ? 'current' : m.available ? 'open' : 'locked';
              const inner = (
                <>
                  <span className="term-dot" aria-hidden="true">
                    {m.complete ? '✓' : m.available ? m.order : '🔒'}
                  </span>
                  <span className="term-label">{label}</span>
                </>
              );
              return m.available && !m.isCurrent ? (
                <Link key={m.module_id} className={`term-pill term-${state}`} href={`/dashboard?module=${m.module_id}`}>
                  {inner}
                </Link>
              ) : (
                <span key={m.module_id} className={`term-pill term-${state}`} aria-current={m.isCurrent ? 'true' : undefined}>
                  {inner}
                </span>
              );
            })}
          </nav>
        ) : null}

        <div className="module-head">
          <span className="eyebrow">{module.term} · {total} {total === 1 ? 'task' : 'tasks'}</span>
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
          <p className="progress-sub">{completeCount} of {total} tasks complete</p>
        </div>

        {allComplete ? (
          <div className="banner banner-success" role="status">
            <strong>🎉 You finished every task in the whole course!</strong>
            <div className="cert-cta">
              <Link className="btn btn-primary btn-sm" href="/certificate">
                View your certificate
              </Link>
            </div>
          </div>
        ) : moduleComplete && nextModuleId ? (
          <div className="banner banner-success banner-cta" role="status">
            <div>
              <strong>🎉 You finished this term!</strong> The next term is now open.
            </div>
            <Link className="btn btn-primary btn-sm" href={`/dashboard?module=${nextModuleId}`}>
              Start the next term
            </Link>
          </div>
        ) : !moduleAvailable ? (
          <div className="banner" role="status">
            <strong>This term isn&apos;t open yet.</strong> Finish the term before it, or
            wait for your teacher to unlock it.
          </div>
        ) : dueNext ? (
          <div className="banner banner-cta" role="status">
            <div>
              <strong>Up next:</strong> Task {dueNext.activity.order} — {dueNext.activity.title}
            </div>
            <Link className="btn btn-primary btn-sm" href={`/lesson/${dueNext.activity.activity_id}`}>
              {completeCount === 0 ? 'Start learning' : 'Continue where I left off'}
            </Link>
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
                    Task {a.order}
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
