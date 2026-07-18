import Brand from '../../Brand';
import ResetForm from './ResetForm';

export const dynamic = 'force-dynamic';

export default function TeacherResetPage() {
  return (
    <main className="page">
      <div className="card">
        <Brand />
        <h1>Set a new password</h1>
        <ResetForm />
      </div>
    </main>
  );
}
