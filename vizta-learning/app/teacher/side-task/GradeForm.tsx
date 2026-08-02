'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { gradeSideTask } from '../actions';
import type { ActionState } from '../actions';

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save'}
    </button>
  );
}

export default function GradeForm({
  studentId,
  grade,
  feedback,
  total,
}: {
  studentId: string;
  grade: number | null;
  feedback: string | null;
  total: number;
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(gradeSideTask, {});
  return (
    <form action={formAction} className="st-grade-form">
      <input type="hidden" name="student_id" value={studentId} />
      <div className="st-grade-row">
        <input
          className="st-grade-input"
          name="grade"
          type="number"
          min={0}
          max={total}
          defaultValue={grade ?? ''}
          placeholder={`/ ${total}`}
          aria-label="Grade"
        />
        <input
          className="st-grade-fb"
          name="feedback"
          type="text"
          defaultValue={feedback ?? ''}
          placeholder="Optional note"
          aria-label="Feedback"
        />
        <SaveBtn />
      </div>
      {state.error ? <span className="st-grade-msg error">{state.error}</span> : null}
      {state.ok ? <span className="st-grade-msg ok">{state.message}</span> : null}
    </form>
  );
}
