import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../../Brand';
import TeacherLoginForm from './TeacherLoginForm';
import { getTeacher } from '@/lib/teacherAuth';

export const dynamic = 'force-dynamic';

export default async function TeacherLoginPage() {
  if (await getTeacher()) redirect('/teacher');
  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Teacher sign in</h1>
        <p className="lede">
          This area is for teachers. Sign in with the email and password for your
          Vizta Learning teacher account.
        </p>
        <TeacherLoginForm />
        <div className="auth-links">
          <Link href="/teacher/forgot">Forgot password?</Link>
          <span className="footer-sep">·</span>
          <Link href="/teacher/signup">Create a teacher account</Link>
        </div>
        <Link className="muted-link" href="/">← Back to the student site</Link>
      </div>
    </main>
  );
}
