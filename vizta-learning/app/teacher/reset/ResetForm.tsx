'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { teacherBrowserClient } from '@/lib/teacherBrowser';

export default function ResetForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  // The reset link from the email establishes a temporary recovery session.
  useEffect(() => {
    const supabase = teacherBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (session) setReady(true);
      });
      return () => sub.subscription.unsubscribe();
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError('Use a password of at least 8 characters.');
    if (password !== confirm) return setError('The two passwords do not match.');
    setPending(true);
    try {
      const supabase = teacherBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.push('/teacher/login'), 1800);
    } catch {
      setError('Could not update the password. Open this page again from the link in your email.');
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="banner banner-success" role="status">
        ✓ Password updated. Taking you to sign in…
      </div>
    );
  }

  if (!ready) {
    return (
      <p className="lede">
        Open this page from the reset link in your email. If you did, wait a moment —
        or request a new link from the “Reset your password” page.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="stack" noValidate>
      {error ? <div className="error" role="alert">{error}</div> : null}
      <div className="field">
        <label htmlFor="password">New password</label>
        <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <p className="hint">At least 8 characters.</p>
      </div>
      <div className="field">
        <label htmlFor="confirm">Confirm new password</label>
        <input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </div>
      <button className="btn btn-navy" type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Set new password'}
      </button>
    </form>
  );
}
