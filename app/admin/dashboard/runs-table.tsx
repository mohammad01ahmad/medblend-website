export interface RunRow {
  milestone_id: string;
  name: string;
  phase: string;
  course: string;
  run_at: string;
  driver: string;
  top_score: number | null;
  n_chunks: number | null;
  sufficient_context: boolean | null;
  schema_valid: boolean | null;
  model: string;
  cost_usd: number | null;
}

function Bool({ v }: { v: boolean | null }) {
  if (v === null) return <span className="text-[var(--white-dim)]">—</span>;
  return <span className={v ? 'text-[var(--pulse)]' : 'text-[var(--ember)]'}>{v ? 'yes' : 'no'}</span>;
}

function num(v: number | null, digits: number): string {
  return v === null ? '—' : v.toFixed(digits);
}

// Explicit cell styling — overrides the global bare `td/th` rule in globals.css.
const cell = 'border border-[var(--border-subtle)] px-2 py-1.5 text-left align-top';

export default function RunsTable({ rows }: { rows: RunRow[] }) {
  return (
    <section>
      <h2 className="font-syne text-lg font-bold">rag_runs</h2>
      <p className="mt-0.5 mb-3 text-xs text-[var(--white-dim)]">
        Every generation attempt, newest first. {rows.length} rows.
      </p>

      <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
        <table className="w-full border-collapse text-xs text-white/90">
          <thead className="bg-white/5 text-[var(--white-dim)]">
            <tr>
              {['milestone', 'name', 'phase', 'course', 'run at', 'driver', 'top score', 'chunks', 'suff. ctx', 'schema', 'model', 'cost $'].map(
                (h) => (
                  <th key={h} className={`${cell} font-semibold whitespace-nowrap`}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-white/5">
                <td className={`${cell} font-mono whitespace-nowrap`}>{r.milestone_id}</td>
                <td className={cell}>{r.name}</td>
                <td className={`${cell} whitespace-nowrap`}>{r.phase}</td>
                <td className={cell}>{r.course}</td>
                <td className={`${cell} whitespace-nowrap`}>
                  {new Date(r.run_at).toISOString().slice(0, 16).replace('T', ' ')}
                </td>
                <td className={cell}>{r.driver}</td>
                <td className={`${cell} text-right`}>{num(r.top_score, 3)}</td>
                <td className={`${cell} text-right`}>{r.n_chunks ?? '—'}</td>
                <td className={cell}>
                  <Bool v={r.sufficient_context} />
                </td>
                <td className={cell}>
                  <Bool v={r.schema_valid} />
                </td>
                <td className={`${cell} whitespace-nowrap`}>{r.model}</td>
                <td className={`${cell} text-right`}>{num(r.cost_usd, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
