// PDF → markdown for the RAG corpus, via Gemini's native PDF vision (portable version of
// RAGFlow's deepdoc/parser/pdf_parser.py VisionParser). Local only — no DB, no ingest.
// spec §7.1 (medblendapp/docs/MEDICAL_JOURNEY.md).
//
//   npm run transcribe-pdf                       every .pdf source without a target .md
//   npm run transcribe-pdf -- --only <stem>       one source (filename stem or title)
//   npm run transcribe-pdf -- --pages 3-40        transcribe only this page range
//   npm run transcribe-pdf -- --batch 6           pages per Gemini call (default 10)
//   npm run transcribe-pdf -- --refetch           re-download the PDF
//
// Writes corpus/<path>.md + keeps corpus/.raw/<stem>.pdf. Then check the .md against the
// PDF (tables especially), fix, and run `npm run ingest`.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, parse as parsePath } from 'node:path';
import { z } from 'zod';
import { PDFDocument } from 'pdf-lib';
import { transcribePdf } from '@/lib/journey/gemini';

const CORPUS = join(process.cwd(), 'corpus');
const RAW = join(CORPUS, '.raw');
const BATCH_PAUSE_MS = 4000; // free-tier RPM courtesy

const PROMPT = `Transcribe the content of these PDF pages to clean Markdown.
- Output ONLY the transcribed content — no preamble, no commentary, no \`\`\` fences.
- Transcribe the ENGLISH text word-for-word. Skip Arabic text entirely.
- Do NOT summarise, rephrase, or omit any English content.
- Numbered sections (e.g. 1.1, 4.1.9) become Markdown headings (##, ###) matching their depth.
- Every table becomes a real Markdown | table | — preserve every row and every cell. Do NOT
  invent a table where the layout is not actually tabular.
- Preserve reading order. For a multi-column page, read the whole left column top to bottom,
  then the next column.
- SKIP: the repeating document-control notice ("Electronic copy is controlled..."), the
  repeating footer/header line ("Code: DHA/... Issue ... Page N of ..."), bare page numbers,
  and any table of contents / list of contents (chapter-name + page-number lists).
- Never emit a run of more than three identical characters (no "......", no "-----"), and
  never repeat a line.
- If a page has no substantive content, emit nothing for it.`;

const sourceSchema = z
  .object({ title: z.string(), path: z.string(), url: z.string().url().optional() })
  .passthrough();
const manifestSchema = z.object({ sources: z.array(sourceSchema).min(1) });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

function parsePages(arg: string | undefined, total: number): [number, number] {
  if (!arg) return [1, total];
  const m = arg.match(/^(\d+)-(\d+)$/);
  if (!m) throw new Error(`--pages must be "A-B", got "${arg}"`);
  const a = Math.max(1, parseInt(m[1], 10));
  const b = Math.min(total, parseInt(m[2], 10));
  if (a > b) throw new Error(`--pages ${arg} selects no pages`);
  return [a, b];
}

async function fetchPdf(url: string): Promise<Uint8Array> {
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000), redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

async function slicePdf(src: PDFDocument, from: number, to: number): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i);
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

// Post-process a full transcription: collapse dot/dash leaders, and drop any line that
// repeats verbatim across the doc (page headers/footers/watermarks the model kept anyway).
function sanitize(md: string): string {
  const s = md.replace(/[ \t]*[.\-_·•]{4,}[ \t]*/g, ' ').replace(/[ \t]{2,}/g, ' ');
  const lines = s.split('\n');
  const freq = new Map<string, number>();
  for (const l of lines) {
    const t = l.trim();
    if (t.length >= 12 && !/^#{1,6}\s/.test(t) && !t.startsWith('|')) {
      freq.set(t, (freq.get(t) ?? 0) + 1);
    }
  }
  const boilerplate = new Set([...freq].filter(([, n]) => n >= 3).map(([t]) => t));
  return lines
    .filter((l) => !boilerplate.has(l.trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function withRetry<T>(fn: () => Promise<T>, tries = 5): Promise<T> {
  let last: unknown;
  for (let i = 1; i <= tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      const msg = e instanceof Error ? e.message : String(e);
      // Retry transient server load only. A quota 429 (RESOURCE_EXHAUSTED / *PerDay) is a
      // wall — no point burning backoff on it; the per-batch cache + a later re-run recover.
      const transient = /\b(50\d)\b|overloaded|unavailable|deadline|ECONNRESET|ETIMEDOUT/i.test(msg);
      if (i === tries || !transient) throw e;
      await sleep(i * 10000); // 10s, 20s, 30s, 40s
    }
  }
  throw last;
}

async function main() {
  const args = process.argv.slice(2);
  const only = flag(args, '--only') ?? null;
  const refetch = args.includes('--refetch');
  const pagesArg = flag(args, '--pages');
  const batch = Math.max(1, parseInt(flag(args, '--batch') ?? '10', 10));

  const manifestPath = join(CORPUS, 'sources.json');
  if (!existsSync(manifestPath)) {
    console.error(`corpus/sources.json not found (looked in ${CORPUS})`);
    process.exit(1);
  }
  const { sources } = manifestSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf8')));
  const targets = sources.filter((s) => s.url?.toLowerCase().endsWith('.pdf'));
  if (targets.length === 0) {
    console.log('no .pdf sources in corpus/sources.json');
    return;
  }
  mkdirSync(RAW, { recursive: true });

  for (const src of targets) {
    const stem = parsePath(src.path).name;
    if (only && stem !== only && src.title !== only) continue;

    const outPath = join(CORPUS, src.path);
    if (!only && !refetch && existsSync(outPath)) {
      console.log(`· ${stem}: ${src.path} exists, skipped (use --only or --refetch)`);
      continue;
    }

    const pdfPath = join(RAW, `${stem}.pdf`);
    let bytes: Uint8Array;
    if (existsSync(pdfPath) && !refetch) {
      bytes = new Uint8Array(readFileSync(pdfPath));
      console.log(`· ${stem}: using cached ${pdfPath}`);
    } else {
      if (!src.url) {
        console.error(`✖ ${stem}: no url`);
        continue;
      }
      console.log(`↓ ${stem}: ${src.url}`);
      try {
        bytes = await fetchPdf(src.url);
      } catch (e) {
        console.error(`✖ ${stem}: fetch failed — ${e instanceof Error ? e.message : e}`);
        continue;
      }
      writeFileSync(pdfPath, bytes);
    }

    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const total = doc.getPageCount();
    const [from, to] = parsePages(pagesArg, total);

    // Per-batch cache — a batch that succeeded once is never re-charged; a re-run only
    // retries the ranges that failed (Gemini 503s) or aren't done yet.
    const partsDir = join(RAW, `${stem}.parts`);
    if (refetch) rmSync(partsDir, { recursive: true, force: true });
    mkdirSync(partsDir, { recursive: true });
    const partName = (a: number, b: number) => `${String(a).padStart(4, '0')}-${String(b).padStart(4, '0')}.md`;

    console.log(`  ${total} pages; transcribing ${from}–${to}, ${batch}/call`);

    let promptTok = 0;
    let outTok = 0;
    let failed = 0;
    let truncated = 0;

    for (let p = from; p <= to; p += batch) {
      const end = Math.min(p + batch - 1, to);
      const partPath = join(partsDir, partName(p, end));
      if (existsSync(partPath) && !refetch) {
        console.log(`  · pages ${p}-${end}: cached`);
        continue;
      }
      const slice = await slicePdf(doc, p, end);
      try {
        const r = await withRetry(() => transcribePdf(slice, PROMPT));
        promptTok += r.usage.prompt_tokens;
        outTok += r.usage.completion_tokens;
        const md = r.text.trim();
        writeFileSync(partPath, md);
        const perPage = md.length / (end - p + 1);
        if (r.finishReason && r.finishReason !== 'STOP') {
          truncated++;
          console.warn(`  ⚠ pages ${p}-${end}: finishReason=${r.finishReason} — lower --batch and re-run`);
        } else if (perPage > 6000) {
          console.warn(`  ⚠ pages ${p}-${end}: ${md.length} chars for ${end - p + 1} pages — possible repetition loop, inspect`);
        } else {
          console.log(`  ✓ pages ${p}-${end}: ${md.length} chars`);
        }
      } catch (e) {
        failed++;
        console.error(`  ✖ pages ${p}-${end}: ${e instanceof Error ? e.message : e} (re-run to retry)`);
      }
      if (end < to) await sleep(BATCH_PAUSE_MS);
    }

    // Assemble from every cached part, in page order.
    const partFiles = readdirSync(partsDir)
      .filter((f) => /^\d{4}-\d{4}\.md$/.test(f))
      .sort();
    if (partFiles.length === 0) {
      console.error(`  ✖ ${stem}: no batches succeeded — not writing ${src.path}`);
      continue;
    }
    const body = sanitize(
      partFiles
        .map((f) => {
          const [a, b] = f.replace('.md', '').split('-').map((n) => parseInt(n, 10));
          return `<!-- pages ${a}-${b} -->\n\n${readFileSync(join(partsDir, f), 'utf8').trim()}`;
        })
        .join('\n\n'),
    );
    writeFileSync(outPath, `# ${src.title}\n\n${body}\n`);

    const tables = (body.match(/^\|[\s:|-]*-[\s:|-]*\|\s*$/gm) ?? []).length;
    // Rough console estimate only (~Flash rates: $0.30 / $2.50 per 1M in/out tokens).
    const cost = (promptTok / 1e6) * 0.3 + (outTok / 1e6) * 2.5;
    console.log(
      `\n${stem} → ${outPath}\n  ${body.length} chars, ${tables} tables, ` +
        `${promptTok}+${outTok} tok, ~$${cost.toFixed(3)}` +
        (failed ? `, ${failed} batch(es) FAILED` : '') +
        (truncated ? `, ${truncated} truncated` : ''),
    );
    console.log(`  Check it against ${pdfPath} (tables especially), then: npm run ingest\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
