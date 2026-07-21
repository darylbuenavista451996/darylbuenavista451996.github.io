'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginWithEmail, type LoginState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export default function EmailLoginForm() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginWithEmail, {});

  return (
    <form action={formAction} className="stack" noValidate>
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@gmail.com" required />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Your password" required />
      </div>

      <SubmitButton />
    </form>
  );
}
