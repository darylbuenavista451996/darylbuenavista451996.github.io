'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { savePractice, type PracticeState } from './actions';

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-navy btn-sm" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Submit'}
    </button>
  );
}

export default function PracticeBox({
  activityId,
  total,
  existing,
  existingScore,
  thoroughInitially,
}: {
  activityId: string;
  total: number;
  existing: string | null;
  existingScore: number | null;
  thoroughInitially: boolean;
}) {
  const bound = savePractice.bind(null, activityId);
  const [state, formAction] = useFormState<PracticeState, FormData>(bound, {});

  const scored = state.ok || existingScore != null;
  const score = state.ok ? state.score! : existingScore ?? 0;
  const thorough = state.ok ? !!state.thorough : thoroughInitially;

  return (
    <form action={formAction} className="practice-box">
      {scored ? (
        <div className="banner banner-success" role="status">
          <strong>Score: {score} / {total}</strong>
          {!thorough ? <div className="hint">You can add more detail and save again to raise your score.</div> : null}
        </div>
      ) : null}
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}

      <label htmlFor={`prac-${activityId}`}>Activity</label>
      <textarea
        id={`prac-${activityId}`}
        name="practice"
        rows={6}
        placeholder="Write your answer here…"
        defaultValue={existing ?? ''}
        required
      />
      <div className="practice-foot">
        <span className="practice-total">Total points: {total}</span>
        <SaveBtn />
      </div>
    </form>
  );
}
