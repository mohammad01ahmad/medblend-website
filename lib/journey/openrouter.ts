// OpenRouter client for the Medical Journey pipeline — embeddings, JSON generation, and
// reranking, all on one OPENROUTER_API_KEY. Uses the `openai` SDK (OpenRouter is
// OpenAI-compatible), so retry/backoff on 408/409/429/5xx + connection errors comes for
// free via `maxRetries: 2` (spec §3.2 "2× retry with backoff"). `/rerank` isn't an SDK
// method, but `client.post()` runs it through the same retry pipeline.
//
// The client is built per call so `next build` doesn't need the env vars present
// (matches lib/supabase.ts). EMBED_MODEL is fixed — it sets the rag_chunks.embedding
// column width, so changing it means re-embedding the whole corpus (spec §3.6).
// JOURNEY_GEN_MODEL is required; JOURNEY_RERANK_MODEL defaults to cohere/rerank-4-fast.

import OpenAI from 'openai';

const BASE_URL = 'https://openrouter.ai/api/v1';
const EMBED_MODEL = 'openai/text-embedding-3-small';
const DEFAULT_RERANK_MODEL = 'cohere/rerank-4-fast';

function client(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');
  return new OpenAI({ apiKey, baseURL: BASE_URL, maxRetries: 2 });
}

/** Embed one or more texts (1536-dim, text-embedding-3-small). Order is preserved. */
export async function embed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const res = await client().embeddings.create({ model: EMBED_MODEL, input: texts });
  return res.data.map((d) => d.embedding as number[]);
}

export interface ChatUsage {
  prompt_tokens: number;
  completion_tokens: number;
  /** OpenRouter reports this in `usage.cost` (USD); null when the provider doesn't. */
  cost_usd: number | null;
}

export interface ChatResult {
  /** Raw model output — the caller keeps this for `raw_output` on a Zod failure (spec §7.3). */
  text: string;
  model: string;
  usage: ChatUsage;
}

/**
 * One structured-output completion. `jsonSchema` is content-schema.ts's `contentJsonSchema`.
 * Returns the raw text; the caller does `JSON.parse` + `contentSchema.safeParse`.
 */
export async function chatJSON(
  system: string,
  user: string,
  jsonSchema: Record<string, unknown>,
  schemaName = 'milestone_content',
): Promise<ChatResult> {
  const model = process.env.JOURNEY_GEN_MODEL;
  if (!model) throw new Error('JOURNEY_GEN_MODEL is not set');
  const res = await client().chat.completions.create({
    model,
    // The content object is ~500 tokens; 2000 is headroom. Also stops verbose free models
    // rambling and avoids the "can't afford the token reservation" 402 that low/zero-credit
    // OpenRouter accounts hit when max_tokens defaults to the model's full context.
    max_tokens: 2000,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    response_format: {
      type: 'json_schema',
      // ponytail: contentJsonSchema is sent as-is. If a provider rejects the maxLength /
      // maxItems keywords, strip them here — the Zod check downstream stays the real gate.
      json_schema: { name: schemaName, schema: jsonSchema, strict: true },
    },
  });
  const u = res.usage as
    | { prompt_tokens?: number; completion_tokens?: number; cost?: number }
    | undefined;
  return {
    text: res.choices[0]?.message?.content ?? '',
    model: res.model ?? model,
    usage: {
      prompt_tokens: u?.prompt_tokens ?? 0,
      completion_tokens: u?.completion_tokens ?? 0,
      cost_usd: typeof u?.cost === 'number' ? u.cost : null,
    },
  };
}

export interface RerankHit {
  /** Position in the `documents` array that was passed in. */
  index: number;
  /** relevance_score, ~0–1 — a calibrated relevance signal, unlike RRF (spec §3.5). */
  score: number;
}

/** Rerank `documents` against `query`; returns the top `topN`, best first. */
export async function rerank(
  query: string,
  documents: string[],
  topN = 5,
): Promise<RerankHit[]> {
  if (documents.length === 0) return [];
  const model = process.env.JOURNEY_RERANK_MODEL || DEFAULT_RERANK_MODEL;
  const res = await client().post<{ results: { index: number; relevance_score: number }[] }>(
    '/rerank',
    { body: { model, query, documents, top_n: Math.min(topN, documents.length) } },
  );
  return res.results.map((r) => ({ index: r.index, score: r.relevance_score }));
}
