'use client';

import { useState } from 'react';
import { teacherBrowserClient } from '@/lib/teacherBrowser';

export default function ForgotForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const supabase = teacherBrowserClient();
      const redirectTo = `${window.location.origin}/teacher/reset`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      });
      if (error) throw error;
      setSent(true);
    } catch {
      // Always show the same message so we don't reveal which emails exist.
      setSent(true);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="banner banner-success" role="status">
        If an account exists for that email, a reset link is on its way. Check your
        inbox (and spam), then follow the link to set a new password.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="stack" noValidate>
      {error ? <div className="error" role="alert">{error}</div> : null}
      <div className="field">
        <label htmlFor="email">Your email</label>
        <input
          id="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-navy" type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Email me a reset link'}
      </button>
    </form>
  );
}
