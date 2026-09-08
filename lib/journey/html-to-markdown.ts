// HTML → clean markdown for the RAG corpus. Pure and network-free — scripts/fetch-sources.ts
// does the fetching. Mirrors RAGFlow's web connector (common/data_source/html_utils.py):
// raw HTML → strip site chrome via a Readability pass → structure-preserving markdown with
// real | … | tables. The output is a starting point for the spec §7.1 human review
// (medblendapp/docs/MEDICAL_JOURNEY.md), not the finished corpus file.

import { parseHTML } from 'linkedom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';

// Below this, the extraction almost certainly failed — typically a JS-app page whose real
// content is rendered client-side and never arrives in the raw HTML. The caller warns and
// the human re-runs with a browser-saved copy (--from-raw).
const THIN_MARKDOWN_CHARS = 800;

// Readability is trusted only when it keeps at least this share of the body's visible text.
// It sometimes discards most of a page as "boilerplate" on SSR apps with unusual markup
// (e.g. Next.js sites); below the threshold we take the whole-body fallback instead —
// RAGFlow's trafilatura→bs4 rule (common/data_source/html_utils.py).
const READABILITY_MIN_TEXT_SHARE = 0.4;
const READABILITY_MIN_TEXT_CHARS = 500;

export interface MarkdownStats {
  htmlChars: number;
  markdownChars: number;
  headings: number;
  tables: number;
  /** true when the result looks empty/failed — caller should warn. */
  thin: boolean;
  /** true when Readability bailed and the whole-body fallback was used. */
  usedFallback: boolean;
}

export interface HtmlToMarkdownResult {
  markdown: string;
  /** Readability's detected article title (informational — caller prepends the manifest title). */
  articleTitle: string | null;
  stats: MarkdownStats;
}

function buildTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx', // # / ## / ### — the boundaries chunk.ts splits on
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
  });
  td.use(gfm); // tables / strikethrough / task lists — `tables` is the one that matters here
  td.remove(['script', 'style', 'noscript', 'iframe', 'form', 'button']);
  // Images carry no value in a text corpus and their (often relative) URLs are pure noise.
  td.addRule('dropImages', { filter: 'img', replacement: () => '' });
  // Keep link text, drop the href — a corpus chunk is embedded and read, never clicked.
  td.addRule('flattenLinks', { filter: 'a', replacement: (content) => content });
  return td;
}

const CHROME_SELECTOR =
  'nav, header, footer, aside, script, style, noscript, iframe, form, svg, ' +
  '[role="navigation"], [role="banner"], [role="contentinfo"], [role="search"], [aria-hidden="true"]';

function stripChrome(html: string): string {
  const { document } = parseHTML(html);
  document.querySelectorAll(CHROME_SELECTOR).forEach((el) => el.remove());
  return document.body?.innerHTML ?? document.documentElement?.innerHTML ?? '';
}

function collapse(text: string): number {
  return text.replace(/\s+/g, ' ').trim().length;
}

function textLen(htmlFragment: string): number {
  // Wrap so a bare fragment parses under <body> (linkedom won't synthesise one otherwise).
  const { document } = parseHTML(`<!doctype html><html><body>${htmlFragment}</body></html>`);
  return collapse(document.body?.textContent ?? '');
}

export function htmlToMarkdown(html: string, title: string): HtmlToMarkdownResult {
  // Readability mutates the document it is handed, so give it its own parse.
  const { document } = parseHTML(html);

  // The whole-body fallback (chrome removed) — always computed; it is the floor.
  const fallbackHtml = stripChrome(html);
  const fallbackTextLen = textLen(fallbackHtml);

  let articleHtml = '';
  let articleTitle: string | null = null;
  let articleTextLen = 0;
  try {
    const parsed = new Readability(document, { charThreshold: 200 }).parse();
    if (parsed?.content?.trim()) {
      articleHtml = parsed.content;
      articleTitle = parsed.title?.trim() || null;
      articleTextLen = collapse(parsed.textContent ?? ''); // Readability gives plain text directly
    }
  } catch {
    // fall through to the fallback
  }

  const useReadability =
    articleTextLen >= READABILITY_MIN_TEXT_CHARS &&
    articleTextLen >= fallbackTextLen * READABILITY_MIN_TEXT_SHARE;
  const usedFallback = !useReadability;

  const body = buildTurndown().turndown(usedFallback ? fallbackHtml : articleHtml).trim();
  const markdown = `# ${title}\n\n${body}\n`;

  const headings = (markdown.match(/^#{1,6}\s+\S/gm) ?? []).length;
  const tables = (body.match(/^\|[\s:|-]*-[\s:|-]*\|\s*$/gm) ?? []).length; // GFM separator rows

  return {
    markdown,
    articleTitle,
    stats: {
      htmlChars: html.length,
      markdownChars: body.length,
      headings,
      tables,
      thin: body.length < THIN_MARKDOWN_CHARS,
      usedFallback,
    },
  };
}
