// The generation pipeline for ONE (milestone, course). Always writes a milestone_content
// row (the latest answer) AND appends a rag_runs row (the history). spec §3.2 / §9.2.
// Langfuse trace wrapping is added in a later slice — rag_runs is the first-party record.

import { supabaseAdmin } from '@/lib/supabase';
import { SKELETON, type Course, type Milestone } from '@/lib/journey/skeleton';
import { contentSchema, contentJsonSchema } from '@/lib/journey/content-schema';
import { embed, chatJSON } from '@/lib/journey/openrouter';
import { hybridSearch } from '@/lib/journey/retrieve';
import { rerankChunks, type RankedChunk } from '@/lib/journey/rerank';
import { buildPrompt, PROMPT_VERSION } from '@/lib/journey/prompt';

export type Driver = 'generate' | 'refresh' | 'dry_run';

export interface GenSummary {
  milestone_id: string;
  course: Course;
  schema_valid: boolean | null;
  sufficient_context: boolean;
  top_score: number;
  n_chunks: number;
  servable: boolean;
}

// Find the phase for a given milestone
function phaseFor(milestone: Milestone, course: Course) {
  const phase = SKELETON[course].find((p) => p.id === milestone.phase_id);
  if (!phase) throw new Error(`skeleton: no phase ${milestone.phase_id} for ${course}`);
  return phase;
}

// utils
function distinctSources(chunks: RankedChunk[]): string[] {
  return [...new Set(chunks.map((c) => c.metadata.source).filter((s): s is string => !!s))];
}

function oldestDate(chunks: RankedChunk[]): string | null {
  const dates = chunks
    .map((c) => c.metadata.document_date)
    .filter((d): d is string => !!d)
    .sort();
  return dates[0] ?? null;
}

export async function generateMilestoneContent(milestone: Milestone, course: Course, driver: Driver = 'generate',): Promise<GenSummary> {

  const db = supabaseAdmin();
  const phase = phaseFor(milestone, course);
  const base = { milestone_id: milestone.id, course, phase_id: phase.id };

  // Log the run
  const runRow = (extra: Record<string, unknown>) =>
    db.from('rag_runs').insert({
      milestone_id: milestone.id,
      course,
      driver,
      prompt_version: PROMPT_VERSION,
      ...extra,
    });

  try {
    const queryText = milestone.retrieval_query;
    const [vec] = await embed([queryText]);
    const candidates = await hybridSearch(queryText, vec, course, 20);

    // --- the only pre-LLM skip: zero chunks retrieved (spec §7.2) ---
    if (candidates.length === 0) {
      const gaps = 'no_sources: nothing matched this milestone';
      await db.from('milestone_content').upsert(
        {
          ...base,
          content: null,
          raw_output: null,
          sources: [],
          document_date: null,
          top_score: 0,
          schema_valid: null,
          sufficient_context: false,
          gaps,
          model: null,
          prompt_version: PROMPT_VERSION,
          status: 'unreviewed',
          generated_at: new Date().toISOString(),
        },
        { onConflict: 'milestone_id,course' },
      );
      await runRow({
        top_score: 0,
        chunk_ids: [],
        n_chunks: 0,
        schema_valid: null,
        sufficient_context: false,
        gaps,
        model: null,
        error: null,
      });
      return {
        ...base,
        schema_valid: null,
        sufficient_context: false,
        top_score: 0,
        n_chunks: 0,
        servable: false,
      };
    }

    const top5 = await rerankChunks(queryText, candidates, 5);
    const topScore = top5[0]?.rerank_score ?? 0;

    const { system, user } = buildPrompt(milestone, course, phase.name, top5, contentJsonSchema);
    const { text, model, usage } = await chatJSON(system, user, contentJsonSchema);

    let content: unknown = null;
    let rawOutput: string | null = text;
    let schemaValid = false;
    let sufficientContext = false;
    let gaps: string | null = null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = undefined;
    }
    if (parsed !== undefined) {
      const res = contentSchema.safeParse(parsed);
      if (res.success) {
        content = res.data;
        rawOutput = null;
        schemaValid = true;
        sufficientContext = res.data.sufficient_context;
        gaps = res.data.gaps || null;
      }
    }

    const sources = distinctSources(top5);
    const documentDate = oldestDate(top5);

    await db.from('milestone_content').upsert(
      {
        ...base,
        content,
        raw_output: rawOutput,
        sources,
        document_date: documentDate,
        top_score: topScore,
        schema_valid: schemaValid,
        sufficient_context: sufficientContext,
        gaps,
        model,
        prompt_version: PROMPT_VERSION,
        status: 'unreviewed',
        generated_at: new Date().toISOString(),
      },
      { onConflict: 'milestone_id,course' },
    );

    await runRow({
      top_score: topScore,
      chunk_ids: top5.map((c) => c.id),
      n_chunks: top5.length,
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      cost_usd: usage.cost_usd,
      model,
      schema_valid: schemaValid,
      sufficient_context: sufficientContext,
      gaps,
      error: null,
    });

    return {
      ...base,
      schema_valid: schemaValid,
      sufficient_context: sufficientContext,
      top_score: topScore,
      n_chunks: top5.length,
      servable: schemaValid && sufficientContext,
    };
  } catch (err) {
    try {
      await runRow({ error: err instanceof Error ? err.message : String(err) });
    } catch {
      // best-effort — the original error is what matters
    }
    throw err;
  }
}
