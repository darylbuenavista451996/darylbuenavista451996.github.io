import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../Brand';
import SignupForm from './SignupForm';
import { getSession, studentHome } from '@/lib/session';
import { codesForGrade, type ClassName } from '@/lib/classCodes';

export default function StudentSignupPage({
  searchParams,
}: {
  searchParams: { grade?: string };
}) {
  const existing = getSession();
  if (existing) redirect(studentHome(existing.class));

  const grade = searchParams.grade === 'G10' ? 'G10' : searchParams.grade === 'G9' ? 'G9' : undefined;
  const suggestedCode = grade ? codesForGrade(grade as ClassName)[0] : undefined;

  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Create your account</h1>
        <p className="lede">
          Make your own account to start the course.
          {grade ? <> You picked <span className="badge">{grade === 'G9' ? 'Grade 9' : 'Grade 10'}</span>.</> : null}
        </p>

        <SignupForm suggestedCode={suggestedCode} />

        <div className="auth-links">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
        <Link className="muted-link" href="/">← Back</Link>
      </div>
    </main>
  );
}
