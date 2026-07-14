// Lesson page — renders the full master template from the Activity row.
// Order follows the brief: goal → Before you watch → video → After you watch →
// Activity brief → rubric → quiz. The competency code and all teacher-only
// video notes are never rendered here.
//
// Step 3 renders the lesson and its forms. Actually SAVING the submission and
// auto-grading the quiz is Step 4 — the forms below show a clear note to that
// effect so nothing looks broken.
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Brand from '../../Brand';
import { getSession } from '@/lib/session';
import {
  getLessonForStudent,
  getQuizItems,
  getSubmission,
  getLatestQuizResult,
  youtubeEmbed,
  submissionKind,
} from '@/lib/data';
import ActivitySubmit from './ActivitySubmit';
import QuizRunner from './QuizRunner';

export const dynamic = 'force-dynamic';

export default async function LessonPage({
  params,
}: {
  params: { activityId: string };
}) {
  const session = getSession();
  if (!session) redirect('/login');

  const activityId = decodeURIComponent(params.activityId);
  const result = await getLessonForStudent(session.sid, session.class, activityId);
  if (!result) notFound();

  const { lesson } = result;
  // Sequential unlocking, enforced server-side: no jumping ahead via the URL.
  if (lesson.locked) redirect('/dashboard');

  const a = lesson.activity;
  const embed = youtubeEmbed(a.video_url);
  const kind = submissionKind(a.submission_type);
  const [quiz, existingSubmission, priorQuiz] = await Promise.all([
    getQuizItems(a.activity_id),
    getSubmission(session.sid, a.activity_id),
    getLatestQuizResult(session.sid, a.activity_id),
  ]);

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <div className="topbar">
          <Brand />
          <Link className="btn btn-ghost btn-sm" href="/dashboard">← Dashboard</Link>
        </div>

        <div className="module-head">
          <span className="eyebrow">
            {a.week ?? ''}{a.is_performance_task ? ' · Performance task' : ''}
          </span>
          <h1>{a.title}</h1>
          {a.lesson_goal ? <p className="goal">{a.lesson_goal}</p> : null}
        </div>

        {/* Before you watch */}
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

        {/* Video */}
        <section className="lesson-section">
          <h2>Watch</h2>
          {embed ? (
            <div className="video-frame">
              <iframe
                src={embed}
                title={a.video_title ?? 'Lesson video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <div className="video-placeholder" role="note">
              <strong>Your teacher will add the video for this lesson.</strong>
              <span>Once it&apos;s added, it will play right here.</span>
            </div>
          )}
          {a.video_title || a.video_channel ? (
            <p className="video-cap">
              {a.video_title}{a.video_channel ? ` · ${a.video_channel}` : ''}
            </p>
          ) : null}
        </section>

        {/* After you watch */}
        {a.after_bridge ? (
          <section className="lesson-section">
            <h2>After you watch</h2>
            <p>{a.after_bridge}</p>
          </section>
        ) : null}

        {/* Activity */}
        <section className="lesson-section">
          <h2>Your activity</h2>
          {a.activity_brief ? <p>{a.activity_brief}</p> : null}
          {a.tool ? <p className="tool-note"><strong>Tool:</strong> {a.tool}</p> : null}
          {a.ai_note ? <p className="ai-note"><strong>On using an AI agent:</strong> {a.ai_note}</p> : null}

          <ActivitySubmit activityId={a.activity_id} kind={kind} existing={existingSubmission} />
        </section>

        {/* Rubric */}
        {a.rubric && a.rubric.length > 0 ? (
          <section className="lesson-section">
            <h2>How this is graded</h2>
            <table className="rubric">
              <thead>
                <tr><th>What we look for</th><th>Points</th></tr>
              </thead>
              <tbody>
                {a.rubric.map((r, i) => (
                  <tr key={i}><td>{r.criteria}</td><td className="pts">{r.points}</td></tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td>Total</td><td className="pts">{a.rubric_total ?? a.rubric.reduce((s, r) => s + r.points, 0)}</td></tr>
              </tfoot>
            </table>
          </section>
        ) : null}

        {/* Quiz */}
        {quiz.length > 0 ? (
          <section className="lesson-section">
            <h2>Quick quiz</h2>
            <QuizRunner
              activityId={a.activity_id}
              items={quiz}
              priorScore={priorQuiz?.score ?? null}
            />
          </section>
        ) : null}
      </div>
    </main>
  );
}
