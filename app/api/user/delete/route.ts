import { errorResponse, successResponse, withApi } from '@/lib/api-response';
import { supabaseAdmin } from '@/lib/supabase';

// Account deletion for the mobile app. The client can only delete its own
// public.users row (RLS); removing the auth.users identity needs the service
// role, which only lives here. public.users.id has ON DELETE CASCADE from
// auth.users, so deleting the auth user takes the profile row with it.
//
// First real endpoint in this repo. When there's a second, pull the auth check
// into a withAuth() wrapper (docs/ARCHITECTURE.md §4.3, docs/SECURITY.md §2.4)
// — not worth the abstraction for one.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Safe by JWT regardless of origin (docs/SECURITY.md §3.4). `*` is fine with a
// Bearer token — no cookies involved. Needed for the app's web build; native
// fetch ignores CORS.
// const CORS = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
//   'Access-Control-Allow-Headers': 'authorization, content-type',
// };

// export function OPTIONS() {
//   return new Response(null, { status: 204, headers: CORS });
// }

export async function DELETE(req: Request) {
  const result = await withApi(async () => {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    console.log('token', token);
    if (!token) return errorResponse('Missing bearer token', 401);

    const admin = supabaseAdmin();

    // Verify the caller and take the id from the verified token — never the body
    // (docs/SECURITY.md §4.3).
    const { data, error: authError } = await admin.auth.getUser(token);
    if (authError || !data.user) return errorResponse('Invalid or expired token', 401);

    const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
    if (deleteError) return errorResponse(deleteError.message, 500);

    return successResponse('Account deleted');
  });

  return Response.json(result, { status: result.code });
}
