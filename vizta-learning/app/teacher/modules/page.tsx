import TeacherNav from '../TeacherNav';
import ModuleToggle from './ModuleToggle';
import { requireTeacher } from '@/lib/teacherAuth';
import { getModules } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

export default async function ModulesPage() {
  await requireTeacher();
  const modules = await getModules();

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="modules" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Modules</h1>
          <p className="lede">
            Unlock a module when a class is ready for it. Locking hides it from the
            student dashboard; students keep their progress either way.
          </p>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>Module</th><th>Class</th><th>Term</th><th>Status</th></tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.module_id}>
                  <td>{m.title}</td>
                  <td>{m.grade_class}</td>
                  <td>{m.term}</td>
                  <td><ModuleToggle moduleId={m.module_id} unlocked={m.unlocked} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
