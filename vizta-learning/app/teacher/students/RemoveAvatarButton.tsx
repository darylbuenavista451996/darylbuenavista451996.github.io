'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { removeAvatarAction, type ActionState } from '../actions';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-ghost btn-xs" type="submit" disabled={pending}>
      {pending ? 'Removing…' : 'Remove photo'}
    </button>
  );
}

export default function RemoveAvatarButton({ studentId }: { studentId: string }) {
  const [state, action] = useFormState<ActionState, FormData>(removeAvatarAction, {});
  if (state.ok) return <span className="muted-tag">Photo removed</span>;
  return (
    <form action={action} className="reset-pw-form">
      <input type="hidden" name="student_id" value={studentId} />
      {state.error ? <span className="reset-pw-err">{state.error}</span> : null}
      <Btn />
    </form>
  );
}
