import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import LoginForm from './LoginForm';
import { getSession } from '@/lib/session';
import { codesForGrade, type ClassName } from '@/lib/classCodes';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { grade?: string };
}) {
  if (getSession()) redirect('/dashboard');

  const grade = searchParams.grade === 'G10' ? 'G10' : searchParams.grade === 'G9' ? 'G9' : undefined;
  const suggestedCode = grade ? codesForGrade(grade as ClassName)[0] : undefined;

  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Sign in to your class</h1>
        <p className="lede">
          Enter your class code and student number.
          {grade ? <> You picked <span className="badge">{grade === 'G9' ? 'Grade 9' : 'Grade 10'}</span>.</> : null}
        </p>

        <LoginForm suggestedCode={suggestedCode} />

        <Link className="muted-link" href="/">
          ← Choose a different grade
        </Link>
      </div>
    </main>
  );
}
