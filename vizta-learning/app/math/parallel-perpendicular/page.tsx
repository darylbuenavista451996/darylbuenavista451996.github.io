// Parallel & Perpendicular Lines — a self-contained, offline-capable math
// lesson. The page is session-gated like the rest of the app; all the
// interactive work happens client-side (see ParallelLesson) so it runs with no
// internet once the page has been opened while online.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../../Brand';
import { getSession } from '@/lib/session';
import ParallelLesson from './ParallelLesson';

export const metadata = {
  title: 'Parallel & Perpendicular Lines',
};

export default function ParallelPerpendicularPage() {
  const session = getSession();
  if (!session) redirect('/login');

  return (
    <main className="page">
      <div className="card mlz-card">
        <Brand />
        <Link className="mlz-back" href="/dashboard">
          ← Back to dashboard
        </Link>
        <span className="mlz-kicker">Mathematics · Grade 9</span>
        <h1 className="mlz-title">Parallel &amp; Perpendicular Lines</h1>
        <ParallelLesson />
      </div>
    </main>
  );
}
