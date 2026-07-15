'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { savePractice, type PracticeState } from './actions';

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-navy btn-sm" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Submit practice'}
    </button>
  );
}

export default function PracticeBox({
  activityId,
  total,
  existing,
  existingScore,
  completedInitially,
  thoroughInitially,
}: {
  activityId: string;
  total: number;
  existing: string | null;
  existingScore: number | null;
  completedInitially: boolean;
  thoroughInitially: boolean;
}) {
  const bound = savePractice.bind(null, activityId);
  const [state, formAction] = useFormState<PracticeState, FormData>(bound, {});

  const scored = state.ok || existingScore != null;
  const score = state.ok ? state.score! : existingScore ?? 0;
  const completed = state.ok ? !!state.completed : completedInitially;
  const thorough = state.ok ? !!state.thorough : thoroughInitially;

  return (
    <form action={formAction} className="practice-box">
      {scored ? (
        <div className="banner banner-success" role="status">
          <strong>Practice score: {score} / {total}</strong>
          <ul className="crit-list">
            <li className={completed ? 'crit-hit' : 'crit-miss'}>{completed ? '✓' : '○'} Completed the practice — 10 pts</li>
            <li className={thorough ? 'crit-hit' : 'crit-miss'}>{thorough ? '✓' : '○'} Enough detail — 10 pts</li>
          </ul>
          {!thorough ? <div className="hint">Add more detail and save again to earn the full {total}.</div> : null}
        </div>
      ) : null}
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}

      <label htmlFor={`prac-${activityId}`}>Your practice response</label>
      <textarea
        id={`prac-${activityId}`}
        name="practice"
        rows={6}
        placeholder="Do the practice above and write it here…"
        defaultValue={existing ?? ''}
        required
      />
      <p className="hint">
        Auto-graded out of {total} on completion: 10 for doing it, 10 for enough detail (about 50+ words).
      </p>
      <SaveBtn />
    </form>
  );
}
