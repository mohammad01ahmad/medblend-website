import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client — **server only**. Bypasses RLS, so never import
 * this into a client component or a route that echoes its results unfiltered.
 *
 * Built per call rather than at module load so `next build` doesn't need the
 * env vars present. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the
 * Vercel project settings.
 */
export function supabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set');
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
