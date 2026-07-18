'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { resetStudentPasswordAction, type ResetPwState } from '../actions';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-ghost btn-xs" type="submit" disabled={pending}>
      {pending ? 'Resetting…' : 'Reset password'}
    </button>
  );
}

export default function ResetPasswordButton({ studentId }: { studentId: string }) {
  const [state, action] = useFormState<ResetPwState, FormData>(resetStudentPasswordAction, {});

  if (state.ok && state.tempPassword) {
    return (
      <span className="temp-pw" role="status">
        New password: <code>{state.tempPassword}</code> — give this to the student.
      </span>
    );
  }
  return (
    <form action={action} className="reset-pw-form">
      <input type="hidden" name="student_id" value={studentId} />
      {state.error ? <span className="reset-pw-err">{state.error}</span> : null}
      <Btn />
    </form>
  );
}
