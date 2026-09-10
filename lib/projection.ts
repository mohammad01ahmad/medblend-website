// Dimensionality reduction for the /admin embedding-space scatter plots.
//
// The 1536-dim chunk + query embeddings are projected to 2D with BOTH UMAP and
// t-SNE (two views — UMAP keeps more global structure, t-SNE sharpens local
// clusters). Chunks and query points are always fitted together in one call so
// "is this query near the chunks it retrieved?" is a real question on the plot.
//
// Runs offline in scripts/journey-project.ts (both methods on ~150 points take a
// few seconds), never per request. Pure module: no React, no Supabase.
//
// Self-check: `npx tsx lib/projection.ts`

import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import * as druid from '@saehrimnir/druidjs';
import { SKELETON_VERSION } from '@/lib/journey/skeleton';

export type Point2D = [number, number];

const SEED = 42;

/**
 * Stable fingerprint of the corpus a projection was fitted on. Changes whenever
 * chunks are added/removed/re-chunked or the skeleton (query set) is revised, so
 * the dashboard can flag "projection stale — re-run npm run journey:project".
 */
export function corpusSignature(chunks: { id: string; chunk_index: number }[]): string {
  const body = chunks
    .map((c) => `${c.id}:${c.chunk_index}`)
    .sort()
    .join('|');
  return createHash('sha256').update(`${body}|v${SKELETON_VERSION}`).digest('hex').slice(0, 16);
}

/** UMAP → 2D. `vectors` is the combined [chunks..., queries...] matrix. */
export function runUmap(vectors: number[][]): Point2D[] {
  if (vectors.length < 3) throw new Error('runUmap needs at least 3 rows');
  const n_neighbors = Math.max(2, Math.min(15, vectors.length - 1));
  const umap = new druid.UMAP(vectors, { n_neighbors, min_dist: 0.1, d: 2, seed: SEED });
  return umap.transform(500) as Point2D[];
}

/** t-SNE → 2D. Same combined matrix as runUmap. */
export function runTsne(vectors: number[][]): Point2D[] {
  if (vectors.length < 3) throw new Error('runTsne needs at least 3 rows');
  // perplexity must be well below the row count; 30 is the usual default, clamp for small sets.
  const perplexity = Math.max(2, Math.min(30, Math.floor((vectors.length - 1) / 3)));
  const tsne = new druid.TSNE(vectors, { perplexity, epsilon: 10, d: 2, seed: SEED });
  return tsne.transform(600) as Point2D[];
}

// ---------------------------------------------------------------------------

function selfCheck() {
  const rng = (s: number) => () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  const r = rng(7);
  const X = Array.from({ length: 30 }, () => Array.from({ length: 24 }, () => r()));

  for (const [name, fn] of [
    ['umap', runUmap],
    ['tsne', runTsne],
  ] as const) {
    const y = fn(X);
    if (y.length !== X.length) throw new Error(`${name}: expected ${X.length} points, got ${y.length}`);
    if (!y.every((p) => p.length === 2 && p.every(Number.isFinite)))
      throw new Error(`${name}: non-2D or non-finite output`);
    if (JSON.stringify(fn(X)) !== JSON.stringify(y))
      throw new Error(`${name}: not deterministic for a fixed seed`);
    console.log(`  ${name}: ${y.length} points, finite, deterministic  ✓`);
  }

  const sig = corpusSignature([
    { id: 'b', chunk_index: 1 },
    { id: 'a', chunk_index: 0 },
  ]);
  if (
    sig !==
    corpusSignature([
      { id: 'a', chunk_index: 0 },
      { id: 'b', chunk_index: 1 },
    ])
  )
    throw new Error('corpusSignature: not order-independent');
  console.log(`  corpusSignature: order-independent, ${sig}  ✓`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('projection.ts self-check');
  selfCheck();
  console.log('all checks passed');
}
