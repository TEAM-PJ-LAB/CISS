import { ALGORITHMS } from '@/data/algorithms';
import { FIELDS, type Algorithm } from '@/data/types';
import { content, formatYear, getT } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/config';
import type { Registry } from './registry';
import { norm, searchIndex, type IndexEntry, type SearchIndex } from './search-core';

export { norm, type Hit } from './search-core';

const LOCAL_NAMES = new Map(ALGORITHMS.map((a) => [a.slug, [...new Set(LOCALES.map((l) => content(l).local(a)).filter(Boolean) as string[])]]));

function sub(r: Registry, a: Algorithm, locale: Locale) {
  const t = getT(locale);
  const names = [...new Set(a.origins.flatMap((o) => o.authors))].map((s) => r.author.get(s)?.name ?? s);
  const who = !names.length ? t('author.unknown') : names.length > 2 ? `${names[0]} ${t('common.andMore', { n: names.length - 1 })}` : names.join(', ');
  const local = content(locale).local(a);
  return [local && local !== a.name ? local : null, t(`field.${a.field}`), who, formatYear(t, r.yearOf(a.slug))].filter(Boolean).join(' · ');
}

const cache = new Map<string, SearchIndex>();

/** 로케일별 검색 인덱스. 정적 빌드에서는 그대로 JSON으로 내보낸다. */
export function buildSearchIndex(r: Registry, locale: Locale): SearchIndex {
  const key = `${locale}:${r.algorithms.length}:${r.authors.length}`;
  if (cache.has(key)) return cache.get(key)!;
  const t = getT(locale);
  const c = content(locale);
  const entries: IndexEntry[] = r.algorithms.map((a) => {
    const locals = LOCAL_NAMES.get(a.slug) ?? [];
    const authors = [...new Set(a.origins.flatMap((o) => o.authors))];
    return {
      k: 'a', s: a.slug, l: a.name, n: [a.name, ...locals, a.slug, ...(a.aka ?? []), ...(a.kw ?? [])], top: 1 + locals.length,
      sub: sub(r, a, locale), sc: r.credit.get(a.slug)!.score, f: a.field, y: r.yearOf(a.slug),
      au: authors.map((s) => r.author.get(s)?.name ?? s), sm: c.summary(a), a: authors.map((s) => ({ s, n: r.author.get(s)?.name ?? s })),
    };
  });
  for (const ac of r.authorCredit.values()) {
    entries.push({ k: 'p', s: ac.author.slug, l: ac.author.name, n: [ac.author.name], top: 1, sub: t('search.authorSub', { s: ac.score, n: ac.algorithms.length }), sc: ac.score });
  }
  const idx = { fields: Object.fromEntries(FIELDS.map((f) => [f, LOCALES.map((l) => norm(getT(l)(`field.${f}`)))])), entries };
  cache.set(key, idx);
  return idx;
}

export const search = (r: Registry, query: string, limit = 30, locale: Locale = 'ko') => searchIndex(buildSearchIndex(r, locale), query, limit);
