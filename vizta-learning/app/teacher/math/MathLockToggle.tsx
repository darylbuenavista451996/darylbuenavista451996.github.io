'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { toggleMathLesson, type ActionState } from '../actions';

function Btn({ unlocked }: { unlocked: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`btn btn-sm ${unlocked ? 'btn-ghost' : 'btn-primary'}`}
      disabled={pending}
    >
      {pending ? 'Saving…' : unlocked ? 'Lock lesson' : 'Unlock lesson'}
    </button>
  );
}

// Teacher control to open or close a math lesson for students. Locked lessons
// cannot be answered; students see a "locked" screen until it's unlocked.
export default function MathLockToggle({
  lessonId,
  unlocked,
}: {
  lessonId: string;
  unlocked: boolean;
}) {
  const [state, action] = useFormState<ActionState, FormData>(toggleMathLesson, {});
  return (
    <form action={action} className="math-lock-form">
      <input type="hidden" name="lesson_id" value={lessonId} />
      <input type="hidden" name="unlocked" value={(!unlocked).toString()} />
      <Btn unlocked={unlocked} />
      {state.error ? <span className="reset-pw-err">{state.error}</span> : null}
    </form>
  );
}
