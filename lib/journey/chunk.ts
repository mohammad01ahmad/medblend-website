// The one structure-aware splitter (spec §7.1, medblendapp/docs/MEDICAL_JOURNEY.md).
// Input is hand-cleaned markdown per the per-docType cleaning checklist. Splits on document
// structure (headings, explicit <!-- chunk --> markers), never through a markdown table row,
// prepends a heading-path context line instead of character overlap, merges tiny fragments
// up, and WARNS on oversized chunks rather than force-splitting them.
//
// ponytail: char-count guard, not a tokenizer. §7.1's 512-tok / 15%-overlap target and the
// js-tiktoken exact-count band are future scope.

import type { ChunkMetadata } from '@/lib/journey/retrieve';

export type DocType =
  | 'regulatory_pdf'
  | 'regulatory_page'
  | 'university_program_page'
  | 'university_handbook';

interface DocTypeConfig {
  /** Split at any heading this level or shallower (## → level 2). */
  splitAtOrAbove: number;
  /** A section whose deepest heading matches one of these is never split, even if oversized. */
  atomicSection: RegExp[];
}

const DOC_TYPE_CONFIG: Record<DocType, DocTypeConfig> = {
  regulatory_pdf: {
    splitAtOrAbove: 3,
    atomicSection: [
      /gap of practice/i,
      /qualification.*experience|experience.*qualification/i,
      /tier\s*1.*tier\s*2/i,
      /recognized specialty|specialty certificate/i,
    ],
  },
  // Regulatory content served as a web page (DOH / MOHAP / EHS / DataFlow), not a PDF.
  regulatory_page: {
    splitAtOrAbove: 3,
    atomicSection: [
      /qualification.*experience|experience.*qualification/i,
      /eligibility/i,
      /required documents?/i,
    ],
  },
  university_program_page: {
    splitAtOrAbove: 3,
    atomicSection: [/admission/i],
  },
  university_handbook: {
    splitAtOrAbove: 2,
    atomicSection: [/study plan/i],
  },
};

const TARGET_CHARS = 2000; // ≈ 512 tokens
const MAX_CHARS = 3200; // ≈ 800 tokens — warn above this
const MIN_CHARS = 600; // ≈ 150 tokens — merge a fragment this small up

const HEADING = /^(#{1,6})\s+(.+?)\s*#*$/;
const CHUNK_MARKER = /^<!--\s*chunk\s*-->\s*$/i;
const TABLE_LINE = /^\s*\|/;

export interface SourceMeta {
  source: string;
  url?: string;
  emirate?: string;
  licensing_body?: string;
  profession_type?: string;
  course_applicability: string[];
  document_date?: string;
}

export interface IngestChunk {
  chunk_index: number;
  text: string;
  metadata: ChunkMetadata;
}

export interface ChunkResult {
  chunks: IngestChunk[];
  warnings: string[];
}

interface Segment {
  headingPath: string[];
  chapter?: string; // the level-1 heading in scope, if any
  atomic: boolean;
  body: string; // raw lines, marker removed
}

/** Split the doc into segments at boundary headings and <!-- chunk --> markers. */
function splitSegments(text: string, cfg: DocTypeConfig): Segment[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const stack: string[] = []; // stack[level-1] = heading text
  const segments: Segment[] = [];
  let buf: string[] = [];

  const flush = () => {
    const body = buf.join('\n').trim();
    // a flush with only heading text (a chapter title with no prose under it) is not its
    // own chunk — the stack has already captured it for the next segment's path.
    const hasProse = body.split('\n').some((l) => l.trim() && !HEADING.test(l) && !CHUNK_MARKER.test(l));
    if (hasProse) {
      const path = stack.filter(Boolean);
      const deepest = path[path.length - 1] ?? '';
      segments.push({
        headingPath: path.slice(),
        chapter: stack[0] || undefined,
        atomic: cfg.atomicSection.some((re) => re.test(deepest)),
        body,
      });
    }
    buf = [];
  };

  for (const line of lines) {
    if (CHUNK_MARKER.test(line)) {
      flush();
      continue;
    }
    const h = line.match(HEADING);
    if (h) {
      const level = h[1].length;
      if (level <= cfg.splitAtOrAbove) flush();
      stack.length = level - 1;
      stack[level - 1] = h[2].trim();
      // keep the heading text in the body too, so a chunk reads naturally
      buf.push(line);
      continue;
    }
    buf.push(line);
  }
  flush();
  return segments;
}

type Unit = { text: string; table: boolean };

/** Break a segment body into paragraph / table units — the atoms that are never split. */
function toUnits(body: string): Unit[] {
  const units: Unit[] = [];
  let cur: string[] = [];
  let curTable: boolean | null = null;

  const push = () => {
    const t = cur.join('\n').trim();
    if (t) units.push({ text: t, table: curTable === true });
    cur = [];
    curTable = null;
  };

  for (const line of body.split('\n')) {
    if (!line.trim()) {
      push();
      continue;
    }
    const isTable = TABLE_LINE.test(line);
    if (curTable !== null && isTable !== curTable) push();
    curTable = isTable;
    cur.push(line);
  }
  push();
  return units;
}

function isHeadingOnly(text: string): boolean {
  return text.split('\n').every((l) => !l.trim() || HEADING.test(l));
}

/** Greedily pack units into ≤ TARGET_CHARS chunks; never split a unit, never strand a heading. */
function packUnits(units: Unit[]): { text: string; table: boolean }[] {
  const out: { text: string; table: boolean }[] = [];
  let cur: string[] = [];
  let curTables = 0;
  let curLen = 0;
  let curHasProse = false; // a lone heading never triggers its own chunk

  for (const u of units) {
    if (curHasProse && curLen + u.text.length + 2 > TARGET_CHARS) {
      out.push({ text: cur.join('\n\n'), table: curTables > 0 });
      cur = [];
      curTables = 0;
      curLen = 0;
      curHasProse = false;
    }
    cur.push(u.text);
    curLen += u.text.length + 2;
    if (u.table) curTables++;
    if (!isHeadingOnly(u.text)) curHasProse = true;
  }
  if (cur.length) out.push({ text: cur.join('\n\n'), table: curTables > 0 });
  return out;
}

interface RawChunk {
  text: string;
  table: boolean;
  headingPath: string[];
  chapter?: string;
  deepest?: string;
}

/** Content length excluding a leading markdown heading line. */
function proseLen(text: string): number {
  return text.replace(/^#{1,6}\s+.+\r?\n?/, '').trim().length;
}

/**
 * Merge a fragment (< MIN_CHARS of prose under its heading) into its neighbour — a fragment
 * is never left standalone (spec §8.3). A **table** is a complete unit regardless of size
 * and is never merged away; likewise a chunk that has already absorbed a table. Direction:
 * into the predecessor; the first chunk absorbs its successor instead.
 */
function mergeSmall(raw: RawChunk[]): RawChunk[] {
  const out: RawChunk[] = [];
  for (const r of raw) {
    const prev = out[out.length - 1];
    const rTiny = !r.table && proseLen(r.text) < MIN_CHARS;
    const prevTiny = !!prev && !prev.table && proseLen(prev.text) < MIN_CHARS;
    if (prev && (rTiny || prevTiny)) {
      out[out.length - 1] = { ...prev, text: `${prev.text}\n\n${r.text}`, table: prev.table || r.table };
    } else {
      out.push({ ...r });
    }
  }
  return out;
}

export function chunkDocument(text: string, docType: DocType, meta: SourceMeta): ChunkResult {
  const cfg = DOC_TYPE_CONFIG[docType];
  const segments = splitSegments(text, cfg);

  let raw: RawChunk[] = [];
  for (const seg of segments) {
    const parts = seg.atomic
      ? [{ text: seg.body, table: /^\s*\|/m.test(seg.body) }]
      : packUnits(toUnits(seg.body));
    const deepest = seg.headingPath[seg.headingPath.length - 1];
    for (const p of parts) {
      raw.push({ text: p.text, table: p.table, headingPath: seg.headingPath, chapter: seg.chapter, deepest });
    }
  }
  raw = mergeSmall(raw);

  const warnings: string[] = [];
  const chunks: IngestChunk[] = raw.map((r, i) => {
    if (r.text.length > MAX_CHARS) {
      warnings.push(
        `chunk ${i} (${r.deepest ?? 'untitled'}) is ${r.text.length} chars > ${MAX_CHARS} — add a <!-- chunk --> marker`,
      );
    }
    const contextHead = `[Context: ${[meta.source, ...r.headingPath].join(' · ')}]`;
    return {
      chunk_index: i,
      text: `${contextHead}\n${r.text}`,
      metadata: {
        source: meta.source,
        url: meta.url,
        chapter: r.chapter,
        section: r.deepest,
        section_title: r.deepest,
        content_type: r.table ? 'table' : 'text',
        emirate: meta.emirate,
        licensing_body: meta.licensing_body,
        profession_type: meta.profession_type,
        course_applicability: meta.course_applicability,
        document_date: meta.document_date,
      },
    };
  });

  return { chunks, warnings };
}
