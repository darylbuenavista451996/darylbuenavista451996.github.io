// Shared server wrapper for every math lesson page. Handles the session check
// and the lock gate, so each lesson file only supplies its own content:
//   * not signed in -> redirect to login
//   * already submitted -> show the recorded score (no redo)
//   * locked -> show the locked screen (and quietly sync any offline result)
//   * unlocked -> render the lesson content
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import { getSession } from '@/lib/session';
import { getLessonUnlocked, getExistingResult } from '@/lib/mathData';
import PendingSync from './PendingSync';
import { StudentKeyProvider } from './StudentKey';

export default async function LessonPage({
  lessonId,
  kicker,
  title,
  children,
}: {
  lessonId: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  const session = getSession();
  if (!session) redirect('/login');

  const [unlocked, existing] = await Promise.all([
    getLessonUnlocked(lessonId),
    getExistingResult(session.sid, lessonId),
  ]);

  return (
    <StudentKeyProvider value={session.sid}>
    <main className="page">
      <div className="card mlz-card">
        <Brand subtitle="Mathematics · Grade 9" />
        <Link className="mlz-back" href="/">← Back to lessons</Link>
        <span className="mlz-kicker">{kicker}</span>
        <h1 className="mlz-title">{title}</h1>

        {existing ? (
          <div className="mlz-locked done">
            <h2>You already finished this lesson.</h2>
            <p>
              Your recorded score is <strong>{existing.points} points</strong> (quiz {existing.quiz_score} / 10).
              This is final and has been sent to your teacher.
            </p>
          </div>
        ) : !unlocked ? (
          <div className="mlz-locked">
            <span className="mlz-lock-icon" aria-hidden="true">🔒</span>
            <h2>This lesson is locked.</h2>
            <p>Your teacher will open it when it is time. Check back then.</p>
            <PendingSync lessonId={lessonId} />
          </div>
        ) : (
          children
        )}
      </div>
    </main>
    </StudentKeyProvider>
  );
}
