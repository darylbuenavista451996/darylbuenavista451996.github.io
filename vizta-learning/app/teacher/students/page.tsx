import TeacherNav from '../TeacherNav';
import Avatar from '../../Avatar';
import AddStudentForm from './AddStudentForm';
import BulkImportForm from './BulkImportForm';
import ResetPasswordButton from './ResetPasswordButton';
import RemoveAvatarButton from './RemoveAvatarButton';
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
                  <tr><th>Name</th><th>Sign-in</th><th>Class</th><th>Progress</th><th>Account</th></tr>
                </thead>
                <tbody>
                  {roster.map((s) => (
                    <tr key={s.student_id}>
                      <td>
                        <span className="roster-name">
                          <Avatar name={s.name} src={s.avatarUrl} size={32} />
                          {s.name}
                        </span>
                      </td>
                      <td>
                        {s.email ? (
                          <span className="signin-email">{s.email}</span>
                        ) : (
                          <span className="signin-num">#{s.student_number || '—'} <span className="muted-tag">class code</span></span>
                        )}
                      </td>
                      <td>{s.class}</td>
                      <td>
                        <div className="mini-progress" aria-label={`${s.pct} percent`}>
                          <div className="mini-track"><div className="mini-fill" style={{ width: `${s.pct}%` }} /></div>
                          <span className="mini-lbl">{s.complete}/{s.total}</span>
                        </div>
                      </td>
                      <td>
                        <div className="roster-actions">
                          {s.email ? <ResetPasswordButton studentId={s.student_id} /> : null}
                          {s.hasPhoto ? <RemoveAvatarButton studentId={s.student_id} /> : null}
                          {!s.email && !s.hasPhoto ? <span className="muted-tag">—</span> : null}
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
