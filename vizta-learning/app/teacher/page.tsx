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

        <div className="banner" role="note">
          <strong>Grade export to a spreadsheet</strong> is handled by n8n on your
          Hostinger VPS, not inside this app. The export includes each activity&apos;s
          competency code for DepEd records. Use the button below to trigger it, or
          run it on a schedule in n8n — see the README to wire it up.
          <div className="export-row"><ExportButton /></div>
        </div>
      </div>
    </main>
  );
}
