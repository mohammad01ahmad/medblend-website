// Batch generation for one course — the target-set selection + concurrency pool shared by
// the POST /api/journey/generate route and scripts/journey-generate.ts. Both call the same
// generateMilestoneContent (lib/journey/generate.ts); this only decides *which* milestones
// to run and how many at once. spec §9.2, plan step 6.

import { supabaseAdmin } from '@/lib/supabase';
import { SKELETON, type Course, type Milestone } from '@/lib/journey/skeleton';
import { generateMilestoneContent, type GenSummary } from '@/lib/journey/generate';

export interface FillOptions {
  /** Just this milestone (must be in the course's skeleton). */
  milestoneId?: string;
  /** Re-run milestones that already have a row (driver = 'refresh'). */
  refresh?: boolean;
  concurrency?: number;
  /** Max milestones this call generates (the route caps at 8; the CLI passes a large value). */
  cap?: number;
}

export interface FillResult {
  milestones: GenSummary[];
  /** Skeleton milestone ids that still have no milestone_content row after this call. */
  pending: string[];
}

function allMilestones(course: Course): Milestone[] {
  return SKELETON[course].flatMap((p) => p.milestones);
}

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return out;
}

export async function fillCourse(course: Course, opts: FillOptions = {}): Promise<FillResult> {
  const { milestoneId, refresh = false, concurrency = 4, cap = 8 } = opts;
  const skeleton = allMilestones(course);

  const { data: rows, error } = await supabaseAdmin()
    .from('milestone_content')
    .select('milestone_id')
    .eq('course', course);
  if (error) throw new Error(`milestone_content read failed: ${error.message}`);
  const haveRow = new Set((rows ?? []).map((r) => r.milestone_id as string));

  let targets: Milestone[];
  if (milestoneId) {
    const m = skeleton.find((x) => x.id === milestoneId);
    if (!m) throw new Error(`unknown milestone "${milestoneId}" for ${course}`);
    targets = [m];
  } else if (refresh) {
    targets = skeleton;
  } else {
    targets = skeleton.filter((m) => !haveRow.has(m.id));
  }
  targets = targets.slice(0, Math.max(0, cap));

  const milestones = await pool(targets, concurrency, (m) =>
    generateMilestoneContent(m, course, refresh ? 'refresh' : 'generate'),
  );

  const done = new Set([...haveRow, ...milestones.map((s) => s.milestone_id)]);
  const pending = skeleton.filter((m) => !done.has(m.id)).map((m) => m.id);
  return { milestones, pending };
}
