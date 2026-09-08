// The content object the LLM emits for one milestone — and ONLY that. Everything
// else on a stored `milestone_content` row (milestone_id, course, phase_id, sources,
// document_date, top_score, schema_valid, status, …) is server-attached; the model
// never sees or sets it. See docs/MEDICAL_JOURNEY.md §3.3 (medblendapp repo).
//
// Two consumers, one definition:
//   - `contentSchema.safeParse(...)`  — server-side validation after generation.
//     A failure writes the row with schema_valid=false + raw_output; never served.
//   - `contentJsonSchema`             — handed to OpenRouter as
//     `response_format.json_schema` so the transport enforces shape too (spec §3.4).
//
// The `.max()` caps keep output ~300 tokens — a milestone card without scrolling, and
// no room for the model to pad ungrounded prose (spec §8.2, §8.7). They're also stated
// as word limits in prompt.ts. Loosen a cap here if a milestone type genuinely needs it.

import { z } from 'zod';

export const contentSchema = z.strictObject({
  /** One sentence: what this milestone is. */
  description: z.string().min(1).max(400),
  /** The process of completing it and its rough timeline. Disjoint from `description`. */
  what_to_expect: z.string().min(1).max(550),
  /**
   * What applicants get wrong AT THIS milestone — a misread threshold, a missed annual
   * window, steps out of order — grounded in the sources. `""` if the sources say nothing
   * about how people trip here; never a generic guess.
   */
  common_mistakes: z.string().max(400),
  /** Present only for milestones with an exam; `null` otherwise. */
  exam_name: z.string().max(120).nullable(),
  /** String, not number — values are heterogeneous ("900", "60%", "IELTS 6.0"). `null` if none. */
  minimum_score: z.string().max(120).nullable(),
  /**
   * Flat list. For the licensing milestone (DHA + DOH + MOHAP) each string is prefixed
   * with its authority, e.g. "DHA: 2 years post-internship clinical experience".
   */
  requirements: z.array(z.string().min(1).max(160)).max(6),
  /**
   * True when the retrieved chunks cover the milestone's CORE (its requirements and the
   * action it names). A missing secondary detail goes in `gaps` with this still true.
   */
  sufficient_context: z.boolean(),
  /** What was missing. `""` when nothing was. The backend overwrites this for the zero-chunk skip. */
  gaps: z.string().max(400),
});

export type MilestoneContent = z.infer<typeof contentSchema>;

/**
 * JSON Schema for OpenRouter's `response_format: { type: 'json_schema', json_schema: {
 * name, schema: contentJsonSchema, strict: true } }`. `z.toJSONSchema` emits
 * `additionalProperties: false` + every key required (nullable → `anyOf [string, null]`),
 * which is the strict-mode shape. If a specific `JOURNEY_GEN_MODEL` provider rejects the
 * `maxLength` / `maxItems` keywords, strip them in `openrouter.ts` before sending — the
 * Zod check above stays the real gate either way.
 */
export const contentJsonSchema = z.toJSONSchema(contentSchema);
