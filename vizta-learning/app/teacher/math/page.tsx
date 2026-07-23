// Teacher Mathematics panel: unlock/lock each math lesson, and see + export the
// recorded reward points. The Mathematics app is a separate app that writes to
// the same database, so everything here reads that shared data.
import Link from 'next/link';
import TeacherNav from '../TeacherNav';
import MathLockToggle from './MathLockToggle';
import { requireTeacher } from '@/lib/teacherAuth';
import { getMathLessons, getMathResults } from '@/lib/teacherData';
import { BASE_PATH } from '@/lib/basePath';

export const dynamic = 'force-dynamic';

const CLASS_LABELS: Record<string, string> = {
  G9: 'Grade 9 Media Arts',
  G10: 'Grade 10 Media Arts',
  M9: 'Grade 9 Mathematics',
};

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-PH', { timeZone: 'Asia/Manila', dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default async function TeacherMathPage() {
  await requireTeacher();
  const [lessons, results] = await Promise.all([getMathLessons(), getMathResults()]);

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="math" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Mathematics</h1>
        </div>

        <section className="lesson-section">
          <h2>Lessons</h2>
          <p className="hint">
            A locked lesson cannot be answered — students see a &ldquo;locked&rdquo; screen. Unlock a
            lesson when it is time for the class to take it.
          </p>
          {lessons.length === 0 ? (
            <p className="lede">
              No math lessons yet. If you just added them, run the latest database migration
              (0010_math) in Supabase, then refresh.
            </p>
          ) : (
            <div className="math-lock-list">
              {lessons.map((l) => (
                <div key={l.lesson_id} className={`math-lock-row ${l.unlocked ? 'open' : 'shut'}`}>
                  <div className="math-lock-info">
                    <span className={`math-lock-tag ${l.unlocked ? 'open' : 'shut'}`}>
                      {l.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                    <span className="math-lock-title">{l.title}</span>
                  </div>
                  <MathLockToggle lessonId={l.lesson_id} unlocked={l.unlocked} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="lesson-section">
          <div className="export-row">
            <h2>Reward points ({results.length})</h2>
            <a className="btn btn-primary btn-sm" href={`${BASE_PATH}/teacher/math/export`}>
              Download CSV
            </a>
          </div>
          <p className="hint">
            Each student&apos;s recorded score is final. &ldquo;Left page&rdquo; is how many times they
            switched away during the lesson (an integrity signal).
          </p>
          {results.length === 0 ? (
            <p className="lede">No results yet. They appear here as students finish lessons.</p>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Class</th><th>Lesson</th><th>Points</th><th>Quiz</th><th>Left page</th><th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={`${r.student_id}-${r.lesson_id}-${i}`}>
                      <td>{r.name}</td>
                      <td>{CLASS_LABELS[r.class] ?? r.class}</td>
                      <td>{r.lesson_id}</td>
                      <td><strong>{r.points}</strong></td>
                      <td>{r.quiz_score}/10</td>
                      <td>{r.tab_switches > 0 ? <span className="math-flag">{r.tab_switches}</span> : '0'}</td>
                      <td>{fmtDate(r.submitted_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="hint">
          <Link href="/teacher">← Back to overview</Link>
        </p>
      </div>
    </main>
  );
}
