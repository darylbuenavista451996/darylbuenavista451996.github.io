import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import EmailLoginForm from './EmailLoginForm';
import { getSession } from '@/lib/session';

export default function LoginPage() {
  if (getSession()) redirect('/');

  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Sign in</h1>
        <p className="lede">
          Sign in with the email and password you used to create your account.
        </p>

        <EmailLoginForm />

        <div className="auth-links">
          New here? <Link href="/signup">Create an account</Link>
        </div>
        <p className="hint">Forgot your password? Ask your teacher to reset it for you.</p>

        <p className="footer">
          {/* Teachers manage everything (including Mathematics) from the shared
              teacher dashboard, which lives in the Media Arts app. Absolute URL
              so it works from any host. */}
          <a className="teacher-link" href="https://viztasystems.com/web-platforms/media-arts/teacher/login">
            Teacher sign in
          </a>
        </p>
      </div>
    </main>
  );
}
