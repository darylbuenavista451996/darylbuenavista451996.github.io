import Link from 'next/link';
import TeacherNav from './TeacherNav';
import ExportButton from './ExportButton';
import { requireTeacher } from '@/lib/teacherAuth';
import { getRoster, getGradeQueue } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

export default async function TeacherHome() {
  const teacher = await requireTeacher();
  const [roster, queue] = await Promise.all([getRoster(), getGradeQueue()]);
  const studentsCount = roster.length;
  const toGrade = queue.length;

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="overview" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Overview</h1>
          <p className="lede">Signed in as {teacher.email}.</p>
        </div>

        <div className="stat-grid">
          <div className="stat"><span className="stat-num">{studentsCount}</span><span className="stat-lbl">Students</span></div>
          <div className="stat"><span className="stat-num">{toGrade}</span><span className="stat-lbl">Awaiting grading</span></div>
        </div>

        <div className="tcard-grid">
          <Link className="tcard" href="/teacher/students">
            <strong>Students &amp; progress</strong>
            <span>See everyone&apos;s progress and add students to a class.</span>
          </Link>
          <Link className="tcard" href="/teacher/grade">
            <strong>Grade submissions</strong>
            <span>Review work, give a grade and feedback.</span>
          </Link>
          <Link className="tcard" href="/teacher/modules">
            <strong>Modules</strong>
            <span>Unlock or lock a module for a class.</span>
          </Link>
          <Link className="tcard" href="/teacher/content">
            <strong>Content &amp; videos</strong>
            <span>Confirm or replace a lesson&apos;s video link.</span>
          </Link>
        </div>

        <div className="banner banner-success" role="note">
          <strong>Export grades for your records</strong> — one click, opens in Excel
          or Google Sheets, and includes each activity&apos;s competency code for DepEd.
          <div className="export-row">
            <a className="btn btn-primary btn-sm" href="/teacher/export">Download grades (CSV)</a>
          </div>
        </div>

        <details className="advanced-note">
          <summary>Advanced: automatic export with n8n (optional)</summary>
          <p className="hint">
            If you ever run n8n (for example on a server), you can have it pull grades
            automatically on a schedule — see the README. This is entirely optional; the
            download button above needs no setup.
          </p>
          <div className="export-row"><ExportButton /></div>
        </details>
      </div>
    </main>
  );
}
