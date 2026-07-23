'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { savePractice, type PracticeState } from './actions';
import { useDraft, draftKey } from '@/lib/useDraft';

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
  studentKey,
}: {
  activityId: string;
  total: number;
  existing: string | null;
  existingScore: number | null;
  thoroughInitially: boolean;
  studentKey: string;
}) {
  const bound = savePractice.bind(null, activityId);
  const [state, formAction] = useFormState<PracticeState, FormData>(bound, {});

  // "Submitted" once it has been saved (this visit or a previous one). We no
  // longer show a number to the student — the teacher checks it.
  const submitted = state.ok || existingScore != null;

  const key = draftKey(studentKey, activityId, 'practice');
  const [text, setText] = useDraft(key, existing ?? '');

  return (
    <form action={formAction} className="practice-box">
      {submitted ? (
        <div className="banner banner-success" role="status">
          ✓ Submitted. This will be checked by your teacher.
        </div>
      ) : null}
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}

      <label htmlFor={`prac-${activityId}`}>Activity</label>
      <textarea
        id={`prac-${activityId}`}
        name="practice"
        rows={6}
        placeholder="Write your answer here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <p className="hint">Saved on this device as you type, so it is not lost if you sign out. You can edit and submit again.</p>
      <div className="practice-foot">
        <span className="practice-total">Worth {total} points</span>
        <SaveBtn />
      </div>
    </form>
  );
}
