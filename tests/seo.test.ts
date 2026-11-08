import { describe, expect, it } from 'vitest';
import { getT } from '@/i18n';
import { LOCALES } from '@/i18n/config';
import { pageMeta } from '@/lib/meta';
import { registry } from '@/lib/registry';
import { ldJson, websiteLd } from '@/lib/seo';
import { sitemapPaths, sitemapXml } from '@/lib/sitemap';

const r = registry();
const SITE = 'https://team-pj-lab.github.io/CISS';

describe('sitemap', () => {
  const paths = sitemapPaths(r);
  const xml = sitemapXml(SITE, paths, LOCALES);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it('lists every section, algorithm and author once per locale, no search page', () => {
    expect(paths.length).toBe(9 + r.algorithms.length + r.authorCredit.size);
    expect(new Set(paths).size).toBe(paths.length);
    expect(locs.length).toBe(paths.length * LOCALES.length);
    expect(new Set(locs).size).toBe(locs.length);
    expect(locs.some((u) => u.includes('/search'))).toBe(false);
  });

  it('uses the same trailing-slash URLs as the page canonical', () => {
    expect(locs).toContain(`${SITE}/ko/`);
    expect(locs).toContain(`${SITE}/en/algorithms/quicksort/`);
    expect(pageMeta('en', '/algorithms/quicksort').alternates?.canonical).toBe('/en/algorithms/quicksort');
    expect(locs.every((u) => u.startsWith(`${SITE}/`) && u.endsWith('/'))).toBe(true);
  });

  it('declares hreflang alternates with an x-default', () => {
    const first = xml.split('</url>')[0];
    for (const l of LOCALES) expect(first).toContain(`hreflang="${l}"`);
    expect(first).toContain(`hreflang="x-default" href="${SITE}/ko/"`);
    expect(xml.startsWith('<?xml')).toBe(true);
  });
});

describe('website JSON-LD', () => {
  it('names the site CISS in every locale', () => {
    for (const l of LOCALES) {
      const ld = websiteLd(SITE, l, getT(l));
      expect(ld.name).toBe('CISS');
      expect(ld.url).toBe(`${SITE}/${l}/`);
      expect(ld.alternateName).toContain('Code Information Sharing Service');
    }
  });
  it('cannot break out of the script tag', () => {
    expect(ldJson({ x: '</script><b>' })).not.toContain('</script>');
    expect(JSON.parse(ldJson({ x: '</script>' })).x).toBe('</script>');
  });
});
