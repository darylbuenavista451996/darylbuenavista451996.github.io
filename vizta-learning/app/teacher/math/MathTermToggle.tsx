'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { toggleMathTerm, type ActionState } from '../actions';

function Btn({ unlocked }: { unlocked: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className={unlocked ? 'btn btn-ghost btn-sm' : 'btn btn-primary btn-sm'} type="submit" disabled={pending}>
      {pending ? '…' : unlocked ? 'Close term' : 'Open term'}
    </button>
  );
}

// Teacher control to open or close a whole Mathematics term for students.
export default function MathTermToggle({ term, unlocked }: { term: number; unlocked: boolean }) {
  const [state, action] = useFormState<ActionState, FormData>(toggleMathTerm, {});
  return (
    <form action={action} className="mod-toggle">
      <input type="hidden" name="term" value={term} />
      <input type="hidden" name="unlocked" value={unlocked ? 'false' : 'true'} />
      <span className={unlocked ? 'pill pill-on' : 'pill pill-off'}>{unlocked ? 'Open' : 'Closed'}</span>
      <Btn unlocked={unlocked} />
      {state.error ? <span className="error inline-error">{state.error}</span> : null}
    </form>
  );
}
