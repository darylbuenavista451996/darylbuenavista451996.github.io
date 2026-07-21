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
      </div>
    </main>
  );
}
