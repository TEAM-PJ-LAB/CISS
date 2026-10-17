import { ALGORITHMS } from '@/data/algorithms';
import { FIELDS, type Algorithm } from '@/data/types';
import { content, formatYear, getT } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/config';
import type { Registry } from './registry';

export const norm = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[\s\-–—_.'’()*·/、・]+/g, '');

export type Hit = { kind: 'algorithm' | 'author'; slug: string; label: string; sub: string; score: number };

const scoreText = (q: string, text: string, base: number) => {
  const t = norm(text);
  if (!t || !q) return 0;
  if (t === q) return base;
  if (t.startsWith(q)) return base * 0.7;
  if (t.includes(q)) return base * 0.5;
  return 0;
};

/** 모든 로케일의 현지 이름을 검색 대상으로 (한국어로 검색해도, 일본어로 검색해도 찾도록). */
const LOCAL_NAMES = new Map(ALGORITHMS.map((a) => [a.slug, LOCALES.map((l) => content(l).local(a)).filter(Boolean) as string[]]));
const FIELD_NAMES = new Map(FIELDS.map((f) => [f, LOCALES.map((l) => norm(getT(l)(`field.${f}`)))]));

export function search(r: Registry, query: string, limit = 30, locale: Locale = 'ko'): Hit[] {
  const q = norm(query);
  if (!q) return [];
  const t = getT(locale);
  const c = content(locale);
  const hits: Hit[] = [];
  const fieldMatch = FIELDS.find((f) => f === q || FIELD_NAMES.get(f)!.includes(q));

  for (const a of r.algorithms) {
    const names = [a.name, ...(LOCAL_NAMES.get(a.slug) ?? []), a.slug, ...(a.aka ?? []), ...(a.kw ?? [])];
    let s = Math.max(...names.map((n, i) => scoreText(q, n, i === 0 || i <= (LOCAL_NAMES.get(a.slug)?.length ?? 0) ? 100 : 80)));
    s = Math.max(s, ...a.origins.flatMap((o) => o.authors.map((x) => scoreText(q, r.author.get(x)?.name ?? x, 50))));
    s = Math.max(s, scoreText(q, c.summary(a), 20));
    if (fieldMatch === a.field) s = Math.max(s, 40);
    if (s > 0) hits.push({ kind: 'algorithm', slug: a.slug, label: a.name, sub: sub(r, a, locale), score: s + r.credit.get(a.slug)!.score / 1000 });
  }
  for (const ac of r.authorCredit.values()) {
    const s = scoreText(q, ac.author.name, 90) || scoreText(q, ac.author.slug, 70);
    if (s > 0) hits.push({ kind: 'author', slug: ac.author.slug, label: ac.author.name, sub: t('search.authorSub', { s: ac.score, n: ac.algorithms.length }), score: s + ac.score / 1000 });
  }
  return hits.sort((x, y) => y.score - x.score).slice(0, limit);
}

function sub(r: Registry, a: Algorithm, locale: Locale) {
  const t = getT(locale);
  const names = [...new Set(a.origins.flatMap((o) => o.authors))].map((s) => r.author.get(s)?.name ?? s);
  const who = !names.length ? t('author.unknown') : names.length > 2 ? `${names[0]} ${t('common.andMore', { n: names.length - 1 })}` : names.join(', ');
  const local = content(locale).local(a);
  return [local && local !== a.name ? local : null, t(`field.${a.field}`), who, formatYear(t, r.yearOf(a.slug))].filter(Boolean).join(' · ');
}
