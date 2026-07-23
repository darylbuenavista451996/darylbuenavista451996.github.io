'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { saveReflection, type ReflectionState } from './actions';
import { useDraft, draftKey } from '@/lib/useDraft';

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
  studentKey,
}: {
  activityId: string;
  existing: string | null;
  initiallyDone: boolean;
  studentKey: string;
}) {
  const bound = saveReflection.bind(null, activityId);
  const [state, formAction] = useFormState<ReflectionState, FormData>(bound, {});
  const done = state.done || (initiallyDone && !state.error);

  const key = draftKey(studentKey, activityId, 'reflection');
  const [text, setText] = useDraft(key, existing ?? '');

  return (
    <form action={formAction} className="reflection-box">
      {done ? (
        <div className="banner banner-success" role="status">
          ✓ Reflection saved. This will be checked by your teacher.
        </div>
      ) : null}
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}
      <label htmlFor={`refl-${activityId}`}>Write your reflection</label>
      <textarea
        id={`refl-${activityId}`}
        name="reflection"
        rows={5}
        placeholder="A few honest sentences…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <p className="hint">Saved on this device as you type, so it is not lost if you sign out. Write at least 15 words.</p>
      <SaveBtn />
    </form>
  );
}
