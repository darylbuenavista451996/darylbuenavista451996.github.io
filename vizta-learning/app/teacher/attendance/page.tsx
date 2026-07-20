import TeacherNav from '../TeacherNav';
import DatePicker from './DatePicker';
import AttendanceForm from './AttendanceForm';
import { requireTeacher } from '@/lib/teacherAuth';
import { getAttendanceForDate } from '@/lib/teacherData';

export const dynamic = 'force-dynamic';

// Today in Manila time (the audience), formatted YYYY-MM-DD.
function todayManila(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  await requireTeacher();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(searchParams.date ?? '') ? searchParams.date! : todayManila();
  const classes = await getAttendanceForDate(date);

  const pretty = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <main className="page page-wide">
      <div className="card card-wide">
        <TeacherNav active="attendance" />
        <div className="module-head">
          <span className="eyebrow">Teacher panel</span>
          <h1>Attendance</h1>
          <p className="lede">
            Pick the day, then tap each student as Present, Late, or Absent.
            Your marks save when you press Save.
          </p>
        </div>

        <div className="att-toolbar">
          <DatePicker date={date} />
          <span className="att-today">{pretty}</span>
        </div>

        <AttendanceForm date={date} classes={classes} />
      </div>
    </main>
  );
}
