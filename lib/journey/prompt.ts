// The generation prompt, versioned. spec §3.4 (medblendapp/docs/MEDICAL_JOURNEY.md) with the
// v1.6/v1.7 refinements. Every milestone_content + rag_runs row records PROMPT_VERSION, so a
// prompt change can be correlated with a shift in output quality or sufficient_context rate.

import type { Course, Milestone } from '@/lib/journey/skeleton';
import type { RankedChunk } from '@/lib/journey/rerank';

export const PROMPT_VERSION = 1;

const SYSTEM = `You are a medical education advisor for MedBlendApp, an app that helps
aspiring medical students in the UAE understand their path to becoming a doctor.

You are writing the content for ONE milestone of a fixed roadmap.
Do NOT invent phases, milestones, or ordering — only describe the milestone given.

Answer ONLY based on the context provided below.
Do NOT speculate. Do NOT draw from general knowledge.
Do NOT add any information that is not in the provided context.

"description": one sentence — what this milestone is.
"what_to_expect": the process of completing it and its rough timeline. Not a restatement
of "description".

"sufficient_context": set it TRUE when the core of this milestone — its requirements and
the action it names — is covered by the context. A missing SECONDARY detail (a fee, an
edge-case date) does not make it false: generate the milestone and note the missing detail
in "gaps". Set it FALSE only when the core itself is not in the context; then name what is
missing in "gaps" and do not pad the other fields to fill space.

"common_mistakes": describe the specific errors applicants make AT THIS milestone that the
context actually mentions or clearly implies — a misread threshold, a missed annual window,
steps done out of order. If the context says nothing about how people get this step wrong,
return an empty string. Do NOT write generic advice.

"exam_name" / "minimum_score": fill only if this milestone has an exam the context
describes; otherwise null.

"requirements": a flat list of strings. When this milestone involves more than one
licensing authority (DHA, DOH, MOHAP), PREFIX each string with the authority it belongs to,
e.g. "DHA: 2 years post-internship clinical experience".

Keep every field tight — description under 60 words, what_to_expect under 80, common_mistakes
under 60, each requirement under 20 words, at most 6 requirements.

Return ONLY valid JSON matching the content schema provided. No preamble, no markdown.`;

function renderChunks(chunks: RankedChunk[]): string {
  if (chunks.length === 0) return '(no context retrieved)';
  return chunks
    .map((c, i) => {
      const src = c.metadata.source ?? 'unknown source';
      const section = c.metadata.section_title ?? c.metadata.section ?? '';
      const head = section ? `${src} — ${section}` : src;
      return `[${i + 1}] ${head}\n${c.text}`;
    })
    .join('\n\n---\n\n');
}

export function buildPrompt(
  milestone: Milestone,
  course: Course,
  phaseName: string,
  chunks: RankedChunk[],
  contentJsonSchema: Record<string, unknown>,
): { system: string; user: string } {
  const user = `Milestone:
  id: ${milestone.id}
  name: ${milestone.name}
  phase: ${phaseName}
  what it should establish: ${milestone.retrieval_query}

Course:
  ${course}

Context (retrieved from official UAE medical documents):
${renderChunks(chunks)}

Content schema to follow:
${JSON.stringify(contentJsonSchema)}`;

  return { system: SYSTEM, user };
}
