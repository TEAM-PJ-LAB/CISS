import { describe, expect, it } from 'vitest';
import { authorPath, FEATURED_TOP, featuredAuthors } from '@/lib/featured';
import { registry } from '@/lib/registry';
import { sitemapPaths } from '@/lib/sitemap';

const r = registry();
const f = featuredAuthors(r);

describe('featured contributor pages (static size budget)', () => {
  it('covers every multi-algorithm contributor and the top of the ranking', () => {
    for (const a of r.authorCredit.values()) if (a.algorithms.length >= 2) expect(f.has(a.author.slug), a.author.slug).toBe(true);
    for (const y of r.ranking().slice(0, FEATURED_TOP)) expect(f.has(y.author.slug)).toBe(true);
    expect(f.size).toBeLessThan(r.authorCredit.size);
  });
  it('routes the rest through /authors/view in static mode only', () => {
    const rest = [...r.authorCredit.keys()].find((s) => !f.has(s))!;
    const top = [...f][0];
    expect(authorPath(r, rest, true)).toBe(`/authors/view?a=${rest}`);
    expect(authorPath(r, top, true)).toBe(`/authors/${top}`);
    expect(authorPath(r, rest, false)).toBe(`/authors/${rest}`);
  });
  it('never collides with the shared view route', () => {
    expect(r.authorCredit.has('view')).toBe(false);
  });
  it('lists only built contributor pages in the static sitemap', () => {
    expect(sitemapPaths(r, f).length).toBe(11 + r.algorithms.length + f.size);
  });
});
