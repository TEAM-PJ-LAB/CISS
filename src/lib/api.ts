import type { Algorithm } from '@/data/types';
import type { Registry } from './registry';

/** 공개 API 표현 (PRD §6.3 Public API). */
export const apiAlgorithm = (r: Registry, a: Algorithm, full = false) => ({
  slug: a.slug, name: a.name, field: a.field, year: r.yearOf(a.slug),
  ...(a.ko && { nameKo: a.ko }), ...(a.aka && { aka: a.aka }),
  summary: a.summary,
  origins: a.origins.map((o) => ({ ...o, authors: o.authors.map((s) => ({ slug: s, name: r.author.get(s)?.name ?? s })) })),
  credit: r.credit.get(a.slug),
  ...(full && {
    parents: r.inc.get(a.slug)!, children: r.out.get(a.slug)!,
    implementations: (r.impls.get(a.slug) ?? []).map((i) => ({ ...i, url: `https://github.com/${i.repo}${i.path ? `/blob/HEAD/${i.path}` : ''}` })),
  }),
});

export const json = (data: unknown, init: ResponseInit = {}) =>
  Response.json(data, { ...init, headers: { 'Cache-Control': 'public, max-age=3600', ...init.headers } });
