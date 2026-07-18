import Link from 'next/link';
import Brand from '../../Brand';
import ForgotForm from './ForgotForm';

export const dynamic = 'force-dynamic';

export default function TeacherForgotPage() {
  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Reset your password</h1>
        <p className="lede">
          Enter your teacher email and we&apos;ll send you a link to set a new password.
        </p>
        <ForgotForm />
        <Link className="muted-link" href="/teacher/login">← Back to sign in</Link>
      </div>
    </main>
  );
}
