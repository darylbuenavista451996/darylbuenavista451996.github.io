'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { saveReflection, type ReflectionState } from './actions';

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save my reflection'}
    </button>
  );
}

export default function ReflectionBox({
  activityId,
  existing,
  initiallyDone,
}: {
  activityId: string;
  existing: string | null;
  initiallyDone: boolean;
}) {
  const bound = saveReflection.bind(null, activityId);
  const [state, formAction] = useFormState<ReflectionState, FormData>(bound, {});
  const done = state.done || (initiallyDone && !state.error);

  return (
    <form action={formAction} className="reflection-box">
      {done ? (
        <div className="banner banner-success" role="status">
          ✓ Reflection saved. You have completion credit for this. You can still edit it.
        </div>
      ) : null}
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}
      <label htmlFor={`refl-${activityId}`}>Write your reflection</label>
      <textarea
        id={`refl-${activityId}`}
        name="reflection"
        rows={5}
        placeholder="A few honest sentences…"
        defaultValue={existing ?? ''}
        required
      />
      <p className="hint">This is graded on completion, not right or wrong — write at least 15 words.</p>
      <SaveBtn />
    </form>
  );
}
