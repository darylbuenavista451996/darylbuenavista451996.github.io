'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitActivity, type SubmitState } from './actions';
import type { SubmissionRow } from '@/lib/data';

function SaveButton({ graded }: { graded: boolean }) {
  const { pending } = useFormStatus();
  if (graded) return null;
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
  const submitted = existing?.status === 'Submitted' || state.ok;

  return (
    <form action={formAction} className="submit-box">
      {graded ? (
        <div className="banner banner-success" role="status">
          <strong>Graded{existing?.grade != null ? `: ${existing.grade} points` : ''}.</strong>
          {existing?.feedback ? <div className="feedback">“{existing.feedback}”</div> : null}
          <div className="hint">A graded submission can no longer be changed.</div>
        </div>
      ) : submitted ? (
        <div className="banner banner-success" role="status">
          ✓ Submitted. You can still edit and resubmit until your teacher grades it.
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
            disabled={graded}
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
            disabled={graded}
            required
          />
        </>
      )}
      <p className="hint">Submissions are text, a link, or an image link — never a file upload.</p>
      <SaveButton graded={graded} />
    </form>
  );
}
