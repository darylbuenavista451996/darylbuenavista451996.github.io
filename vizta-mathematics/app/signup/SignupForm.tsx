'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signUpStudent, type SignupState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? 'Creating your account…' : 'Create my account'}
    </button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useFormState<SignupState, FormData>(signUpStudent, {});

  return (
    <form action={formAction} className="stack" noValidate>
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}

      <div className="field">
        <label htmlFor="name">Your full name</label>
        <input id="name" name="name" type="text" autoComplete="name" placeholder="e.g. Juan Dela Cruz" required />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@gmail.com" required />
        <p className="hint">You&apos;ll use this to sign in. Your Gmail is fine.</p>
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" required minLength={8} />
      </div>

      <div className="field">
        <label htmlFor="classCode">Mathematics class code</label>
        <input
          id="classCode"
          name="classCode"
          type="text"
          autoCapitalize="characters"
          autoComplete="off"
          placeholder="e.g. MATH9"
          required
        />
        <p className="hint">Your teacher gives you this code. It puts you in the right class.</p>
      </div>

      <SubmitButton />
    </form>
  );
}
