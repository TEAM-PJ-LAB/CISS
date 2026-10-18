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

/* 페이로드 빌더: API 라우트와 정적 내보내기(scripts/export-static.mts)가 공유한다. */
export const algorithmsPayload = (r: Registry, list = r.algorithms) => ({ count: list.length, algorithms: list.map((a) => apiAlgorithm(r, a)) });

export function algorithmPayload(r: Registry, slug: string) {
  const a = r.algo.get(slug);
  if (!a) return null;
  const lin = r.lineage(a.slug);
  return { ...apiAlgorithm(r, a, true), lineage: { nodes: lin.nodes.map((n) => n.slug), edges: lin.edges.map((e) => e.id) } };
}

export const authorsPayload = (r: Registry) => ({
  authors: r.ranking().map((x, i) => ({ rank: i + 1, slug: x.author.slug, name: x.author.name, org: Boolean(x.author.org), score: x.score, byField: x.byField, algorithms: x.algorithms.map((y) => y.slug) })),
});

export function authorPayload(r: Registry, slug: string) {
  const ac = r.authorCredit.get(slug);
  return ac ? { slug, name: ac.author.name, org: Boolean(ac.author.org), rank: r.rankOf.get(slug), score: ac.score, byField: ac.byField, algorithms: ac.algorithms } : null;
}

export const graphPayload = (r: Registry) => ({
  nodes: r.algorithms.map((a) => ({ id: a.slug, name: a.name, field: a.field, year: r.yearOf(a.slug), score: r.credit.get(a.slug)!.score })),
  edges: r.derivations,
});
