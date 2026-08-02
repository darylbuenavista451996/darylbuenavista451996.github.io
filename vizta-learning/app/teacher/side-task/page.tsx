// Teacher Side Task panel: every student's "Build Your First Website"
// submission. Click a link to open their live site in a new tab and grade the
// working parts. Grades and links export to CSV.
import Link from 'next/link';
import TeacherNav from '../TeacherNav';
import GradeForm from './GradeForm';
import { requireTeacher } from '@/lib/teacherAuth';
import { getSideTaskSubmissions } from '@/lib/teacherData';
import { WEBSITE_TASK_ID, WEBSITE_RUBRIC, WEBSITE_RUBRIC_TOTAL } from '@/lib/sideTask';
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

export default async function TeacherSideTaskPage() {
  await requireTeacher();
  const rows = await getSideTaskSubmissions(WEBSITE_TASK_ID);

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="side-task" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Side Task: Build Your First Website</h1>
        </div>

        <section className="lesson-section">
          <p className="hint">
            This out-of-curriculum task is published to Grade 9 and Grade 10. Open each student&apos;s
            link and grade the working parts. Deduct points for parts that are missing or broken.
            Total: {WEBSITE_RUBRIC_TOTAL} points. Leave a grade blank and save to unlock a
            student&apos;s link so they can resubmit.
          </p>
          <details className="st-rubric-details">
            <summary>Show the grading rubric</summary>
            <div className="table-scroll">
              <table className="data-table st-rubric">
                <thead>
                  <tr><th>Working part</th><th>What it means</th><th>Points</th></tr>
                </thead>
                <tbody>
                  {WEBSITE_RUBRIC.map((p) => (
                    <tr key={p.label}>
                      <td><strong>{p.label}</strong></td>
                      <td>{p.how}</td>
                      <td>{p.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <section className="lesson-section">
          <div className="export-row">
            <h2>Submissions ({rows.length})</h2>
            <a className="btn btn-primary btn-sm" href={`${BASE_PATH}/teacher/side-task/export`}>
              Download CSV
            </a>
          </div>
          {rows.length === 0 ? (
            <p className="lede">
              No websites submitted yet. If you just added this, run the latest database migration
              (0011_side_task) in Supabase, then refresh. Submissions appear here as students paste
              their published links.
            </p>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Class</th><th>Website</th><th>Submitted</th><th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.student_id}>
                      <td>{r.name}</td>
                      <td>{CLASS_LABELS[r.class] ?? r.class}</td>
                      <td>
                        <a className="st-open-link" href={r.url} target="_blank" rel="noreferrer">
                          Open site ↗
                        </a>
                      </td>
                      <td>{fmtDate(r.submitted_at)}</td>
                      <td>
                        <GradeForm
                          studentId={r.student_id}
                          grade={r.grade}
                          feedback={r.feedback}
                          total={WEBSITE_RUBRIC_TOTAL}
                        />
                      </td>
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
