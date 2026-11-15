// Teacher Mathematics panel: unlock/lock each math lesson, and see + export the
// recorded reward points. The Mathematics app is a separate app that writes to
// the same database, so everything here reads that shared data.
import Link from 'next/link';
import TeacherNav from '../TeacherNav';
import MathLockToggle from './MathLockToggle';
import MathTermToggle from './MathTermToggle';
import { requireTeacher } from '@/lib/teacherAuth';
import { getMathLessons, getMathResults, getMathTerms } from '@/lib/teacherData';
import { BASE_PATH } from '@/lib/basePath';
import { mathPreviewUrl } from '@/lib/mathPreview';

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
  const [lessons, results, terms] = await Promise.all([getMathLessons(), getMathResults(), getMathTerms()]);

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="math" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Mathematics</h1>
        </div>

        <section className="lesson-section">
          <h2>Terms</h2>
          <p className="hint">
            Open the term students are working in and close the one that is finished. Students
            pick a term on the Mathematics front page, and only an open term lets them create an
            account or enter its lessons. Closing a term deletes nothing, so its lessons and records
            stay saved for next year. Lessons inside an open term still follow their own lock below.
          </p>
          {terms === null ? (
            <p className="lede">
              The term switch is not set up yet. Run the latest database step (0012_math_terms) in
              Supabase, then refresh.
            </p>
          ) : (
            <div className="math-lock-list">
              {terms.map((t) => (
                <div key={t.term} className={`math-lock-row ${t.unlocked ? 'open' : 'shut'}`}>
                  <div className="math-lock-info">
                    <span className="math-lock-title">Term {t.term}</span>
                  </div>
                  <MathTermToggle term={t.term} unlocked={t.unlocked} />
                </div>
              ))}
            </div>
          )}
        </section>

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
                    {l.term ? <span className="math-lock-tag shut">Term {l.term}</span> : null}
                    <span className="math-lock-title">{l.title}</span>
                  </div>
                  {mathPreviewUrl(l.lesson_id) ? (
                    <a className="btn btn-ghost btn-sm" href={mathPreviewUrl(l.lesson_id) as string} target="_blank" rel="noreferrer">
                      View lesson + answers
                    </a>
                  ) : null}
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
                    <th>Name</th><th>Class</th><th>Lesson</th><th>Points</th><th>Left page</th><th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={`${r.student_id}-${r.lesson_id}-${i}`}>
                      <td>{r.name}</td>
                      <td>{CLASS_LABELS[r.class] ?? r.class}</td>
                      <td>{r.lesson_id}</td>
                      <td><strong>{r.points}</strong></td>
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
