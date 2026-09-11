import { redirect } from 'next/navigation';
import { getSessionUser, isAdmin } from '@/lib/admin';
import SignInButton from './sign-in-button';
import SignOutButton from './sign-out-button';

export const dynamic = 'force-dynamic';

export default async function AdminLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string; error?: string }>;
}) {
  const { denied, error } = await searchParams;
  const user = await getSessionUser();

  if (user && (await isAdmin(user.id))) redirect('/admin/dashboard');

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="flex w-full max-w-sm flex-col items-start gap-4 rounded-xl border bg-card p-6">
        <h1 className="text-lg font-semibold tracking-tight">RAG evaluation dashboard</h1>

        {user ? (
          <>
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground">{user.email}</span>, which isn&apos;t
              on the admin allow-list.
            </p>
            <SignOutButton />
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Sign in with an allow-listed Google account.
            </p>
            {denied && (
              <p className="text-sm text-destructive">
                That account isn&apos;t authorised for the admin area.
              </p>
            )}
            {error && <p className="text-sm text-destructive">Sign-in error: {error}. Try again.</p>}
            <SignInButton />
          </>
        )}
      </div>
    </main>
  );
}
