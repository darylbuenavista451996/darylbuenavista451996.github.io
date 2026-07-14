import TeacherNav from '../TeacherNav';
import { requireTeacher } from '@/lib/teacherAuth';
import { getQuizScores } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

export default async function ScoresPage() {
  await requireTeacher();
  const { byClass } = await getQuizScores();

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="scores" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Quiz scores</h1>
          <p className="lede">
            Auto-graded multiple-choice scores per student, one column per task.
            The creative activity for each task is graded separately under Grading.
          </p>
        </div>

        {byClass.every((c) => c.rows.length === 0) ? (
          <p className="lede">No students yet. Add students under the Students tab.</p>
        ) : (
          byClass.map((block) => (
            <section key={block.cls} className="lesson-section">
              <h2>{block.cls === 'G9' ? 'Grade 9' : 'Grade 10'}</h2>
              {block.rows.length === 0 ? (
                <p className="hint">No students in this class yet.</p>
              ) : (
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        {block.tasks.map((t) => (
                          <th key={t.activity_id} title={t.title}>Task {t.order}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((r) => (
                        <tr key={r.student_id}>
                          <td>
                            {r.name}
                            <span className="score-num">{r.student_number}</span>
                          </td>
                          {r.cells.map((c, i) => (
                            <td key={i} className="score-cell">
                              {c ? (
                                <span className={c.score >= Math.ceil(c.total * 0.6) ? 'score-pass' : 'score-low'}>
                                  {c.score}/{c.total}
                                </span>
                              ) : (
                                <span className="score-none">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </main>
  );
}
