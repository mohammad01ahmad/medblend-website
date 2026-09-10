// Cookie-bound Supabase client for the /admin area — used ONLY to answer "who is
// this request" (session + user identity). All actual data access goes through
// the service-role client in lib/supabase.ts. Publishable key, RLS applies.
//
// Split from lib/supabase.ts (service role) on purpose: this one is safe in any
// server component; that one must never leave server-only code.

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Called from a Server Component (read-only cookie store) in most of
          // the /admin pages — that throws, and middleware.ts has already
          // refreshed the session, so swallow it. The write path that matters
          // (the OAuth callback route) uses a mutable store and succeeds.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* no-op: refresh handled in middleware */
          }
        },
      },
    },
  );
}
