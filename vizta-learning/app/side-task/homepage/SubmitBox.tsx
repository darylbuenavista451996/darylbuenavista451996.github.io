'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitHomepage, type SideTaskState } from '../actions';
import { useDraft, draftKey } from '@/lib/useDraft';

function SaveBtn({ hasLink }: { hasLink: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Saving…' : hasLink ? 'Update my link' : 'Submit my homepage'}
    </button>
  );
}

export default function SubmitBox({
  studentKey,
  existingUrl,
  grade,
  feedback,
  total,
}: {
  studentKey: string;
  existingUrl: string | null;
  grade: number | null;
  feedback: string | null;
  total: number;
}) {
  const [state, formAction] = useFormState<SideTaskState, FormData>(submitHomepage, {});

  const key = draftKey(studentKey, 'side-task-homepage', 'url');
  const [url, setUrl] = useDraft(key, existingUrl ?? '');

  const saved = state.ok || (!!existingUrl && !state.error);
  const locked = grade != null;

  if (locked) {
    return (
      <div className="st-submit">
        <div className="banner banner-success" role="status">
          ✓ Graded: <strong>{grade} / {total}</strong>
        </div>
        {feedback ? <p className="hint">Teacher note: {feedback}</p> : null}
        {existingUrl ? (
          <p className="hint">
            Your site:{' '}
            <a href={existingUrl} target="_blank" rel="noreferrer">{existingUrl}</a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={formAction} className="st-submit">
      {saved ? (
        <div className="banner banner-success" role="status">
          ✓ Link received. Your teacher will open it and grade the working parts. You can update
          it here if you improve your site.
        </div>
      ) : null}
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}
      <label htmlFor="site-url">Paste your published homepage link</label>
      <input
        id="site-url"
        name="url"
        type="url"
        inputMode="url"
        placeholder="https://your-site-name.netlify.app"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <p className="hint">
        Saved on this device as you type, so it is not lost if you sign out. Make sure the link
        opens your live site before you submit.
      </p>
      <SaveBtn hasLink={!!existingUrl} />
    </form>
  );
}
