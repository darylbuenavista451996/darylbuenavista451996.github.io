'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateLessonText, type ActionState } from '../actions';
import type { ActivityEdit } from '@/lib/teacherData';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save lesson text'}
    </button>
  );
}

export default function LessonTextForm({ activity }: { activity: ActivityEdit }) {
  const [state, action] = useFormState<ActionState, FormData>(updateLessonText, {});
  return (
    <form action={action} className="lesson-text-edit">
      <input type="hidden" name="activity_id" value={activity.activity_id} />
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}
      {state.ok ? <div className="banner banner-success" role="status">{state.message}</div> : null}

      <label>
        Title
        <input name="title" type="text" defaultValue={activity.title} required />
      </label>
      <label>
        Lesson goal
        <span className="field-hint">One sentence: what the student will be able to do.</span>
        <textarea name="lesson_goal" rows={2} defaultValue={activity.lesson_goal ?? ''} />
      </label>
      <label>
        Opening hook
        <span className="field-hint">A question or thought that opens the lesson.</span>
        <textarea name="before_hook" rows={2} defaultValue={activity.before_hook ?? ''} />
      </label>
      <label>
        Activity brief
        <span className="field-hint">The instructions for the task the student submits.</span>
        <textarea name="activity_brief" rows={4} defaultValue={activity.activity_brief ?? ''} />
      </label>
      <label>
        Closing bridge
        <span className="field-hint">A short wrap-up that leads into the next task.</span>
        <textarea name="after_bridge" rows={2} defaultValue={activity.after_bridge ?? ''} />
      </label>
      <Btn />
    </form>
  );
}
