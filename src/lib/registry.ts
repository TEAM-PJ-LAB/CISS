import { ALGORITHMS } from '@/data/algorithms';
import { AUTHORS } from '@/data/authors';
import { DERIVATIONS } from '@/data/derivations';
import { IMPLEMENTATIONS } from '@/data/implementations';
import CHECKS from '@/data/source-checks.json';
import type { Algorithm, Author, Derivation, Field, Implementation, SourceId } from '@/data/types';
import { FIELDS } from '@/data/types';

/**
 * 명예 점수 v1 (PRD §11 미결정 사항에 대한 작업 가설 — /about에 공개).
 *   edge weight  w = 1 (검증) | 0.5·confidence (추정) | 0 (관련)
 *   algorithm    = ORIGIN + DIRECT·Σw(직접 파생) + INDIRECT·Σ best(v)·DECAY^(depth−1) (간접 하위 계보) + IMPL·구현체 수
 *   author       = Σ algorithm × share, share = 1/|기원| × 1/|해당 기원 저자|  (복수 기원은 균등 분배)
 */
export const SCORE = { ORIGIN: 10, DIRECT: 5, INDIRECT: 2, IMPL: 1, ESTIMATED: 0.5, DECAY: 0.5 } as const;

export const edgeWeight = (e: Derivation) =>
  e.status === 'related' ? 0 : e.status === 'verified' ? 1 : SCORE.ESTIMATED * e.confidence;

export interface Credit {
  direct: number;
  descendants: number;
  implementations: number;
  score: number;
}

export interface SourceCheck {
  status: 'ok' | 'mismatch' | 'notfound';
  title?: string;
  year?: number;
  checked: string;
  via: string;
}

export interface AuthorCredit {
  author: Author;
  score: number;
  byField: Partial<Record<Field, number>>;
  algorithms: { slug: string; share: number; points: number }[];
}

const round = (x: number) => Math.round(x * 10) / 10;

export function buildRegistry(
  algorithms: Algorithm[] = ALGORITHMS,
  authors: Author[] = AUTHORS,
  derivations: Derivation[] = DERIVATIONS,
  implementations: Implementation[] = IMPLEMENTATIONS,
) {
  const algo = new Map(algorithms.map((a) => [a.slug, a]));
  const author = new Map(authors.map((a) => [a.slug, a]));
  const out = new Map<string, Derivation[]>();
  const inc = new Map<string, Derivation[]>();
  for (const a of algorithms) { out.set(a.slug, []); inc.set(a.slug, []); }
  for (const e of derivations) { out.get(e.from)?.push(e); inc.get(e.to)?.push(e); }
  const impls = new Map<string, Implementation[]>();
  for (const i of implementations) impls.set(i.algo, [...(impls.get(i.algo) ?? []), i]);

  const yearOf = (slug: string): number | null => {
    const ys = algo.get(slug)?.origins.map((o) => o.year) ?? [];
    return ys.length ? Math.min(...ys) : null;
  };

  /** 비관련 엣지로 도달 가능한 노드 → 최적 경로 가중치·깊이. */
  const reach = (slug: string, dir: 'down' | 'up') => {
    const best = new Map<string, { w: number; depth: number }>();
    const queue = [slug];
    while (queue.length) {
      const s = queue.shift()!;
      const { w, depth } = s === slug ? { w: 1, depth: 0 } : best.get(s)!;
      for (const e of (dir === 'down' ? out : inc).get(s) ?? []) {
        if (e.status === 'related') continue;
        const next = dir === 'down' ? e.to : e.from;
        if (next === slug) continue;
        const nw = w * edgeWeight(e) * (depth ? SCORE.DECAY : 1);
        const prev = best.get(next);
        if (prev && prev.w >= nw && prev.depth <= depth + 1) continue;
        best.set(next, { w: Math.max(nw, prev?.w ?? 0), depth: Math.min(depth + 1, prev?.depth ?? Infinity) });
        queue.push(next);
      }
    }
    return best;
  };

  const credit = new Map<string, Credit>();
  for (const a of algorithms) {
    const direct = (out.get(a.slug) ?? []).filter((e) => e.status !== 'related');
    const children = new Set(direct.map((e) => e.to));
    const desc = reach(a.slug, 'down');
    const indirect = [...desc].filter(([s]) => !children.has(s)).reduce((sum, [, v]) => sum + v.w, 0);
    const nImpl = impls.get(a.slug)?.length ?? 0;
    credit.set(a.slug, {
      direct: children.size,
      descendants: desc.size,
      implementations: nImpl,
      score: round(SCORE.ORIGIN + SCORE.DIRECT * direct.reduce((s, e) => s + edgeWeight(e), 0) + SCORE.INDIRECT * indirect + SCORE.IMPL * nImpl),
    });
  }

  const authorCredit = new Map<string, AuthorCredit>();
  for (const a of algorithms) {
    const pts = credit.get(a.slug)!.score;
    for (const o of a.origins) for (const s of o.authors) {
      const share = 1 / a.origins.length / o.authors.length;
      const ac = authorCredit.get(s) ?? { author: author.get(s)!, score: 0, byField: {}, algorithms: [] };
      const row = ac.algorithms.find((r) => r.slug === a.slug);
      if (row) { row.share += share; row.points = round(pts * row.share); } else ac.algorithms.push({ slug: a.slug, share, points: round(pts * share) });
      ac.score += pts * share;
      ac.byField[a.field] = (ac.byField[a.field] ?? 0) + pts * share;
      authorCredit.set(s, ac);
    }
  }
  for (const ac of authorCredit.values()) {
    ac.score = round(ac.score);
    for (const f of Object.keys(ac.byField) as Field[]) ac.byField[f] = round(ac.byField[f]!);
    ac.algorithms.sort((x, y) => y.points - x.points);
  }

  const ranking = (f?: Field) => [...authorCredit.values()]
    .map((ac) => ({ ...ac, value: f ? ac.byField[f] ?? 0 : ac.score }))
    .filter((r) => r.value > 0)
    .sort((x, y) => y.value - x.value || x.author.name.localeCompare(y.author.name));

  const rankOf = new Map(ranking().map((r, i) => [r.author.slug, i + 1]));
  const checks = CHECKS as Record<string, SourceCheck>;

  /** 초점 노드의 전체 상위·하위 계보 + 인접 관련 엣지. */
  const lineage = (slug: string) => {
    const nodes = new Set([slug, ...reach(slug, 'up').keys(), ...reach(slug, 'down').keys()]);
    for (const e of [...(out.get(slug) ?? []), ...(inc.get(slug) ?? [])]) if (e.status === 'related') { nodes.add(e.from); nodes.add(e.to); }
    const edges = derivations.filter((e) => nodes.has(e.from) && nodes.has(e.to)
      && (e.status !== 'related' || e.from === slug || e.to === slug));
    return { nodes: [...nodes].map((s) => algo.get(s)!), edges };
  };

  const stats = () => {
    const nonRelated = derivations.filter((e) => e.status !== 'related');
    const verified = nonRelated.filter((e) => e.status === 'verified').length;
    const ids = new Set(algorithms.flatMap((a) => a.origins.map((o) => o.id)).filter((id): id is SourceId => Boolean(id && !id.startsWith('url:'))));
    return {
      algorithms: algorithms.length,
      authors: authorCredit.size,
      edges: derivations.length,
      derivations: nonRelated.length,
      verified,
      verifiedRatio: nonRelated.length ? verified / nonRelated.length : 0,
      implementations: implementations.length,
      multiOrigin: algorithms.filter((a) => a.origins.length > 1).length,
      sources: ids.size,
      sourcesChecked: [...ids].filter((id) => checks[id]?.status === 'ok').length,
    };
  };

  return {
    algorithms, authors, derivations, implementations, checks,
    algo, author, out, inc, impls, credit, authorCredit, rankOf,
    yearOf, ranking, lineage, stats,
    fields: FIELDS,
    topAlgorithms: (n: number, f?: Field) => algorithms
      .filter((a) => !f || a.field === f)
      .sort((x, y) => credit.get(y.slug)!.score - credit.get(x.slug)!.score || x.name.localeCompare(y.name))
      .slice(0, n),
  };
}

export type Registry = ReturnType<typeof buildRegistry>;

let cached: Registry | undefined;
export const registry = () => (cached ??= buildRegistry());
