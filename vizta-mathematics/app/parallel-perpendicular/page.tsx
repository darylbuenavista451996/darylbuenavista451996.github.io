// Parallel & Perpendicular Lines. Session-gated and lock-gated: the lesson only
// shows once the teacher has unlocked it. If the student already submitted, we
// show their recorded score instead of letting them redo it. All the
// interactive work happens client-side (see ParallelLesson) so it runs offline
// once opened.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import { getSession } from '@/lib/session';
import { getLessonUnlocked, getExistingResult } from '@/lib/mathData';
import ParallelLesson from './ParallelLesson';
import PendingSync from './PendingSync';

export const dynamic = 'force-dynamic';

const LESSON_ID = 'parallel-perpendicular';

export const metadata = {
  title: 'Parallel & Perpendicular Lines',
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page">
      <div className="card mlz-card">
        <Brand subtitle="Mathematics · Grade 9" />
        <Link className="mlz-back" href="/">← Back to lessons</Link>
        <span className="mlz-kicker">Mathematics · Grade 9 · Coordinate Geometry</span>
        <h1 className="mlz-title">Parallel &amp; Perpendicular Lines</h1>
        {children}
      </div>
    </main>
  );
}

export default async function ParallelPerpendicularPage() {
  const session = getSession();
  if (!session) redirect('/login');

  const [unlocked, existing] = await Promise.all([
    getLessonUnlocked(LESSON_ID),
    getExistingResult(session.sid, LESSON_ID),
  ]);

  if (existing) {
    return (
      <Shell>
        <div className="mlz-locked done">
          <h2>You already finished this lesson.</h2>
          <p>
            Your recorded score is <strong>{existing.points} points</strong> (quiz {existing.quiz_score} / 10).
            This is final and has been sent to your teacher.
          </p>
        </div>
      </Shell>
    );
  }

  if (!unlocked) {
    return (
      <Shell>
        <div className="mlz-locked">
          <span className="mlz-lock-icon" aria-hidden="true">🔒</span>
          <h2>This lesson is locked.</h2>
          <p>Your teacher will open it when it is time. Check back then.</p>
          <PendingSync lessonId={LESSON_ID} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <ParallelLesson />
    </Shell>
  );
}
