'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';

// RAG Sources table actions. Re-verify admin on every write (never trust the
// client); whitelist which columns a patch can touch — this is a generic
// per-cell save, so nothing here should be able to write an arbitrary column.

const EDITABLE_FIELDS = [
  'title',
  'url',
  'type',
  'emirate',
  'licensing_body',
  'course_applicability',
  'comments',
] as const;
type EditableField = (typeof EDITABLE_FIELDS)[number];

export async function updateSource(id: string, patch: Partial<Record<EditableField, unknown>>) {
  await requireAdmin();
  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(patch) as EditableField[]) {
    if (EDITABLE_FIELDS.includes(key)) clean[key] = patch[key];
  }
  if (Object.keys(clean).length === 0) return;

  const { error } = await supabaseAdmin().from('rag_sources').update(clean).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/dashboard');
}

/** Blank placeholder row — sha256 stays null (nothing's been ingested yet). */
export async function addSource() {
  await requireAdmin();
  const { error } = await supabaseAdmin()
    .from('rag_sources')
    .insert({ title: 'Untitled source', course_applicability: [] });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/dashboard');
}
