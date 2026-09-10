// Browser Supabase client — used only by the /admin sign-in button to kick off
// the Google OAuth redirect. Publishable key only.
'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
