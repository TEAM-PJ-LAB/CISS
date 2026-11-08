import { describe, expect, it } from 'vitest';
import { isDetailPath, staticHref } from '@/lib/nav';

describe('static detail navigation (GitHub Pages size limit)', () => {
  it('treats only algorithm and author detail pages as full-load targets in static mode', () => {
    for (const p of ['/en/algorithms/quicksort', '/ko/authors/hoare/', '/ja/algorithms/introsort#parents', '/zh/authors/knuth?x=1'])
      expect(isDetailPath(p, true), p).toBe(true);
    for (const p of ['/en/algorithms', '/en/algorithms/', '/en/authors', '/en/graph', '/en/search?q=sort', '/en', 'https://x.org/en/algorithms/a'])
      expect(isDetailPath(p, true), p).toBe(false);
    expect(isDetailPath('/en/algorithms/quicksort', false)).toBe(false);
  });
  it('builds trailing-slash export URLs under the base path, keeping query and hash', () => {
    expect(staticHref('/en/algorithms/quicksort', '/CISS')).toBe('/CISS/en/algorithms/quicksort/');
    expect(staticHref('/en/algorithms/introsort#parents', '/CISS')).toBe('/CISS/en/algorithms/introsort/#parents');
    expect(staticHref('/ko/authors/hoare/', '')).toBe('/ko/authors/hoare/');
    expect(staticHref('/zh/authors/knuth?x=1', '/CISS')).toBe('/CISS/zh/authors/knuth/?x=1');
  });
});
