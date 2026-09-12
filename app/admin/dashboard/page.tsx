import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';
import { SKELETON } from '@/lib/journey/skeleton';
import { corpusSignature } from '@/lib/projection';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/dashboard/admin-sidebar';
import { SectionProvider } from '@/components/admin/dashboard/section-context';
import SectionPanel from '@/components/admin/dashboard/section-panel';
import Scatter, { type ScatterPoint, type ScatterLink } from '@/components/admin/dashboard/scatter';
import MilestoneReviewPanel, {
  type ReviewItem,
  type MilestoneContentRow,
} from '@/components/admin/dashboard/milestone-review';
import SourcesTable, { type SourceRow } from '@/components/admin/dashboard/sources-table';

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
  const { user } = await requireAdmin();
  const db = supabaseAdmin();

  const [proj, chunks, sources, runs, content] = await Promise.all([
    db.from('rag_chunk_projection').select('kind, ref_id, label, source_id, method, x, y, corpus_sha'),
    db.from('rag_chunks').select('id, chunk_index, source_id, text, metadata'),
    db.from('rag_sources').select('*').order('title'),
    db.from('rag_runs').select('*').order('run_at', { ascending: false }),
    db.from('milestone_content').select('*').eq('course', 'MBBS'),
  ]);
  for (const r of [proj, chunks, sources, runs, content]) {
    if (r.error) throw new Error(r.error.message);
  }

  const projRows = (proj.data ?? []) as ProjRow[];
  const chunkRows = (chunks.data ?? []) as ChunkRow[];
  const sourceRows = (sources.data ?? []) as SourceRow[];
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
    <SectionProvider>
      <SidebarProvider>
        <AdminSidebar email={user.email} />
        <SidebarInset className="min-w-0">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <span className="text-sm font-medium">RAG evaluation dashboard</span>
          </header>

          <div className="flex min-w-0 flex-col gap-10 p-6">
            <p className="text-sm text-muted-foreground">
              {chunkRows.length} chunks · {MILESTONES.length} milestone queries · {runRows.length} runs
            </p>

            {noProjection ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-500">
                No projection data. Run <code>npm run journey:project</code>.
              </p>
            ) : stale ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-500">
                Projection is stale — the corpus changed since it was computed. Re-run{' '}
                <code>npm run journey:project</code>.
              </p>
            ) : null}

            {!noProjection && (
              <>
                <SectionPanel id="umap">
                  <Scatter
                    title="UMAP — chunk & query embedding space"
                    subtitle="Keeps more global structure. Lines join each milestone query to the chunks its latest run retrieved."
                    points={pointsFor('umap')}
                    links={links}
                    legend={legend}
                  />
                </SectionPanel>
                <SectionPanel id="tsne">
                  <Scatter
                    title="t-SNE — chunk & query embedding space"
                    subtitle="Sharpens local clusters; distances between clusters mean less than within."
                    points={pointsFor('tsne')}
                    links={links}
                    legend={legend}
                  />
                </SectionPanel>
              </>
            )}

            <SectionPanel id="review">
              <MilestoneReviewPanel milestones={reviewData} />
            </SectionPanel>

            <SectionPanel id="sources">
              <SourcesTable sources={sortedSources} />
            </SectionPanel>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SectionProvider>
  );
}
