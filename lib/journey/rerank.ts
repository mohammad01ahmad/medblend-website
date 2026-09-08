// Precision filter over the RRF candidates: a cross-encoder scores each (query, chunk)
// pair jointly and returns the top N (spec §3.5). RRF is recall; this is precision.

import { rerank } from '@/lib/journey/openrouter';
import type { Chunk } from '@/lib/journey/retrieve';

export interface RankedChunk extends Chunk {
  /** relevance_score from the reranker, ~0–1 — a calibrated signal, unlike rrf_score. */
  rerank_score: number;
}

/**
 * Rerank `chunks` against `query`, best first, capped at `topN`.
 *
 * // ponytail: one OpenRouter /rerank call. Swap JOURNEY_RERANK_MODEL (cohere/rerank-v3.5 |
 * // rerank-4-fast | rerank-4-pro), or add Voyage, once the eval harness has a Recall@5 read.
 */
export async function rerankChunks(
  query: string,
  chunks: Chunk[],
  topN = 5,
): Promise<RankedChunk[]> {
  if (chunks.length === 0) return [];
  const hits = await rerank(
    query,
    chunks.map((c) => c.text),
    topN,
  );
  return hits.map((h) => ({ ...chunks[h.index], rerank_score: h.score }));
}
