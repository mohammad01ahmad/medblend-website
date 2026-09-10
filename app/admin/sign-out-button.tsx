'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/client';

export default function SignOutButton() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={async () => {
        setBusy(true);
        await createBrowserSupabase().auth.signOut();
        window.location.href = '/admin';
      }}
      disabled={busy}
      className="text-sm text-[var(--white-dim)] underline underline-offset-4 hover:text-white disabled:opacity-50"
    >
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
