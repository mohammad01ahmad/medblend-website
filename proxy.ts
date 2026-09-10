// Session refresh + coarse gate for the /admin area (Next 16 "proxy" convention,
// formerly middleware.ts). Follows the Supabase Next.js SSR guide: rebuild the
// response so refreshed auth cookies propagate, call getUser() (never
// getSession() here), and bounce unauthenticated requests to /admin before any
// page renders. The fine-grained "is this user an admin" check lives in
// lib/admin.ts (needs the service-role client, which doesn't belong here).

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Everything under /admin except the landing page itself needs a session.
  const { pathname } = request.nextUrl;
  if (!user && pathname !== '/admin' && pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
