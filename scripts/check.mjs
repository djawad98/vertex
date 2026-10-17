// Post-build check: every local link and asset in every exported page exists. Run: npm run check
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const pages = readdirSync('out', { recursive: true }).filter((f) => f.endsWith('.html'));
const missing = new Set();
for (const page of pages) {
  const html = readFileSync(`out/${page}`, 'utf8');
  if (page !== '404.html' && !page.startsWith('_not-found')) {
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${page}: needs exactly one h1`);
    assert.match(html, /<title>[^<]+<\/title>/, `${page}: missing title`);
    assert.match(html, /name="description"/, `${page}: missing meta description`);
  }
  for (const [, a, b] of html.matchAll(/(?:src|href)="(\/[^"#?]*)"|(\/(?:work|brand|team)\/[^\s",]+\.webp)/g)) {
    const r = a ?? b;
    if (!existsSync(`out${r}${r.endsWith('/') ? 'index.html' : ''}`)) missing.add(`${page}: ${r}`);
  }
}
assert.deepEqual([...missing], [], `missing:\n${[...missing].join('\n')}`);
console.log(`ok: ${pages.length} pages`);
