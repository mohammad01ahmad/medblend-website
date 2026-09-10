// The /admin authorization gate. Two checks, in order:
//   1. a valid Supabase session (identity)  — createServerSupabase()
//   2. a row in public.admin_users           — service-role lookup
//
// admin_users is service-role-only (RLS default-deny, revoked from
// anon/authenticated), so the check MUST use supabaseAdmin(). Never expose this
// table or its contents to the client.

import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createServerSupabase } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin()
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(`admin_users lookup failed: ${error.message}`);
  return !!data;
}

/**
 * Guard for /admin server pages. Redirects to /admin (login) when signed out,
 * or /admin?denied=1 when signed in but not on the allow-list. Returns the
 * verified admin user otherwise.
 */
export async function requireAdmin(): Promise<{ user: User }> {
  const user = await getSessionUser();
  if (!user) redirect('/admin');
  if (!(await isAdmin(user.id))) redirect('/admin?denied=1');
  return { user };
}
