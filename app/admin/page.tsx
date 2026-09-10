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
    <div className="mx-auto flex max-w-md flex-col items-start gap-4 pt-16">
      <h1 className="font-syne text-2xl font-bold">RAG evaluation dashboard</h1>

      {user ? (
        <>
          <p className="text-sm text-[var(--white-dim)]">
            Signed in as <span className="text-white">{user.email}</span>, which isn&apos;t on
            the admin allow-list.
          </p>
          <SignOutButton />
        </>
      ) : (
        <>
          <p className="text-sm text-[var(--white-dim)]">
            Sign in with an allow-listed Google account.
          </p>
          {denied && (
            <p className="text-sm text-[var(--ember)]">
              That account isn&apos;t authorised for the admin area.
            </p>
          )}
          {error && (
            <p className="text-sm text-[var(--ember)]">Sign-in error: {error}. Try again.</p>
          )}
          <SignInButton />
        </>
      )}
    </div>
  );
}
