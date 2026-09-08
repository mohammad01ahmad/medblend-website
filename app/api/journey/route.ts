import { z } from 'zod';
import { errorResponse, successResponse, withApi } from '@/lib/api-response';
import { supabaseAdmin } from '@/lib/supabase';
import { SKELETON } from '@/lib/journey/skeleton';

// GET /api/journey?course=MBBS — the merged skeleton + generated content view (spec §6.3).
// Each milestone carries its content and the serve-gate flags; the "gaps report" is the
// caller's `milestones.filter(m => !m.schema_valid || !m.sufficient_context)`. This is the
// app's eventual read path. JWT-gated. plan §3b.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

const courseSchema = z.enum(['MBBS', 'MD']);

export async function GET(req: Request) {
  const result = await withApi(async () => {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return errorResponse('Missing bearer token', 401);
    const admin = supabaseAdmin();
    const { data: auth, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !auth.user) return errorResponse('Invalid or expired token', 401);

    const parsed = courseSchema.safeParse(new URL(req.url).searchParams.get('course'));
    if (!parsed.success) return errorResponse('?course must be MBBS or MD', 400);
    const course = parsed.data;

    const { data: rows, error } = await admin
      .from('milestone_content')
      .select(
        'milestone_id, content, sources, document_date, top_score, schema_valid, sufficient_context, gaps, status, generated_at',
      )
      .eq('course', course);
    if (error) return errorResponse(`milestone_content read failed: ${error.message}`, 500);

    const byId = new Map((rows ?? []).map((r) => [r.milestone_id as string, r]));
    const milestones = SKELETON[course].flatMap((p) =>
      p.milestones.map((m) => {
        const row = byId.get(m.id);
        return {
          milestone_id: m.id,
          phase_id: m.phase_id,
          name: m.name,
          order: m.order,
          tier: m.tier,
          content: row?.content ?? null,
          sources: row?.sources ?? [],
          document_date: row?.document_date ?? null,
          top_score: row?.top_score ?? null,
          schema_valid: row?.schema_valid ?? null,
          sufficient_context: row?.sufficient_context ?? null,
          gaps: row?.gaps ?? null,
          status: row?.status ?? null,
          generated_at: row?.generated_at ?? null,
          servable: !!row?.schema_valid && !!row?.sufficient_context,
        };
      }),
    );

    return successResponse('ok', { skeleton: SKELETON[course], milestones });
  });

  return Response.json(result, { status: result.code, headers: CORS });
}
