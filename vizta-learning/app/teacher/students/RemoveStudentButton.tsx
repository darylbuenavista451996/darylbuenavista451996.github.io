'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { removeStudentAction, type ActionState } from '../actions';

function ConfirmBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-xs remove-yes" type="submit" disabled={pending}>
      {pending ? 'Removing…' : 'Yes, remove'}
    </button>
  );
}

// Two-step remove so a student is never deleted by a single stray tap. The
// first click asks for confirmation; the second actually removes.
export default function RemoveStudentButton({
  studentId,
  name,
}: {
  studentId: string;
  name: string;
}) {
  const [state, action] = useFormState<ActionState, FormData>(removeStudentAction, {});
  const [confirming, setConfirming] = useState(false);

  if (state.error) return <span className="reset-pw-err">{state.error}</span>;

  if (!confirming) {
    return (
      <button
        className="btn btn-ghost btn-xs remove-student"
        type="button"
        onClick={() => setConfirming(true)}
      >
        Remove
      </button>
    );
  }

  return (
    <form action={action} className="remove-form">
      <input type="hidden" name="student_id" value={studentId} />
      <span className="remove-warn">Remove {name}?</span>
      <ConfirmBtn />
      <button className="btn btn-ghost btn-xs" type="button" onClick={() => setConfirming(false)}>
        Cancel
      </button>
    </form>
  );
}
