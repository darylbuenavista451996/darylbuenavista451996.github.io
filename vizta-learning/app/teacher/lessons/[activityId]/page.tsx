// Read-only view of one lesson for the teacher: the full lesson content as students see
// it, plus the quiz answer key and the grading rubric. Nothing is locked here.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TeacherNav from '../../TeacherNav';
import PrintButton from '../../../certificate/PrintButton';
import { requireTeacher } from '@/lib/teacherAuth';
import { getLessonWithKey } from '@/lib/teacherData';
import { youtubeEmbed, REFLECTION_MIN_WORDS, PRACTICE_MIN_WORDS, PRACTICE_TOTAL } from '@/lib/data';

export const dynamic = 'force-dynamic';

function sectionLabel(type: string): string {
  switch (type) {
    case 'watch': return 'Watch';
    case 'do': return 'Activity';
    case 'reflect': return 'Reflect';
    default: return 'Read';
  }
}

export default async function TeacherLessonViewPage({ params }: { params: { activityId: string } }) {
  await requireTeacher();
  const data = await getLessonWithKey(decodeURIComponent(params.activityId));
  if (!data) notFound();
  const { activity: a, module: m, quiz, prev, next } = data;
  const sections = a.sections ?? [];
  const embed = youtubeEmbed(a.video_url);
  const gradeLabel = m.grade_class === 'G9' ? 'Grade 9' : m.grade_class === 'G10' ? 'Grade 10' : m.grade_class;
  const keyLine = quiz.map((q) => `${q.order}. ${q.correct}`).join('   ');
  const opts = (q: (typeof quiz)[number]) =>
    [['A', q.option_a], ['B', q.option_b], ['C', q.option_c], ['D', q.option_d]] as Array<[string, string | null]>;

  return (
    <main className="page page-wide">
      <div className="card card-wide tl-view">
        <TeacherNav active="lessons" />
        <p className="hint no-print">
          <Link href="/teacher/lessons">← All lessons</Link>
        </p>

        <div className="module-head">
          <span className="eyebrow">
            {gradeLabel} · {m.term} · Task {a.order}{a.is_performance_task ? ' · Performance task' : ''}
            {a.week ? ` · ${a.week}` : ''}
          </span>
          <h1>{a.title}</h1>
          {a.lesson_goal ? <p className="goal">{a.lesson_goal}</p> : null}
          <div className="no-print"><PrintButton /></div>
        </div>

        {/* ANSWER KEY FIRST: this is what the teacher usually needs */}
        <section className="lesson-section tl-key">
          <h2>Answer key</h2>
          {quiz.length === 0 ? (
            <p className="hint">This lesson has no quiz questions.</p>
          ) : (
            <>
              <p className="tl-keyline"><strong>Quiz ({quiz.length} questions, 1 point each):</strong> {keyLine}</p>
              <ol className="tl-quiz">
                {quiz.map((q) => (
                  <li key={q.quiz_id} className="tl-q">
                    <div className="quiz-q">{q.question}</div>
                    <ul className="tl-opts">
                      {opts(q).map(([letter, text]) =>
                        text ? (
                          <li key={letter} className={letter === q.correct ? 'tl-opt tl-correct' : 'tl-opt'}>
                            <span className="tl-letter">{letter}</span>
                            <span>{text}</span>
                            {letter === q.correct ? <span className="tl-tick">✓ correct</span> : null}
                          </li>
                        ) : null
                      )}
                    </ul>
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>

        <section className="lesson-section tl-key">
          <h2>Grading guide for the activity</h2>
          {a.activity_brief ? <p><strong>The task:</strong> {a.activity_brief}</p> : null}
          {a.submission_type ? <p className="hint">Students submit: {a.submission_type}.</p> : null}
          {a.rubric && a.rubric.length > 0 ? (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr><th>What a strong answer shows</th><th>Points</th></tr>
                </thead>
                <tbody>
                  {a.rubric.map((r, i) => (
                    <tr key={i}><td>{r.criteria}</td><td>{r.points}</td></tr>
                  ))}
                  <tr><td><strong>Total</strong></td><td><strong>{a.rubric_total ?? a.rubric.reduce((s, r) => s + r.points, 0)}</strong></td></tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="hint">No rubric is stored for this lesson.</p>
          )}
          <p className="hint">
            The activity is open ended, so there is no single correct answer. Grade it with the
            rubric above. The worked example in the lesson text below shows the kind of answer to
            expect.
          </p>
          <p className="hint">
            Automatic credit: the reflection counts when it has at least {REFLECTION_MIN_WORDS} words.
            The guided practice is worth {PRACTICE_TOTAL} points, with credit when it has at least {PRACTICE_MIN_WORDS} words.
          </p>
        </section>

        {/* THE LESSON, as students see it */}
        <h2 className="tl-divider">The lesson as students see it</h2>

        <section className="lesson-section">
          <h2>Before you watch</h2>
          {a.before_hook ? <p>{a.before_hook}</p> : null}
          {a.watch_for && a.watch_for.length > 0 ? (
            <>
              <p className="watch-lead">As you watch, keep these in mind:</p>
              <ul className="watch-for">
                {a.watch_for.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </>
          ) : null}
        </section>

        {a.video_url || a.video_slot ? (
          <section className="lesson-section">
            <h2>Watch</h2>
            {embed ? (
              <div className="video-frame no-print">
                <iframe src={embed} title={a.video_title ?? 'Lesson video'} allowFullScreen loading="lazy" />
              </div>
            ) : (
              <p className="hint">No video link is set yet.</p>
            )}
            <p className="video-cap">
              {a.video_title ?? 'Video'}{a.video_channel ? ` · ${a.video_channel}` : ''}
              {a.video_url ? <> · <a href={a.video_url} target="_blank" rel="noreferrer">open on YouTube</a></> : null}
            </p>
            {a.video_preview_note ? <p className="hint">Note: {a.video_preview_note}</p> : null}
          </section>
        ) : null}

        {a.after_bridge ? (
          <section className="lesson-section">
            <h2>After you watch</h2>
            <p>{a.after_bridge}</p>
          </section>
        ) : null}

        {sections.length > 0 ? (
          <section className="lesson-section">
            <h2>Work through this</h2>
            <ol className="sections">
              {sections.map((s, i) => (
                <li key={i} className={`section section-${s.type}`}>
                  <div className="section-head">
                    <span className="section-kind">{sectionLabel(s.type)}</span>
                    <span className="section-title">{s.title}</span>
                    {s.minutes ? <span className="section-min">~{s.minutes} min</span> : null}
                  </div>
                  {s.body ? <div className="section-body">{s.body}</div> : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="lesson-section">
          <h2>Your activity</h2>
          {a.activity_brief ? <p>{a.activity_brief}</p> : null}
          {a.tool ? <p className="tool-note"><strong>Tool:</strong> {a.tool}</p> : null}
          {a.ai_note ? <p className="ai-note"><strong>On using an AI agent:</strong> {a.ai_note}</p> : null}
        </section>

        <div className="tl-pager no-print">
          {prev ? <Link className="btn btn-ghost btn-sm" href={`/teacher/lessons/${prev.activity_id}`}>← {prev.title}</Link> : <span />}
          {next ? <Link className="btn btn-primary btn-sm" href={`/teacher/lessons/${next.activity_id}`}>{next.title} →</Link> : <span />}
        </div>
      </div>
    </main>
  );
}
