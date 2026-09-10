import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';
import { SKELETON } from '@/lib/journey/skeleton';
import { corpusSignature } from '@/lib/projection';
import Scatter, { type ScatterPoint, type ScatterLink } from './scatter';
import RunsTable, { type RunRow } from './runs-table';

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

const MILESTONES = SKELETON.MBBS.flatMap((p) => p.milestones);
const PHASE_NAME = new Map(SKELETON.MBBS.map((p) => [p.id, p.name]));
const MILESTONE = new Map(MILESTONES.map((m) => [m.id, m]));

/** Distinct hue per source, stable in title order. */
function sourceColor(index: number, total: number): string {
  return `hsl(${Math.round((index * 360) / Math.max(total, 1))} 70% 60%)`;
}

export default async function DashboardPage() {
  await requireAdmin();
  const db = supabaseAdmin();

  const [proj, chunks, sources, runs] = await Promise.all([
    db.from('rag_chunk_projection').select('kind, ref_id, label, source_id, method, x, y, corpus_sha'),
    db.from('rag_chunks').select('id, chunk_index, source_id, text'),
    db.from('rag_sources').select('id, title'),
    db.from('rag_runs').select('*').order('run_at', { ascending: false }),
  ]);
  for (const r of [proj, chunks, sources, runs]) {
    if (r.error) throw new Error(r.error.message);
  }

  const projRows = (proj.data ?? []) as ProjRow[];
  const chunkRows = (chunks.data ?? []) as { id: string; chunk_index: number; source_id: string; text: string }[];
  const sourceRows = (sources.data ?? []) as { id: string; title: string }[];
  const runRows = (runs.data ?? []) as Record<string, unknown>[];

  // --- staleness: does the stored projection match the corpus on disk? ---
  const currentSig = corpusSignature(chunkRows);
  const storedSig = projRows[0]?.corpus_sha ?? null;
  const stale = storedSig !== null && storedSig !== currentSig;
  const noProjection = projRows.length === 0;

  // --- source colours (title order) ---
  const sortedSources = [...sourceRows].sort((a, b) => a.title.localeCompare(b.title));
  const colorBySource = new Map(sortedSources.map((s, i) => [s.id, sourceColor(i, sortedSources.length)]));
  const legend = sortedSources.map((s) => ({ id: s.id, title: s.title, color: colorBySource.get(s.id)! }));

  // --- hover text ---
  const chunkText = new Map(chunkRows.map((c) => [c.id, c.text.slice(0, 240)]));

  // --- latest run per milestone → query↔chunk links + the runs table ---
  const latestByMilestone = new Map<string, Record<string, unknown>>();
  const tableRows: RunRow[] = [];
  for (const r of runRows) {
    const mid = r.milestone_id as string;
    const course = r.course as string;
    if (!latestByMilestone.has(mid)) latestByMilestone.set(mid, r);
    const m = MILESTONE.get(mid);
    tableRows.push({
      milestone_id: mid,
      name: m?.name ?? '—',
      phase: m ? (PHASE_NAME.get(m.phase_id) ?? m.phase_id) : '—',
      course,
      run_at: r.run_at as string,
      driver: r.driver as string,
      top_score: r.top_score as number | null,
      n_chunks: r.n_chunks as number | null,
      sufficient_context: r.sufficient_context as boolean | null,
      schema_valid: r.schema_valid as boolean | null,
      model: (r.model as string | null) ?? '—',
      cost_usd: r.cost_usd as number | null,
    });
  }

  const links: ScatterLink[] = [];
  for (const [mid, run] of latestByMilestone) {
    for (const cid of (run.chunk_ids as string[] | null) ?? []) {
      links.push({ fromRef: mid, toRef: cid });
    }
  }

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
            ? (chunkText.get(p.ref_id) ?? '')
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

      <RunsTable rows={tableRows} />
    </div>
  );
}
