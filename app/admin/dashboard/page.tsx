import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';
import { SKELETON } from '@/lib/journey/skeleton';
import { corpusSignature } from '@/lib/projection';
import Scatter, { type ScatterPoint, type ScatterLink } from './scatter';
import MilestoneReviewPanel, {
  type ReviewItem,
  type MilestoneContentRow,
} from './milestone-review';

export const dynamic = 'force-dynamic';

type Method = 'umap' | 'tsne';

interface ProjRow {
  kind: 'chunk' | 'query';
  ref_id: string;
  label: string;
  source_id: string | null;
  method: Method;
  x: number;
  y: number;
  corpus_sha: string;
}

interface ChunkRow {
  id: string;
  chunk_index: number;
  source_id: string;
  text: string;
  metadata: Record<string, unknown> | null;
}

const MILESTONES = SKELETON.MBBS.flatMap((p) => p.milestones);
const MILESTONE = new Map(MILESTONES.map((m) => [m.id, m]));

/** Distinct hue per source, stable in title order. */
function sourceColor(index: number, total: number): string {
  return `hsl(${Math.round((index * 360) / Math.max(total, 1))} 70% 60%)`;
}

export default async function DashboardPage() {
  await requireAdmin();
  const db = supabaseAdmin();

  const [proj, chunks, sources, runs, content] = await Promise.all([
    db.from('rag_chunk_projection').select('kind, ref_id, label, source_id, method, x, y, corpus_sha'),
    db.from('rag_chunks').select('id, chunk_index, source_id, text, metadata'),
    db.from('rag_sources').select('id, title'),
    db.from('rag_runs').select('*').order('run_at', { ascending: false }),
    db.from('milestone_content').select('*').eq('course', 'MBBS'),
  ]);
  for (const r of [proj, chunks, sources, runs, content]) {
    if (r.error) throw new Error(r.error.message);
  }

  const projRows = (proj.data ?? []) as ProjRow[];
  const chunkRows = (chunks.data ?? []) as ChunkRow[];
  const sourceRows = (sources.data ?? []) as { id: string; title: string }[];
  const runRows = (runs.data ?? []) as Record<string, unknown>[];
  const contentRows = (content.data ?? []) as (MilestoneContentRow & { milestone_id: string })[];

  // --- staleness: does the stored projection match the corpus on disk? ---
  const currentSig = corpusSignature(chunkRows);
  const storedSig = projRows[0]?.corpus_sha ?? null;
  const stale = storedSig !== null && storedSig !== currentSig;
  const noProjection = projRows.length === 0;

  // --- source colours (title order) ---
  const sortedSources = [...sourceRows].sort((a, b) => a.title.localeCompare(b.title));
  const colorBySource = new Map(sortedSources.map((s, i) => [s.id, sourceColor(i, sortedSources.length)]));
  const legend = sortedSources.map((s) => ({ id: s.id, title: s.title, color: colorBySource.get(s.id)! }));
  const sourceTitle = new Map(sourceRows.map((s) => [s.id, s.title]));

  // --- chunk lookups: sliced for scatter hover, full for the review panel ---
  const chunkHover = new Map(chunkRows.map((c) => [c.id, c.text.slice(0, 240)]));
  const chunkById = new Map(chunkRows.map((c) => [c.id, c]));

  // --- latest run per milestone (MBBS) ---
  const latestRun = new Map<string, Record<string, unknown>>();
  for (const r of runRows) {
    if (r.course !== 'MBBS') continue;
    const mid = r.milestone_id as string;
    if (!latestRun.has(mid)) latestRun.set(mid, r);
  }

  const links: ScatterLink[] = [];
  for (const [mid, run] of latestRun) {
    for (const cid of (run.chunk_ids as string[] | null) ?? []) {
      links.push({ fromRef: mid, toRef: cid });
    }
  }

  // --- review panel data (skeleton order) ---
  const contentByMilestone = new Map(contentRows.map((r) => [r.milestone_id, r]));
  const reviewData: ReviewItem[] = SKELETON.MBBS.flatMap((phase) =>
    phase.milestones.map((m) => {
      const run = latestRun.get(m.id);
      const chunkIds = (run?.chunk_ids as string[] | null) ?? [];
      return {
        milestoneId: m.id,
        name: m.name,
        phaseId: phase.id,
        phaseName: phase.name,
        course: 'MBBS',
        row: contentByMilestone.get(m.id) ?? null,
        chunks: chunkIds.map((cid, i) => {
          const c = chunkById.get(cid);
          return {
            rank: i + 1,
            sourceTitle: c ? (sourceTitle.get(c.source_id) ?? '(unknown source)') : '(unknown)',
            section:
              (c?.metadata?.section_title as string | undefined) ??
              (c?.metadata?.section as string | undefined) ??
              null,
            text: c?.text ?? null,
          };
        }),
      };
    }),
  );

  // --- per-method point sets ---
  const pointsFor = (method: Method): ScatterPoint[] =>
    projRows
      .filter((p) => p.method === method)
      .map((p) => ({
        kind: p.kind,
        ref: p.ref_id,
        label: p.label,
        color: p.kind === 'chunk' ? (colorBySource.get(p.source_id ?? '') ?? '#888') : '#ffffff',
        x: p.x,
        y: p.y,
        hover:
          p.kind === 'chunk'
            ? (chunkHover.get(p.ref_id) ?? '')
            : (MILESTONE.get(p.ref_id)?.retrieval_query ?? ''),
      }));

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-syne text-2xl font-bold">RAG evaluation dashboard</h1>
        <p className="mt-1 text-sm text-[var(--white-dim)]">
          {chunkRows.length} chunks · {MILESTONES.length} milestone queries · {runRows.length} runs
        </p>
      </div>

      {noProjection ? (
        <p className="rounded-lg border border-[var(--ember)] bg-[var(--ember-glow)] px-4 py-3 text-sm">
          No projection data. Run <code className="text-[var(--ember)]">npm run journey:project</code>.
        </p>
      ) : stale ? (
        <p className="rounded-lg border border-[var(--ember)] bg-[var(--ember-glow)] px-4 py-3 text-sm">
          Projection is stale — the corpus changed since it was computed. Re-run{' '}
          <code className="text-[var(--ember)]">npm run journey:project</code>.
        </p>
      ) : null}

      {!noProjection && (
        <div className="flex flex-col gap-10">
          <Scatter
            title="UMAP — chunk & query embedding space"
            subtitle="Keeps more global structure. Lines join each milestone query to the chunks its latest run retrieved."
            points={pointsFor('umap')}
            links={links}
            legend={legend}
          />
          <Scatter
            title="t-SNE — chunk & query embedding space"
            subtitle="Sharpens local clusters; distances between clusters mean less than within."
            points={pointsFor('tsne')}
            links={links}
            legend={legend}
          />
        </div>
      )}

      <MilestoneReviewPanel milestones={reviewData} />
    </div>
  );
}
