// Fill (or re-fill) milestone_content for a course by running the RAG pipeline over every
// skeleton milestone. Local dev / re-run-after-corpus-change tool — same code path as the
// POST /api/journey/generate route (both call lib/journey/run.ts → generateMilestoneContent).
//
//   npm run journey:generate -- --course MBBS
//   npm run journey:generate -- --course MBBS --milestone m3_2
//   npm run journey:generate -- --course MBBS --refresh        (re-run milestones that have a row)

import { SKELETON, type Course } from '@/lib/journey/skeleton';
import { fillCourse } from '@/lib/journey/run';

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

function pad(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : s + ' '.repeat(n - s.length);
}

async function main() {
  const args = process.argv.slice(2);
  const course = (flag(args, '--course') ?? 'MBBS') as Course;
  if (!SKELETON[course]) {
    console.error(`--course must be one of: ${Object.keys(SKELETON).join(', ')}`);
    process.exit(1);
  }
  const milestoneId = flag(args, '--milestone');
  const refresh = args.includes('--refresh');

  console.log(`generating ${course}${milestoneId ? ` / ${milestoneId}` : ''}${refresh ? ' (refresh)' : ''} …`);
  const t0 = Date.now();
  const { milestones, pending } = await fillCourse(course, {
    milestoneId,
    refresh,
    concurrency: 4,
    cap: 9999,
  });

  const rows = [...milestones].sort((a, b) => a.milestone_id.localeCompare(b.milestone_id));
  console.log(
    '\n' +
      pad('milestone', 10) +
      pad('schema', 8) +
      pad('suff_ctx', 10) +
      pad('top', 8) +
      pad('chunks', 8) +
      'servable',
  );
  for (const s of rows) {
    console.log(
      pad(s.milestone_id, 10) +
        pad(String(s.schema_valid), 8) +
        pad(String(s.sufficient_context), 10) +
        pad(s.top_score.toFixed(3), 8) +
        pad(String(s.n_chunks), 8) +
        (s.servable ? '✓' : ''),
    );
  }

  const servable = rows.filter((s) => s.servable).length;
  console.log(`\n${servable}/${rows.length} servable · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  if (pending.length) console.warn(`still pending (no row): ${pending.join(', ')}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
