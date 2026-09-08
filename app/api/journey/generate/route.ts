import { z } from 'zod';
import { errorResponse, successResponse, withApi, type ValidationError } from '@/lib/api-response';
import { supabaseAdmin } from '@/lib/supabase';
import { SKELETON } from '@/lib/journey/skeleton';
import { embed } from '@/lib/journey/openrouter';
import { hybridSearch } from '@/lib/journey/retrieve';
import { rerankChunks } from '@/lib/journey/rerank';
import { fillCourse } from '@/lib/journey/run';

// POST /api/journey/generate — run the RAG pipeline for a course.
//   { course, milestone_id?, dry_run? }
//   dry_run: true      → retrieve + rerank only, no LLM, no writes (eyeball the top 5)
//   ?refresh=1         → re-generate milestones that already have a row; needs x-admin-secret
//   otherwise          → generate the milestones with no row yet, capped at 8 per call
// Same pipeline as scripts/journey-generate.ts (lib/journey/run.ts → generateMilestoneContent).
// spec §9.2, plan §3.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Vercel Fluid — a batch of 8 free-model generations

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-admin-secret',
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

const bodySchema = z.object({
  course: z.enum(['MBBS', 'MD']),
  milestone_id: z.string().optional(),
  dry_run: z.boolean().optional(),
});

function zodErrors(err: z.ZodError): ValidationError[] {
  return err.issues.map((i) => ({ field: i.path.join('.') || '(body)', reason: i.message }));
}

export async function POST(req: Request) {
  const result = await withApi<unknown>(async () => {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return errorResponse('Missing bearer token', 401);
    const admin = supabaseAdmin();
    const { data: auth, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !auth.user) return errorResponse('Invalid or expired token', 401);

    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return errorResponse('Invalid JSON body', 400);
    }
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) return errorResponse('Invalid request body', 400, zodErrors(parsed.error));
    const { course, milestone_id, dry_run } = parsed.data;

    // dry_run: retrieve + rerank only — no model call, no rows written.
    if (dry_run) {
      const skeleton = SKELETON[course].flatMap((p) => p.milestones);
      const milestone = milestone_id ? skeleton.find((m) => m.id === milestone_id) : skeleton[0];
      if (!milestone) return errorResponse(`Unknown milestone "${milestone_id}" for ${course}`, 400);
      const [vec] = await embed([milestone.retrieval_query]);
      const candidates = await hybridSearch(milestone.retrieval_query, vec, course, 20);
      const top5 = await rerankChunks(milestone.retrieval_query, candidates, 5);
      return successResponse('dry run', {
        milestone_id: milestone.id,
        query: milestone.retrieval_query,
        top_score: top5[0]?.rerank_score ?? 0,
        chunks: top5.map((c) => ({
          source: c.metadata.source ?? null,
          section: c.metadata.section ?? null,
          rrf_score: c.rrf_score,
          rerank_score: c.rerank_score,
          text: c.text,
        })),
      });
    }

    const refresh = new URL(req.url).searchParams.get('refresh') === '1';
    if (refresh) {
      const secret = req.headers.get('x-admin-secret');
      if (!process.env.JOURNEY_ADMIN_SECRET || secret !== process.env.JOURNEY_ADMIN_SECRET) {
        return errorResponse('Forbidden', 403);
      }
    }

    const { milestones, pending } = await fillCourse(course, {
      milestoneId: milestone_id,
      refresh,
      concurrency: 4,
      cap: 8,
    });
    return successResponse('ok', { skeleton: SKELETON[course], milestones, pending });
  });

  return Response.json(result, { status: result.code, headers: CORS });
}
