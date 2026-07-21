import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import SignupForm from './SignupForm';
import { getSession } from '@/lib/session';

export default function StudentSignupPage() {
  if (getSession()) redirect('/');

  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Create your account</h1>
        <p className="lede">Make your own account to start Grade 9 Mathematics.</p>

        <SignupForm />

        <div className="auth-links">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
