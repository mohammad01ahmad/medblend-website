// Fetch each corpus/sources.json entry's `url`, extract faithful markdown
// (lib/journey/html-to-markdown), and write corpus/<path> + corpus/.raw/<path>.html.
// Local only — no DB, no ingest. spec §7.1 (medblendapp/docs/MEDICAL_JOURNEY.md).
//
//   npm run fetch-sources                  fetch entries whose target .md is missing
//   npm run fetch-sources -- --refetch      re-download everything
//   npm run fetch-sources -- --only <stem>  one entry (by filename stem or title)
//   npm run fetch-sources -- --from-raw     re-convert from corpus/.raw/*.html, no network
//
// Then review each .md against the §7.1 checklist and run `npm run ingest`.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, parse as parsePath } from 'node:path';
import { z } from 'zod';
import { htmlToMarkdown } from '@/lib/journey/html-to-markdown';

const CORPUS = join(process.cwd(), 'corpus');
const RAW = join(CORPUS, '.raw');
const TIMEOUT_MS = 30_000;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// Loose — ingest.ts owns strict validation. Here we only need title / path / url.
const sourceSchema = z
  .object({ title: z.string(), path: z.string(), url: z.string().url().optional() })
  .passthrough();
const manifestSchema = z.object({ sources: z.array(sourceSchema).min(1) });

async function fetchHtml(url: string): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const ct = res.headers.get('content-type') ?? '';
      if (ct && !ct.includes('html')) throw new Error(`not HTML (content-type: ${ct})`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function main() {
  const args = process.argv.slice(2);
  const refetch = args.includes('--refetch');
  const fromRaw = args.includes('--from-raw');
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

  const manifestPath = join(CORPUS, 'sources.json');
  if (!existsSync(manifestPath)) {
    console.error(`corpus/sources.json not found (looked in ${CORPUS})`);
    process.exit(1);
  }
  const { sources } = manifestSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf8')));
  mkdirSync(RAW, { recursive: true });

  let written = 0;
  let thin = 0;
  const skipped: string[] = [];

  for (const src of sources) {
    const stem = parsePath(src.path).name;
    if (only && stem !== only && src.title !== only) continue;
    if (!src.url) {
      skipped.push(`${stem} (no url — hand-authored)`);
      continue;
    }

    const mdPath = join(CORPUS, src.path);
    const rawPath = join(RAW, `${stem}.html`);

    if (!fromRaw && !refetch && existsSync(mdPath)) {
      skipped.push(`${stem} (exists — use --refetch)`);
      continue;
    }

    let html: string;
    try {
      if (fromRaw) {
        if (!existsSync(rawPath)) {
          console.warn(`⚠ ${stem}: --from-raw but ${rawPath} is missing — save the page first`);
          continue;
        }
        html = readFileSync(rawPath, 'utf8');
      } else {
        html = await fetchHtml(src.url);
        writeFileSync(rawPath, html);
      }
    } catch (e) {
      console.error(`✖ ${stem}: ${e instanceof Error ? e.message : e}`);
      continue;
    }

    const { markdown, stats } = htmlToMarkdown(html, src.title);
    writeFileSync(mdPath, markdown);
    written++;

    const notes = [
      `${stats.markdownChars} chars`,
      `${stats.headings} headings`,
      `${stats.tables} tables`,
      stats.usedFallback ? 'readability-fallback' : null,
    ]
      .filter(Boolean)
      .join(', ');
    if (stats.thin) {
      thin++;
      console.warn(`⚠ ${stem}: ${notes} — likely JS-rendered. Save it from a browser to`);
      console.warn(`   ${rawPath}  then re-run with --from-raw`);
    } else {
      console.log(`✓ ${stem}: ${notes}`);
    }
  }

  if (skipped.length) console.log(`\nskipped: ${skipped.join(', ')}`);
  console.log(
    `\n${written} written${thin ? `, ${thin} thin (need a manual save)` : ''}. ` +
      `Review the .md files (spec §7.1), then: npm run ingest`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
