import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../../Brand';
import SignupForm from './SignupForm';
import { getTeacher } from '@/lib/teacherAuth';

export const dynamic = 'force-dynamic';

export default async function TeacherSignupPage() {
  if (await getTeacher()) redirect('/teacher');
  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Create a teacher account</h1>
        <p className="lede">
          For teachers only. You need your school&apos;s private teacher code to sign up.
        </p>
        <SignupForm />
        <Link className="muted-link" href="/teacher/login">← Already have an account? Sign in</Link>
      </div>
    </main>
  );
}
