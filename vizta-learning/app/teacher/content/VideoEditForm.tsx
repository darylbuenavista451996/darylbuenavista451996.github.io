'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { updateVideo, type ActionState } from '../actions';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save video'}
    </button>
  );
}

export default function VideoEditForm({
  activityId,
  title,
  videoUrl,
  videoTitle,
}: {
  activityId: string;
  title: string;
  videoUrl: string | null;
  videoTitle: string | null;
}) {
  const [state, action] = useFormState<ActionState, FormData>(updateVideo, {});
  return (
    <form action={action} className="video-edit">
      <input type="hidden" name="activity_id" value={activityId} />
      <div className="video-edit-head">
        <strong>{title}</strong>
        <Link className="edit-text-link" href={`/teacher/content/${activityId}`}>Edit lesson text →</Link>
      </div>
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}
      {state.ok ? <div className="banner banner-success" role="status">{state.message}</div> : null}
      <label>
        Video link (YouTube)
        <input name="video_url" type="text" defaultValue={videoUrl ?? ''} placeholder="https://www.youtube.com/watch?v=…" />
      </label>
      <label>
        Video title
        <input name="video_title" type="text" defaultValue={videoTitle ?? ''} placeholder="Shown under the video" />
      </label>
      <Btn />
    </form>
  );
}
