'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { teacherBrowserClient } from '@/lib/teacherBrowser';

export default function TeacherLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      // Guard against misconfigured/placeholder env values (baked in at build).
      const cfgUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const cfgKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const urlOk =
        /^https:\/\//.test(cfgUrl) || /^http:\/\/(localhost|127\.0\.0\.1)/.test(cfgUrl);
      if (
        !urlOk ||
        cfgUrl.includes('aBcDe') ||
        cfgKey.length < 30 ||
        cfgKey.includes('aBcDe')
      ) {
        setError(
          'This site is not fully set up yet. In Vercel, make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are your real Supabase values, then Redeploy with "Use existing Build Cache" turned OFF.'
        );
        setPending(false);
        return;
      }
      const supabase = teacherBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (error.code === 'email_not_confirmed' || msg.includes('not confirmed')) {
          setError(
            "This account's email isn't confirmed yet. In Supabase → Authentication → Users, delete it and re-add with “Auto Confirm User” ticked."
          );
        } else if (error.code === 'invalid_credentials' || msg.includes('invalid login')) {
          setError('Email or password is incorrect.');
        } else {
          setError(error.message || 'Could not sign in. Please try again.');
        }
        setPending(false);
        return;
      }
      router.push('/teacher');
      router.refresh();
    } catch {
      setError('Could not sign in. Please check your connection and try again.');
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="stack" noValidate>
      {error ? <div className="error" role="alert">{error}</div> : null}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          inputMode="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="btn btn-navy" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
