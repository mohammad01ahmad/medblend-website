import { Badge } from '@/components/ui/badge';
import MilestoneActions from './milestone-actions';
import CommentBox from './comment-box';

export interface ReviewChunk {
  rank: number;
  sourceTitle: string;
  section: string | null;
  text: string | null; // null → chunk id no longer in the corpus
}

export interface MilestoneContentRow {
  status: 'unreviewed' | 'reviewed' | 'rejected';
  content: Record<string, unknown> | null;
  raw_output: string | null;
  sources: string[] | null;
  document_date: string | null;
  top_score: number | null;
  schema_valid: boolean | null;
  sufficient_context: boolean | null;
  gaps: string | null;
  model: string | null;
  generated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
}

export interface ReviewItem {
  milestoneId: string;
  name: string;
  phaseId: string;
  phaseName: string;
  course: string;
  row: MilestoneContentRow | null;
  chunks: ReviewChunk[];
}

const CONTENT_FIELDS: [key: string, label: string][] = [
  ['description', 'Description'],
  ['what_to_expect', 'What to expect'],
  ['common_mistakes', 'Common mistakes'],
  ['exam_name', 'Exam name'],
  ['minimum_score', 'Minimum score'],
  ['requirements', 'Requirements'],
  ['gaps', 'Gaps (model)'],
];

function ts(v: string): string {
  return new Date(v).toISOString().slice(0, 16).replace('T', ' ');
}

function Bool({ v, label }: { v: boolean | null; label: string }) {
  const color = v === null ? 'text-muted-foreground' : v ? 'text-emerald-500' : 'text-destructive';
  return (
    <span className={`text-xs ${color}`}>
      {label}: {v === null ? '—' : v ? 'yes' : 'no'}
    </span>
  );
}

function StatusBadge({ status }: { status: MilestoneContentRow['status'] | 'none' }) {
  if (status === 'reviewed')
    return (
      <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 uppercase tracking-wide">
        reviewed
      </Badge>
    );
  if (status === 'rejected')
    return (
      <Badge variant="destructive" className="uppercase tracking-wide">
        rejected
      </Badge>
    );
  return (
    <Badge variant="secondary" className="uppercase tracking-wide">
      {status === 'none' ? 'not generated' : status}
    </Badge>
  );
}

function ContentValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === '')
    return <span className="text-neutral-400">—</span>;
  if (Array.isArray(value))
    return (
      <ul className="list-disc pl-4">
        {value.map((v, i) => (
          <li key={i}>{String(v)}</li>
        ))}
      </ul>
    );
  return <span>{String(value)}</span>;
}

function Card({ item }: { item: ReviewItem }) {
  const { row } = item;
  const status = row?.status ?? 'none';

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-3">
        <span className="font-mono text-xs text-muted-foreground">{item.milestoneId}</span>
        <span className="text-sm font-semibold tracking-tight">{item.name}</span>
        <StatusBadge status={status} />
        {row && (
          <span className="text-xs text-muted-foreground">
            top {row.top_score?.toFixed(3) ?? '—'} · {row.model ?? '—'} · gen {ts(row.generated_at)}
          </span>
        )}
        {row && status !== 'unreviewed' && row.reviewed_by && (
          <span className="w-full text-xs text-muted-foreground">
            {status} by {row.reviewed_by}
            {row.reviewed_at ? ` · ${ts(row.reviewed_at)}` : ''}
          </span>
        )}
        {row && row.review_notes && (
          <span className="w-full text-xs text-muted-foreground">💬 {row.review_notes}</span>
        )}
      </div>

      {row ? (
        <details className="group">
          <summary className="cursor-pointer list-none px-4 py-2 text-xs text-foreground hover:underline">
            <span className="group-open:hidden">▸ show content &amp; source chunks</span>
            <span className="hidden group-open:inline">▾ hide</span>
          </summary>

          <div className="grid gap-4 px-4 pb-4 md:grid-cols-2">
            {/* content */}
            <div className="flex flex-col gap-3 text-sm">
              <div className="rounded-lg border border-neutral-200 bg-white p-4 text-neutral-900 shadow-sm">
                {row.content ? (
                  <div className="flex flex-col gap-3">
                    {CONTENT_FIELDS.map(([key, label]) => (
                      <div key={key}>
                        <div className="text-[11px] font-semibold tracking-wide text-neutral-500 uppercase">
                          {label}
                        </div>
                        <ContentValue value={(row.content as Record<string, unknown>)[key]} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="text-xs font-semibold text-destructive">
                      No valid content{row.raw_output ? ' — raw model output:' : ''}
                    </div>
                    {row.raw_output && (
                      <pre className="mt-1 overflow-x-auto rounded bg-neutral-100 p-2 text-xs whitespace-pre-wrap text-neutral-800">
                        {row.raw_output}
                      </pre>
                    )}
                    {row.gaps && <p className="mt-1 text-xs text-neutral-500">{row.gaps}</p>}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 border-t pt-2">
                <Bool v={row.schema_valid} label="schema valid" />
                <Bool v={row.sufficient_context} label="sufficient context" />
                <span className="text-xs text-muted-foreground">
                  sources: {row.sources?.length ? row.sources.join(', ') : '—'}
                </span>
                {row.document_date && (
                  <span className="text-xs text-muted-foreground">oldest doc: {row.document_date}</span>
                )}
              </div>
              <CommentBox milestoneId={item.milestoneId} course={item.course} initialNote={row.review_notes} />
            </div>

            {/* source chunks */}
            <div className="flex flex-col gap-3">
              <div className="text-xs font-semibold text-muted-foreground">
                Source chunks ({item.chunks.length}) — latest run, rank order
              </div>
              {item.chunks.length === 0 && (
                <p className="text-xs text-muted-foreground">No run recorded for this milestone.</p>
              )}
              {item.chunks.map((c) => (
                <div key={c.rank} className="rounded-md border bg-muted/40 p-2">
                  <div className="mb-1 text-xs text-muted-foreground">
                    #{c.rank} · {c.sourceTitle}
                    {c.section ? ` · ${c.section}` : ''}
                  </div>
                  <p className="max-h-56 overflow-y-auto text-xs whitespace-pre-wrap text-foreground/85">
                    {c.text ?? <span className="text-destructive">(chunk removed from corpus)</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t px-4 py-3">
            <MilestoneActions
              milestoneId={item.milestoneId}
              course={item.course}
              status={row.status}
              reviewNotes={row.review_notes}
            />
          </div>
        </details>
      ) : (
        <p className="px-4 py-3 text-xs text-muted-foreground">
          Not generated yet — run <code>npm run journey:generate -- --course {item.course} --milestone {item.milestoneId}</code>
        </p>
      )}
    </div>
  );
}

export default function MilestoneReviewPanel({ milestones }: { milestones: ReviewItem[] }) {
  const counts = milestones.reduce(
    (a, m) => {
      const s = m.row?.status ?? 'ungenerated';
      a[s] = (a[s] ?? 0) + 1;
      return a;
    },
    {} as Record<string, number>,
  );

  // group by phase, preserving incoming (skeleton) order
  const groups: { phaseName: string; items: ReviewItem[] }[] = [];
  for (const m of milestones) {
    const last = groups[groups.length - 1];
    if (last && last.phaseName === m.phaseName) last.items.push(m);
    else groups.push({ phaseName: m.phaseName, items: [m] });
  }

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Milestone review</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {counts.reviewed ?? 0} reviewed · {counts.rejected ?? 0} rejected ·{' '}
          {counts.unreviewed ?? 0} unreviewed
          {counts.ungenerated ? ` · ${counts.ungenerated} not generated` : ''}
        </p>
      </div>

      {groups.map((g) => (
        <div key={g.phaseName} className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            {g.phaseName}
          </h3>
          {g.items.map((item) => (
            <Card key={item.milestoneId} item={item} />
          ))}
        </div>
      ))}
    </section>
  );
}
