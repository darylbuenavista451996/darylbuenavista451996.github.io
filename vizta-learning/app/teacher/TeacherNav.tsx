import Link from 'next/link';
import Brand from '../Brand';
import { signOutTeacher } from './actions';

// Shared header for teacher pages: brand, nav links, sign out.
export default function TeacherNav({ active }: { active: string }) {
  const links = [
    { href: '/teacher', label: 'Overview', key: 'overview' },
    { href: '/teacher/students', label: 'Students', key: 'students' },
    { href: '/teacher/attendance', label: 'Attendance', key: 'attendance' },
    { href: '/teacher/grade', label: 'Grading', key: 'grade' },
    { href: '/teacher/scores', label: 'Scores', key: 'scores' },
    { href: '/teacher/modules', label: 'Modules', key: 'modules' },
    { href: '/teacher/content', label: 'Content', key: 'content' },
    { href: '/teacher/math', label: 'Mathematics', key: 'math' },
    { href: '/teacher/side-task', label: 'Side Task', key: 'side-task' },
  ];
  return (
    <div className="topbar teacher-topbar">
      <Brand />
      <nav className="teacher-nav">
        {links.map((l) => (
          <Link key={l.key} href={l.href} className={l.key === active ? 'tnav tnav-on' : 'tnav'}>
            {l.label}
          </Link>
        ))}
        <form action={signOutTeacher}>
          <button className="btn btn-ghost btn-sm" type="submit">Sign out</button>
        </form>
      </nav>
    </div>
  );
}
