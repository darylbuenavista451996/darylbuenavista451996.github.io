'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitActivity, type SubmitState } from './actions';
import type { SubmissionRow } from '@/lib/data';

function SaveButton({ locked }: { locked: boolean }) {
  const { pending } = useFormStatus();
  if (locked) return null;
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Submit my work'}
    </button>
  );
}

export default function ActivitySubmit({
  activityId,
  kind,
  existing,
}: {
  activityId: string;
  kind: 'text' | 'link' | 'image';
  existing: SubmissionRow | null;
}) {
  const bound = submitActivity.bind(null, activityId);
  const [state, formAction] = useFormState<SubmitState, FormData>(bound, {});

  const graded = existing?.status === 'Graded';
  const submitted = existing?.status === 'Submitted' || state.ok === true;
  // Once submitted (or graded), the answer is final — no re-editing.
  const locked = graded || submitted;

  return (
    <form action={formAction} className="submit-box">
      {graded ? (
        <div className="banner banner-success" role="status">
          <strong>Graded{existing?.grade != null ? `: ${existing.grade} points` : ''}.</strong>
          {existing?.feedback ? <div className="feedback">“{existing.feedback}”</div> : null}
        </div>
      ) : submitted ? (
        <div className="banner banner-success" role="status">
          ✓ Submitted. Your teacher will review it.
        </div>
      ) : null}

      {state.error ? <div className="error" role="alert">{state.error}</div> : null}

      {kind === 'text' ? (
        <>
          <label htmlFor="content">Your answer</label>
          <textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Write your answer here…"
            defaultValue={existing?.content ?? ''}
            disabled={locked}
            required
          />
        </>
      ) : (
        <>
          <label htmlFor="content">{kind === 'image' ? 'Paste your image link' : 'Paste your link'}</label>
          <input
            id="content"
            name="content"
            type="text"
            inputMode="url"
            placeholder={kind === 'image' ? 'https://… (an image URL)' : 'https://…'}
            defaultValue={existing?.content ?? ''}
            disabled={locked}
            required
          />
        </>
      )}
      {locked ? null : (
        <p className="hint">Submissions are text, a link, or an image link — never a file upload.</p>
      )}
      <SaveButton locked={locked} />
    </form>
  );
}
