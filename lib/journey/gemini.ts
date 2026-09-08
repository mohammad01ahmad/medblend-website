// Gemini client for PDF → markdown transcription (scripts/transcribe-pdf.ts). Google AI
// Studio key in JOURNEY_PDF_API_KEY; model in JOURNEY_PDF_MODEL (default gemini-2.5-flash).
// Gemini reads PDF bytes natively — internal rasterisation + OCR + the embedded text layer —
// so there is no page-image rendering step. Built per call so `next build` doesn't need the
// env var (matches lib/journey/openrouter.ts).

import { GoogleGenAI } from '@google/genai';

// gemini-flash-latest tracks the current recommended Flash model and has more free-tier
// headroom than the pinned gemini-2.5-flash (20 req/day). Override with JOURNEY_PDF_MODEL.
const DEFAULT_MODEL = 'gemini-flash-latest';
const MAX_OUTPUT_TOKENS = 32768;

export interface TranscribeUsage {
  prompt_tokens: number;
  completion_tokens: number;
}

export interface TranscribeResult {
  text: string;
  model: string;
  /** 'STOP' on a clean finish; 'MAX_TOKENS' means the batch was too big — caller lowers --batch. */
  finishReason: string | undefined;
  usage: TranscribeUsage;
}

/** Transcribe one PDF (or PDF slice) to markdown with the given instruction prompt. */
export async function transcribePdf(pdfBytes: Uint8Array, prompt: string): Promise<TranscribeResult> {
  const apiKey = process.env.JOURNEY_PDF_API_KEY;
  if (!apiKey) throw new Error('JOURNEY_PDF_API_KEY is not set');
  const model = process.env.JOURNEY_PDF_MODEL || DEFAULT_MODEL;

  const ai = new GoogleGenAI({ apiKey });
  const res = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: Buffer.from(pdfBytes).toString('base64'),
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      temperature: 0,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      // A transcription needs no reasoning — spend the whole budget on output, not thinking.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const u = res.usageMetadata;
  return {
    text: res.text ?? '',
    model,
    finishReason: res.candidates?.[0]?.finishReason,
    usage: {
      prompt_tokens: u?.promptTokenCount ?? 0,
      completion_tokens: u?.candidatesTokenCount ?? 0,
    },
  };
}
