'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signUpTeacher, type SignupState } from './actions';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-navy" type="submit" disabled={pending}>
      {pending ? 'Creating…' : 'Create my teacher account'}
    </button>
  );
}

export default function SignupForm() {
  const [state, action] = useFormState<SignupState, FormData>(signUpTeacher, {});

  if (state.ok) {
    return (
      <div className="stack">
        <div className="banner banner-success" role="status">
          ✓ Account created. You can sign in now.
        </div>
        <Link className="btn btn-primary" href="/teacher/login">Go to sign in</Link>
      </div>
    );
  }

  return (
    <form action={action} className="stack" noValidate>
      {state.error ? <div className="error" role="alert">{state.error}</div> : null}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="text" inputMode="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required />
        <p className="hint">At least 8 characters.</p>
      </div>
      <div className="field">
        <label htmlFor="code">Teacher code</label>
        <input id="code" name="code" type="text" autoComplete="off" required />
        <p className="hint">The private code from your school admin. Keeps sign-up staff-only.</p>
      </div>
      <Btn />
    </form>
  );
}
