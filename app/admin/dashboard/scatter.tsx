'use client';

import { useMemo, useState } from 'react';

export interface ScatterPoint {
  kind: 'chunk' | 'query';
  ref: string;
  label: string;
  color: string;
  x: number;
  y: number;
  hover: string;
}

export interface ScatterLink {
  fromRef: string; // query (milestone id)
  toRef: string; // chunk id
}

interface LegendItem {
  id: string;
  title: string;
  color: string;
}

const W = 800;
const H = 560;
const PAD = 44;

export default function Scatter({
  title,
  subtitle,
  points,
  links,
  legend,
}: {
  title: string;
  subtitle: string;
  points: ScatterPoint[];
  links: ScatterLink[];
  legend: LegendItem[];
}) {
  const [hover, setHover] = useState<ScatterPoint | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const { place, posByRef } = useMemo(() => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const xmin = Math.min(...xs);
    const xmax = Math.max(...xs);
    const ymin = Math.min(...ys);
    const ymax = Math.max(...ys);
    const sx = (x: number) => PAD + ((x - xmin) / (xmax - xmin || 1)) * (W - 2 * PAD);
    const sy = (y: number) => H - PAD - ((y - ymin) / (ymax - ymin || 1)) * (H - 2 * PAD);
    const place = (p: ScatterPoint) => ({ cx: sx(p.x), cy: sy(p.y) });
    const posByRef = new Map(points.map((p) => [p.ref, { cx: sx(p.x), cy: sy(p.y) }]));
    return { place, posByRef };
  }, [points]);

  const chunks = points.filter((p) => p.kind === 'chunk');
  const queries = points.filter((p) => p.kind === 'query');

  return (
    <section>
      <h2 className="font-syne text-lg font-bold">{title}</h2>
      <p className="mt-0.5 mb-3 text-xs text-[var(--white-dim)]">{subtitle}</p>

      <div
        className="relative w-full overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--ink)]"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        }}
        onMouseLeave={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
          {/* query → retrieved-chunk links */}
          <g stroke="#ffffff" strokeOpacity={0.1}>
            {links.map((l, i) => {
              const a = posByRef.get(l.fromRef);
              const b = posByRef.get(l.toRef);
              if (!a || !b) return null;
              return <line key={i} x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} />;
            })}
          </g>

          {/* chunks */}
          {chunks.map((p) => {
            const { cx, cy } = place(p);
            return (
              <circle
                key={p.ref}
                cx={cx}
                cy={cy}
                r={hover?.ref === p.ref ? 6 : 3.5}
                fill={p.color}
                fillOpacity={0.85}
                onMouseEnter={() => setHover(p)}
              />
            );
          })}

          {/* queries */}
          {queries.map((p) => {
            const { cx, cy } = place(p);
            return (
              <g key={p.ref} onMouseEnter={() => setHover(p)}>
                <path
                  d={`M ${cx} ${cy - 7} L ${cx + 7} ${cy} L ${cx} ${cy + 7} L ${cx - 7} ${cy} Z`}
                  fill="#ffffff"
                  stroke="#0a0a0a"
                  strokeWidth={1}
                />
                <text
                  x={cx + 9}
                  y={cy + 3}
                  fill="#ffffff"
                  fillOpacity={0.7}
                  fontSize={9}
                  fontFamily="monospace"
                >
                  {p.ref}
                </text>
              </g>
            );
          })}
        </svg>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 max-w-xs rounded-md border border-[var(--border-subtle)] bg-black/90 p-2 text-xs text-white shadow-lg"
            style={{
              left: Math.min(pos.x + 12, W - 40),
              top: pos.y + 12,
            }}
          >
            <div className="font-semibold">
              {hover.kind === 'query' ? `query · ${hover.ref}` : 'chunk'} — {hover.label}
            </div>
            <div className="mt-1 text-[var(--white-dim)]">{hover.hover}</div>
          </div>
        )}
      </div>

      {/* source legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-xs text-[var(--white-dim)]">
          <span className="inline-block h-2.5 w-2.5 rotate-45 bg-white" /> milestone query
        </span>
        {legend.map((s) => (
          <span key={s.id} className="flex items-center gap-1.5 text-xs text-[var(--white-dim)]">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.title}
          </span>
        ))}
      </div>
    </section>
  );
}
