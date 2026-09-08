// Hybrid retrieval over rag_chunks — the `hybrid_search` RPC (RRF of pgvector KNN +
// Postgres full-text search) shipped in medblendapp/supabase/migrations/*_journey_rag.sql.
// Returns candidates in RRF order; the reranker (rerank.ts) picks the final 5.

import { supabaseAdmin } from '@/lib/supabase';
import type { Course } from '@/lib/journey/skeleton';

/** Denormalised source fields the chunker stamps at ingest (spec §7.1). All optional — jsonb. */
export interface ChunkMetadata {
  source?: string; // the source document's human-readable title — surfaces as a milestone source
  chapter?: string;
  section?: string;
  section_title?: string;
  content_type?: string;
  emirate?: string;
  licensing_body?: string;
  profession_type?: string;
  course_applicability?: string[];
  document_date?: string; // ISO date
  [k: string]: unknown;
}

export interface Chunk {
  id: string;
  source_id: string;
  chunk_index: number;
  text: string;
  metadata: ChunkMetadata;
  /** RRF fusion score — a rank artifact (~0.02–0.04), not calibrated relevance (spec §3.5). */
  rrf_score: number;
}

interface HybridSearchRow {
  id: string;
  source_id: string;
  chunk_index: number;
  text: string;
  metadata: ChunkMetadata | null;
  score: number | string;
}

/**
 * Retrieve up to `matchCount` candidates for `queryText` / `queryEmbedding`, filtered to
 * `course`. `queryEmbedding` is JSON-stringified — pgvector's text input `'[…]'` is the
 * reliable path through PostgREST for a `vector` argument.
 */
export async function hybridSearch(
  queryText: string,
  queryEmbedding: number[],
  course: Course,
  matchCount = 20,
): Promise<Chunk[]> {
  const { data, error } = await supabaseAdmin().rpc('hybrid_search', {
    query_text: queryText,
    query_embedding: JSON.stringify(queryEmbedding),
    match_count: matchCount,
    filter_course: course,
  });
  if (error) throw new Error(`hybrid_search failed: ${error.message}`);

  return ((data ?? []) as HybridSearchRow[]).map((r) => ({
    id: r.id,
    source_id: r.source_id,
    chunk_index: r.chunk_index,
    text: r.text,
    metadata: r.metadata ?? {},
    rrf_score: typeof r.score === 'string' ? Number(r.score) : r.score,
  }));
}
