'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { gradeSubmission, type ActionState } from '../actions';
import type { GradeQueueItem } from '@/lib/teacherData';

function looksLikeUrl(s: string | null): boolean {
  return !!s && /^https?:\/\//i.test(s.trim());
}

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save grade'}
    </button>
  );
}

export default function GradeForm({ item }: { item: GradeQueueItem }) {
  const [state, action] = useFormState<ActionState, FormData>(gradeSubmission, {});
  const url = looksLikeUrl(item.content);

  return (
    <li className="grade-item">
      <div className="grade-head">
        <div>
          <strong>{item.student_name}</strong>
          <span className="grade-sub">{item.activity_title}{item.status === 'Graded' ? ' · already graded' : ''}</span>
        </div>
        {item.rubric_total != null ? <span className="badge">out of {item.rubric_total}</span> : null}
      </div>

      <div className="grade-content">
        {item.content ? (
          url ? (
            <a href={item.content} target="_blank" rel="noopener noreferrer">{item.content}</a>
          ) : (
            <p className="grade-text">{item.content}</p>
          )
        ) : (
          <p className="hint">No content submitted.</p>
        )}
      </div>

      <form action={action} className="grade-form">
        <input type="hidden" name="student_id" value={item.student_id} />
        <input type="hidden" name="activity_id" value={item.activity_id} />
        {item.rubric_total != null ? <input type="hidden" name="rubric_total" value={item.rubric_total} /> : null}
        {state.error ? <div className="error" role="alert">{state.error}</div> : null}
        {state.ok ? <div className="banner banner-success" role="status">{state.message}</div> : null}
        <div className="grade-row">
          <label className="grade-grade">
            Grade
            <input name="grade" type="text" inputMode="numeric" defaultValue={item.grade ?? ''} placeholder="0" required />
          </label>
          <label className="grade-fb">
            Feedback (optional)
            <input name="feedback" type="text" defaultValue={item.feedback ?? ''} placeholder="A short note for the student" />
          </label>
          <Btn />
        </div>
      </form>
    </li>
  );
}
