// Dashboard — stub for Step 2 (proves the session works end to end).
// Step 3 replaces the body with the real module, lessons, progress, and badges.
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import { getSession } from '@/lib/session';

export default function DashboardPage() {
  const session = getSession();
  if (!session) redirect('/login');

  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Hi, {session.name.split(' ')[0] || 'there'}!</h1>
        <p className="lede">
          You&apos;re signed in to{' '}
          <span className="badge">{session.class === 'G9' ? 'Grade 9' : 'Grade 10'}</span>.
          Your lessons will appear here.
        </p>

        <div className="error" role="status" style={{ background: 'var(--mint-tint)', borderColor: '#bfe6d6', color: 'var(--navy)' }}>
          Login is working. The dashboard with your module, lessons, and progress
          is built in the next step.
        </div>

        <form action="/logout" method="post">
          <button className="btn btn-ghost" type="submit">Sign out</button>
        </form>
      </div>
    </main>
  );
}
