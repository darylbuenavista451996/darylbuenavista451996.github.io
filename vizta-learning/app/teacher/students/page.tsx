import TeacherNav from '../TeacherNav';
import AddStudentForm from './AddStudentForm';
import BulkImportForm from './BulkImportForm';
import RosterTable from './RosterTable';
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
          <RosterTable roster={roster} />
        </section>
      </div>
    </main>
  );
}
