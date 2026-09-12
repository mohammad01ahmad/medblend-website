'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    <Button onClick={signIn} disabled={busy}>
      {busy ? 'Redirecting…' : 'Sign in with Google'}
    </Button>
  );
}
