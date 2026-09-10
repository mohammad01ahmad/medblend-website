// Precompute the 2D embedding-space projections for /admin/dashboard.
//
// Fetches every rag_chunks.embedding + embeds the 20 authored retrieval_query
// strings, fits UMAP and t-SNE over the combined set, and replaces the contents
// of public.rag_chunk_projection. Re-run after each corpus change:
//
//   npm run ingest  →  npm run journey:generate  →  npm run journey:project
//
// t-SNE/UMAP on ~150 points take a few seconds — too slow for a page load, which
// is why this is a script and the dashboard just reads the table.

import { supabaseAdmin } from '@/lib/supabase';
import { embed } from '@/lib/journey/openrouter';
import { SKELETON } from '@/lib/journey/skeleton';
import { corpusSignature, runUmap, runTsne, type Point2D } from '@/lib/projection';

interface ChunkRow {
  id: string;
  chunk_index: number;
  source_id: string;
  embedding: string | number[] | null;
}

type Method = 'umap' | 'tsne';

interface ProjectionRow {
  kind: 'chunk' | 'query';
  ref_id: string;
  label: string;
  source_id: string | null;
  method: Method;
  x: number;
  y: number;
  corpus_sha: string;
}

function parseEmbedding(e: ChunkRow['embedding']): number[] {
  if (Array.isArray(e)) return e;
  if (typeof e === 'string') return JSON.parse(e) as number[];
  throw new Error('chunk has no embedding');
}

async function main() {
  const t0 = Date.now();
  const db = supabaseAdmin();

  // --- corpus ---
  const { data: chunkData, error: chunkErr } = await db
    .from('rag_chunks')
    .select('id, chunk_index, source_id, embedding')
    .not('embedding', 'is', null)
    .order('id');
  if (chunkErr) throw new Error(`rag_chunks read failed: ${chunkErr.message}`);
  const chunks = (chunkData ?? []) as ChunkRow[];
  if (chunks.length < 3) throw new Error(`only ${chunks.length} embedded chunks — nothing to project`);

  const { data: sourceData, error: sourceErr } = await db.from('rag_sources').select('id, title');
  if (sourceErr) throw new Error(`rag_sources read failed: ${sourceErr.message}`);
  const sourceTitle = new Map((sourceData ?? []).map((s) => [s.id as string, s.title as string]));

  // --- queries (course-agnostic; ids are identical across MBBS/MD) ---
  const milestones = SKELETON.MBBS.flatMap((p) => p.milestones);
  const queryVecs = await embed(milestones.map((m) => m.retrieval_query));

  // --- fit both methods over [chunks…, queries…] together ---
  const chunkVecs = chunks.map((c) => parseEmbedding(c.embedding));
  const vectors = [...chunkVecs, ...queryVecs];
  console.log(`fitting ${chunks.length} chunks + ${milestones.length} queries = ${vectors.length} points …`);

  const projections: Record<Method, Point2D[]> = {
    umap: runUmap(vectors),
    tsne: runTsne(vectors),
  };

  const corpus_sha = corpusSignature(chunks);
  const rows: ProjectionRow[] = [];
  for (const method of ['umap', 'tsne'] as Method[]) {
    const xy = projections[method];
    chunks.forEach((c, i) => {
      rows.push({
        kind: 'chunk',
        ref_id: c.id,
        label: sourceTitle.get(c.source_id) ?? '(unknown source)',
        source_id: c.source_id,
        method,
        x: xy[i][0],
        y: xy[i][1],
        corpus_sha,
      });
    });
    milestones.forEach((m, j) => {
      const [x, y] = xy[chunks.length + j];
      rows.push({
        kind: 'query',
        ref_id: m.id,
        label: m.name,
        source_id: null,
        method,
        x,
        y,
        corpus_sha,
      });
    });
  }

  // Projection is fully derived — wipe and rewrite rather than track history.
  const { error: delErr } = await db
    .from('rag_chunk_projection')
    .delete()
    .neq('ref_id', '__none__');
  if (delErr) throw new Error(`clear failed: ${delErr.message}`);

  const { error: insErr } = await db.from('rag_chunk_projection').insert(rows);
  if (insErr) throw new Error(`insert failed: ${insErr.message}`);

  console.log(
    `\nwrote ${rows.length} rows  (${chunks.length} chunk + ${milestones.length} query) × 2 methods` +
      `\ncorpus_sha ${corpus_sha} · ${((Date.now() - t0) / 1000).toFixed(0)}s`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
