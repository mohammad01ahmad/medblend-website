// Assertion-based self-check for lib/journey/html-to-markdown. No framework yet (vitest is
// still pending, per the plan) — run directly: `tsx tests/html-to-markdown.test.ts`.

import assert from 'node:assert/strict';
import { htmlToMarkdown } from '@/lib/journey/html-to-markdown';

const html = `<!doctype html><html><head><title>Site title — ignored</title>
<style>.x{color:red}</style></head>
<body>
<nav>Home About Programs Contact</nav>
<article>
<h1>Undergraduate Admissions</h1>
<p>The University of Sharjah's College of Medicine offers a six-year Bachelor of Medicine
and Bachelor of Surgery. Admission is competitive and selective. The minimum overall
average for the Medicine programme is 95%, and applicants are ranked on academic merit,
the admission interview, and performance in the required standardised tests.</p>
<h2>Grade thresholds by curriculum</h2>
<p>The minimum secondary-school average required to be considered for Medicine varies by
the applicant's curriculum:</p>
<table>
<thead><tr><th>Curriculum</th><th>Threshold</th></tr></thead>
<tbody>
<tr><td>UAE Advanced Track</td><td>90%</td></tr>
<tr><td>Indian CBSE / ICSE</td><td>80%</td></tr>
<tr><td>Pakistan / Bangladesh</td><td>75%</td></tr>
<tr><td>IB Diploma</td><td>28 points</td></tr>
<tr><td>UK A-levels</td><td>minimum C in O-levels plus B/C in science AS/A-levels</td></tr>
</tbody>
</table>
<h2>English proficiency</h2>
<p>All applicants must demonstrate English proficiency through one of: EmSAT English with a
minimum score of 1400, IELTS Academic 6.0, or TOEFL iBT 79. UAE nationals from the national
curriculum must also present EmSAT Arabic with a minimum of 800.</p>
<h2>Application fee</h2>
<p>A non-refundable competition fee of AED 1,500 applies to the Medicine programme and must
be paid before the application is reviewed.</p>
<script>window.__evil = 1; document.write('tracking-pixel');</script>
</article>
<footer>© 2026 The University. All rights reserved.</footer>
</body></html>`;

const { markdown, stats } = htmlToMarkdown(html, 'UoS Undergraduate Admissions');

assert.ok(markdown.startsWith('# UoS Undergraduate Admissions\n'), 'prepends the manifest title as h1');
assert.match(markdown, /^## Grade thresholds by curriculum$/m, 'keeps subheadings as ##');
assert.match(markdown, /\|\s*Curriculum\s*\|\s*Threshold\s*\|/, 'renders the table header as GFM');
assert.match(markdown, /\|\s*UAE Advanced Track\s*\|\s*90%\s*\|/, 'keeps the first table row');
assert.match(markdown, /\|\s*IB Diploma\s*\|\s*28 points\s*\|/, 'keeps every table row');
assert.ok(!markdown.includes('__evil'), 'drops <script> content');
assert.ok(!markdown.includes('tracking-pixel'), 'drops inline script writes');
assert.ok(!/Home About Programs Contact/.test(markdown), 'drops <nav> chrome');
assert.ok(!/All rights reserved/.test(markdown), 'drops <footer> chrome');
assert.equal(stats.tables, 1, `stats counts one table (got ${stats.tables})`);
assert.ok(stats.headings >= 4, `stats counts headings (got ${stats.headings})`);
assert.ok(!stats.thin, 'a real article is not flagged thin');

// A JS-app shell → thin, so the caller warns and the human re-runs with a browser-saved copy.
const shell = '<!doctype html><html><body><div id="root"></div><script src="/app.js"></script></body></html>';
assert.ok(htmlToMarkdown(shell, 'Some Page').stats.thin, 'an empty app shell is flagged thin');

console.log('html-to-markdown: all assertions passed');
