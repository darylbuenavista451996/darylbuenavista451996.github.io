'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitActivity, type SubmitState } from './actions';
import type { SubmissionRow } from '@/lib/data';
import { useDraft, draftKey, clearDraft } from '@/lib/useDraft';

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
  studentKey,
}: {
  activityId: string;
  kind: 'text' | 'link' | 'image';
  existing: SubmissionRow | null;
  studentKey: string;
}) {
  const bound = submitActivity.bind(null, activityId);
  const [state, formAction] = useFormState<SubmitState, FormData>(bound, {});

  const graded = existing?.status === 'Graded';
  const submitted = existing?.status === 'Submitted' || state.ok === true;
  // Once submitted (or graded), the answer is final — no re-editing.
  const locked = graded || submitted;

  const key = draftKey(studentKey, activityId, 'activity');
  const [content, setContent] = useDraft(key, existing?.content ?? '', !locked);

  // Clear the saved draft once the work is actually submitted.
  useEffect(() => {
    if (locked) clearDraft(key);
  }, [locked, key]);

  return (
    <form action={formAction} className="submit-box">
      {graded ? (
        <div className="banner banner-success" role="status">
          <strong>Graded{existing?.grade != null ? `: ${existing.grade} points` : ''}.</strong>
          {existing?.feedback ? <div className="feedback">“{existing.feedback}”</div> : null}
        </div>
      ) : submitted ? (
        <div className="banner banner-success" role="status">
          ✓ Submitted. This will be checked by your teacher.
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={locked}
            required
          />
        </>
      )}
      {locked ? null : (
        <p className="hint">Your answer is saved on this device as you type, so it is not lost if you sign out. Submissions are text, a link, or an image link — never a file upload.</p>
      )}
      <SaveButton locked={locked} />
    </form>
  );
}
