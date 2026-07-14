'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { triggerExport, type ActionState } from './actions';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-sm" type="submit" disabled={pending}>
      {pending ? 'Starting…' : 'Export now'}
    </button>
  );
}

export default function ExportButton() {
  const [state, action] = useFormState<ActionState, FormData>(
    (prev: ActionState) => triggerExport(prev),
    {}
  );
  return (
    <form action={action} className="export-btn">
      <Btn />
      {state.error ? <div className="error inline-error" role="alert">{state.error}</div> : null}
      {state.ok ? <div className="banner banner-success" role="status">{state.message}</div> : null}
    </form>
  );
}
