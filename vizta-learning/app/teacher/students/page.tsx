import TeacherNav from '../TeacherNav';
import AddStudentForm from './AddStudentForm';
import BulkImportForm from './BulkImportForm';
import { requireTeacher } from '@/lib/teacherAuth';
import { getRoster } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
  await requireTeacher();
  const roster = await getRoster();

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="students" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Students &amp; progress</h1>
        </div>

        <section className="lesson-section">
          <h2>Add a student</h2>
          <p className="hint">
            Students sign in with their class code and this student number. Add
            them here first — that keeps your roster the source of truth.
          </p>
          <AddStudentForm />
          <BulkImportForm />
        </section>

        <section className="lesson-section">
          <h2>Roster ({roster.length})</h2>
          {roster.length === 0 ? (
            <p className="lede">No students yet. Add your first student above.</p>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Number</th><th>Class</th><th>Module</th><th>Progress</th></tr>
                </thead>
                <tbody>
                  {roster.map((s) => (
                    <tr key={s.student_id}>
                      <td>{s.name}</td>
                      <td>{s.student_number}</td>
                      <td>{s.class}</td>
                      <td>{s.moduleTitle ?? '—'}</td>
                      <td>
                        <div className="mini-progress" aria-label={`${s.pct} percent`}>
                          <div className="mini-track"><div className="mini-fill" style={{ width: `${s.pct}%` }} /></div>
                          <span className="mini-lbl">{s.complete}/{s.total}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
