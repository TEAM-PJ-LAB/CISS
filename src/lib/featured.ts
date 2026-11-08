/**
 * 정적 배포(GitHub Pages 1GB)에서 미리 만드는 기여자 페이지의 범위.
 * 알고리즘 2개 이상이거나 점수 상위 FEATURED_TOP명인 기여자는 정적 페이지(/authors/<slug>/, 검색 색인 대상),
 * 나머지는 공용 페이지(/authors/view/?a=<slug>)가 data/author-pages/<slug>.json을 읽어 그린다.
 * 서버 모드는 모든 기여자 페이지를 그대로 렌더한다.
 */
import type { Registry } from './registry';
import { STATIC } from './runtime';

export const FEATURED_TOP = 600;
const cache = new WeakMap<Registry, Set<string>>();

export function featuredAuthors(r: Registry): Set<string> {
  if (!cache.has(r)) {
    const top = r.ranking().slice(0, FEATURED_TOP).map((y) => y.author.slug);
    const multi = [...r.authorCredit.values()].filter((y) => y.algorithms.length >= 2).map((y) => y.author.slug);
    cache.set(r, new Set([...top, ...multi]));
  }
  return cache.get(r)!;
}

/** 기여자 링크 경로(로케일 접두사 없이). */
export const authorPath = (r: Registry, slug: string, isStatic = STATIC) =>
  !isStatic || featuredAuthors(r).has(slug) ? `/authors/${slug}` : `/authors/view?a=${encodeURIComponent(slug)}`;
