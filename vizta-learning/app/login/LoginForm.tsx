'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, type LoginState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Checking…' : 'Enter my class'}
    </button>
  );
}

export default function LoginForm({ suggestedCode }: { suggestedCode?: string }) {
  const [state, formAction] = useFormState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="stack" noValidate>
      {state.error ? (
        <div className="error" role="alert">
          {state.error}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="classCode">Class code</label>
        <input
          id="classCode"
          name="classCode"
          type="text"
          autoCapitalize="characters"
          autoComplete="off"
          defaultValue={suggestedCode ?? ''}
          placeholder="e.g. MEDIA9"
          required
        />
        <p className="hint">Your teacher gives you this code.</p>
      </div>

      <div className="field">
        <label htmlFor="studentNumber">Student number</label>
        <input
          id="studentNumber"
          name="studentNumber"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="e.g. 2025-0142"
          required
        />
        <p className="hint">The number your school gave you. No email, no password needed.</p>
      </div>

      <SubmitButton />
    </form>
  );
}
