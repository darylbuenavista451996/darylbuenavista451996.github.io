// Certificate of completion. Reachable only when the student has completed every
// lesson in their module — the check runs server-side, so the URL can't be used
// to reach it early. Shows the student name, class, course title, and date, and
// prints/saves cleanly. Fully data-driven (course title comes from the module).
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getDashboard } from '@/lib/data';
import PrintButton from './PrintButton';

export const dynamic = 'force-dynamic';

function today(): string {
  const d = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function CertificatePage() {
  const session = getSession();
  if (!session) redirect('/login');

  const dash = await getDashboard(session.sid, session.class);
  // Not finished (or no module)? Send them back — no early certificates.
  if (!dash || !dash.allComplete) redirect('/dashboard');

  const gradeLabel = session.class === 'G9' ? 'Grade 9' : 'Grade 10';

  return (
    <main className="page cert-page">
      <div className="cert" role="region" aria-label="Certificate of completion">
        <div className="cert-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark cert-mark" src="/logo.png" alt="" aria-hidden="true" width={56} height={56} />
          <p className="cert-kicker">Vizta Learning · Media Arts</p>
          <h1 className="cert-title">Certificate of Completion</h1>

          <p className="cert-line">This certifies that</p>
          <p className="cert-name">{session.name}</p>

          <p className="cert-line">has successfully completed</p>
          <p className="cert-course">{dash.module.title}</p>

          <p className="cert-meta">
            {gradeLabel} · {dash.module.term} · {dash.total} lessons
          </p>

          <div className="cert-footer">
            <div className="cert-date">
              <span className="cert-date-val">{today()}</span>
              <span className="cert-date-lbl">Date</span>
            </div>
            <div className="cert-sig">
              <span className="cert-sig-val">Vizta Learning</span>
              <span className="cert-date-lbl">learn.viztasystems.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cert-actions no-print">
        <PrintButton />
        <Link className="btn btn-ghost" href="/dashboard">Back to dashboard</Link>
      </div>
    </main>
  );
}
