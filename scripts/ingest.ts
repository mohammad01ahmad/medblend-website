// Corpus ingestion — reads corpus/sources.json + the cleaned-markdown files it names,
// chunks (structure-aware, spec §7.1), embeds, and upserts into rag_sources / rag_chunks.
// Run locally: `npm run ingest [-- --force]`. Not serverless (reads the local filesystem
// and batch-embeds). spec §3.2 phase 1, §7.7.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { SKELETON, type Course } from '@/lib/journey/skeleton';
import { chunkDocument, type DocType } from '@/lib/journey/chunk';
import { embed } from '@/lib/journey/openrouter';
import { hybridSearch } from '@/lib/journey/retrieve';

const CORPUS = join(process.cwd(), 'corpus');
const COURSE_KEYS = Object.keys(SKELETON) as Course[];

const sourceSchema = z.object({
  title: z.string(), // natural key — must be unique across the manifest
  path: z.string(),
  url: z.string().optional(),
  docType: z.enum([
    'regulatory_pdf',
    'regulatory_page',
    'university_program_page',
    'university_handbook',
  ]),
  emirate: z.string().optional(),
  licensing_body: z.string().optional(),
  profession_type: z.string().optional(),
  course_applicability: z.array(z.string()).min(1),
  document_date: z.string().optional(),
});
const manifestSchema = z.object({ sources: z.array(sourceSchema).min(1) });

async function embedBatched(texts: string[], size = 64): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += size) {
    out.push(...(await embed(texts.slice(i, i + size))));
  }
  return out;
}

async function main() {
  const force = process.argv.includes('--force');
  const manifestPath = join(CORPUS, 'sources.json');
  if (!existsSync(manifestPath)) {
    console.error(`corpus/sources.json not found (looked in ${CORPUS})`);
    process.exit(1);
  }
  const manifest = manifestSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf8')));
  const db = supabaseAdmin();
  const unknownCourseValues = new Set<string>();

  for (const src of manifest.sources) {
    if (src.path.toLowerCase().endsWith('.pdf')) {
      console.error(`${src.path}: PDF — clean it to markdown first (spec §7.1). Skipping.`);
      continue;
    }
    const filePath = join(CORPUS, src.path);
    if (!existsSync(filePath)) {
      console.error(`${src.title}: ${src.path} not found`);
      continue;
    }
    const text = readFileSync(filePath, 'utf8');
    const sha = createHash('sha256').update(text).digest('hex');

    const { data: existing } = await db
      .from('rag_sources')
      .select('id, sha256')
      .eq('title', src.title)
      .maybeSingle();

    if (existing && existing.sha256 === sha && !force) {
      console.log(`${src.title}: unchanged, skipped`);
      continue;
    }

    const { chunks, warnings } = chunkDocument(text, src.docType as DocType, {
      source: src.title,
      url: src.url,
      emirate: src.emirate,
      licensing_body: src.licensing_body,
      profession_type: src.profession_type,
      course_applicability: src.course_applicability,
      document_date: src.document_date,
    });
    warnings.forEach((w) => console.warn(`  ⚠ ${w}`));
    for (const v of src.course_applicability) {
      if (!COURSE_KEYS.includes(v as Course)) unknownCourseValues.add(v);
    }

    const sourceFields = {
      title: src.title,
      url: src.url ?? null,
      emirate: src.emirate ?? null,
      licensing_body: src.licensing_body ?? null,
      course_applicability: src.course_applicability,
      document_date: src.document_date ?? null,
      sha256: sha,
      ingested_at: new Date().toISOString(),
    };

    let sourceId: string;
    if (existing) {
      await db.from('rag_sources').update(sourceFields).eq('id', existing.id);
      sourceId = existing.id;
    } else {
      const { data: row, error } = await db
        .from('rag_sources')
        .insert(sourceFields)
        .select('id')
        .single();
      if (error || !row) {
        console.error(`${src.title}: rag_sources insert failed: ${error?.message}`);
        continue;
      }
      sourceId = row.id;
    }

    const vectors = await embedBatched(chunks.map((c) => c.text));
    await db.from('rag_chunks').delete().eq('source_id', sourceId);
    const { error: insErr } = await db.from('rag_chunks').insert(
      chunks.map((c, i) => ({
        source_id: sourceId,
        chunk_index: c.chunk_index,
        text: c.text,
        embedding: JSON.stringify(vectors[i]),
        metadata: c.metadata,
      })),
    );
    if (insErr) {
      console.error(`${src.title}: rag_chunks insert failed: ${insErr.message}`);
      continue;
    }
    console.log(`${src.title}: ${chunks.length} chunks`);
  }

  // --- validation a: unknown course_applicability values ---
  if (unknownCourseValues.size) {
    console.error(
      `\n✖ course_applicability values not in SKELETON (${COURSE_KEYS.join(', ')}): ` +
        [...unknownCourseValues].join(', '),
    );
    process.exit(1);
  }

  // --- validation b: per-milestone orphan check (spec §7.1) ---
  console.log('\nchecking milestone coverage…');
  const orphans: Partial<Record<Course, string[]>> = {};
  for (const course of COURSE_KEYS) {
    for (const phase of SKELETON[course]) {
      for (const m of phase.milestones) {
        const [vec] = await embed([m.retrieval_query]);
        const hits = await hybridSearch(m.retrieval_query, vec, course, 1);
        if (hits.length === 0) (orphans[course] ??= []).push(m.id);
      }
    }
  }
  const anyOrphans = Object.values(orphans).some((v) => v && v.length);
  for (const [course, ids] of Object.entries(orphans)) {
    if (ids?.length) {
      console.warn(`⚠ ${ids.length} ${course} milestones have zero matching chunks: ${ids.join(', ')}`);
    }
  }
  if (!anyOrphans) console.log('✓ every milestone has at least one matching chunk');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
