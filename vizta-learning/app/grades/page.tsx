// My grades — a read-only grade book for the signed-in student. Shows the
// teacher's grade, the quiz score and the auto-graded activity score per task.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import { getSession } from '@/lib/session';
import { getStudentGrades } from '@/lib/data';

export const dynamic = 'force-dynamic';

function fmt(score: number | null, total: number | null): string {
  if (score == null) return '—';
  return total != null ? `${score} / ${total}` : String(score);
}

export default async function GradesPage() {
  const session = getSession();
  if (!session) redirect('/login');

  let view;
  try {
    view = await getStudentGrades(session.sid, session.class);
  } catch {
    view = null;
  }

  if (!view) {
    return (
      <main className="page">
        <div className="card">
          <Brand />
          <h1>No grades yet</h1>
          <p className="lede">
            Your class doesn&apos;t have a module loaded yet, or we couldn&apos;t
            reach the server. Please try again in a moment.
          </p>
          <Link className="btn btn-ghost" href="/dashboard">← Back to my course</Link>
        </div>
      </main>
    );
  }

  const { module, rows, earned, possible } = view;

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <div className="topbar">
          <Brand />
          <div className="topbar-right">
            <Link className="btn btn-ghost btn-sm" href="/dashboard">← My course</Link>
          </div>
        </div>

        <div className="module-head">
          <span className="eyebrow">{module.term}</span>
          <h1>My grades</h1>
          <p className="lede">
            Here&apos;s how you&apos;re doing so far, {session.name}. Grades appear
            once your teacher marks a task; quiz and activity points are added
            automatically.
          </p>
        </div>

        {possible > 0 ? (
          <div className="grades-total">
            <span className="grades-total-num">{earned} / {possible}</span>
            <span className="grades-total-lbl">points earned so far</span>
          </div>
        ) : null}

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Teacher grade</th>
                <th>Quiz</th>
                <th>Activity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.activity_id}>
                  <td>
                    <strong>Task {r.order}</strong> — {r.title}
                    {r.is_performance_task ? <span className="tag-pt"> · Performance task</span> : null}
                  </td>
                  <td>{fmt(r.grade, r.rubric_total)}</td>
                  <td>{r.quizTotal > 0 ? fmt(r.quizScore, r.quizTotal) : '—'}</td>
                  <td>{fmt(r.practiceScore, r.practiceTotal)}</td>
                  <td>
                    {r.locked ? (
                      <span className="badge badge-muted">Locked</span>
                    ) : r.complete ? (
                      <span className="badge badge-done">Complete</span>
                    ) : r.status === 'Graded' ? (
                      <span className="badge badge-graded">Graded</span>
                    ) : r.status === 'Submitted' ? (
                      <span className="badge badge-submitted">Submitted</span>
                    ) : (
                      <span className="badge badge-muted">Not started</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="hint">
          A dash (—) means nothing has been recorded for that task yet. Keep
          going — finish a task to unlock the next one.
        </p>
      </div>
    </main>
  );
}
