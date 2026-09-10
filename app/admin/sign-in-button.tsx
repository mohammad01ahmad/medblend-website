'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/client';

export default function SignInButton() {
  const [busy, setBusy] = useState(false);

  async function signIn() {
    setBusy(true);
    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin/dashboard`,
      },
    });
    if (error) {
      setBusy(false);
      alert(`Sign-in failed: ${error.message}`);
    }
    // on success the browser is already navigating to Google
  }

  return (
    <button
      onClick={signIn}
      disabled={busy}
      className="rounded-lg border border-[var(--border-subtle)] bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
    >
      {busy ? 'Redirecting…' : 'Sign in with Google'}
    </button>
  );
}
