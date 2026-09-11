'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBrowserSupabase } from '@/lib/supabase/client';

export default function SignOutButton() {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="justify-start px-2 text-muted-foreground"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await createBrowserSupabase().auth.signOut();
        window.location.href = '/admin';
      }}
    >
      <LogOut />
      {busy ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
