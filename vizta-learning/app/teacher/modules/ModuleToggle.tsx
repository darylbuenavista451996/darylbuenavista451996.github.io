'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { toggleModule, type ActionState } from '../actions';

function Btn({ unlocked }: { unlocked: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className={unlocked ? 'btn btn-ghost btn-sm' : 'btn btn-primary btn-sm'} type="submit" disabled={pending}>
      {pending ? '…' : unlocked ? 'Lock' : 'Unlock'}
    </button>
  );
}

export default function ModuleToggle({
  moduleId,
  unlocked,
}: {
  moduleId: string;
  unlocked: boolean;
}) {
  const [state, action] = useFormState<ActionState, FormData>(toggleModule, {});
  return (
    <form action={action} className="mod-toggle">
      <input type="hidden" name="module_id" value={moduleId} />
      <input type="hidden" name="unlocked" value={unlocked ? 'false' : 'true'} />
      <span className={unlocked ? 'pill pill-on' : 'pill pill-off'}>
        {unlocked ? 'Unlocked' : 'Locked'}
      </span>
      <Btn unlocked={unlocked} />
      {state.error ? <span className="error inline-error">{state.error}</span> : null}
    </form>
  );
}
