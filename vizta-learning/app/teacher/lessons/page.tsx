// Teacher "Lessons" page: every Media Arts lesson for Grade 9 and Grade 10, grouped by
// term, each linking to a read-only view with the quiz answer key. No student account
// is needed and nothing has to be answered to open the next lesson.
import Link from 'next/link';
import TeacherNav from '../TeacherNav';
import { requireTeacher } from '@/lib/teacherAuth';
import { getLessonCatalog, type CatalogModule } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

const GRADE_LABELS: Record<string, string> = {
  G9: 'Grade 9 Media Arts',
  G10: 'Grade 10 Media Arts',
};

export default async function TeacherLessonsPage() {
  await requireTeacher();
  const catalog = await getLessonCatalog();

  const grades = ['G9', 'G10'].map((g) => ({
    grade: g,
    modules: catalog.filter((m: CatalogModule) => m.grade_class === g),
  }));

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="lessons" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Lessons and answer keys</h1>
          <p className="lede">
            Open any lesson to read it exactly as students see it, with the quiz answers marked
            and the grading rubric. This is read only, so nothing here is locked and no student
            account is needed.
          </p>
        </div>

        {grades.map(({ grade, modules }) => (
          <section key={grade} className="lesson-section">
            <h2>{GRADE_LABELS[grade]}</h2>
            {modules.length === 0 ? (
              <p className="hint">No modules loaded yet.</p>
            ) : (
              modules.map((m) => (
                <div key={m.module_id} className="tl-module">
                  <div className="tl-module-head">
                    <strong>{m.term}: {m.title}</strong>
                    <span className={m.unlocked ? 'pill pill-on' : 'pill pill-off'}>
                      {m.unlocked ? 'Open to students' : 'Locked for students'}
                    </span>
                  </div>
                  <ol className="tl-list">
                    {m.lessons.map((l) => (
                      <li key={l.activity_id}>
                        <Link className="tl-item" href={`/teacher/lessons/${l.activity_id}`}>
                          <span className="tl-num">{l.order}</span>
                          <span className="tl-main">
                            <span className="tl-title">{l.title}</span>
                            <span className="tl-meta">
                              {l.week ? `${l.week} · ` : ''}
                              {l.quizCount} quiz questions
                              {l.rubric_total ? ` · rubric ${l.rubric_total} points` : ''}
                              {l.is_performance_task ? ' · Performance task' : ''}
                            </span>
                          </span>
                          <span className="tl-go" aria-hidden="true">View →</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              ))
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
