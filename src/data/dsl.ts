import type { Algorithm, Derivation, DerivationType, EdgeStatus, EvidenceKind, Field, Implementation, Origin, SourceId } from './types';

/** Origin: authors는 쉼표 구분 slug. */
export const o = (authors: string, year: number, title: string, venue: string, id?: SourceId, note?: string): Origin => ({
  authors: authors ? authors.split(',').map((s) => s.trim()) : [],
  year, title, venue, ...(id && { id }), ...(note && { note }),
});

type Extra = Pick<Algorithm, 'ko' | 'aka' | 'kw'>;

/** 분야 고정 팩토리. */
export const field = (f: Field) =>
  (slug: string, name: string, summary: string, origins: Origin[], x: Extra = {}): Algorithm =>
    ({ slug, name, field: f, summary, origins, ...x });

const KIND: Record<string, EvidenceKind> = { c: 'citation', a: 'author-statement', r: 'reference-work', s: 'structural', t: 'temporal' };
const STATUS: Record<string, EdgeStatus> = { v: 'verified', e: 'estimated', r: 'related' };
const TYPE: Record<string, DerivationType> = { var: 'variant', opt: 'optimization', gen: 'generalization', com: 'composition', port: 'port' };

/**
 * d('quicksort>introsort', 'com', 'v', 0.95, 'a', '근거', 'doi:…')
 * evidence kind: c 인용 · a 저자 진술 · r 참고서 · s 구조 · t 시간
 */
export const d = (edge: string, type: keyof typeof TYPE, status: keyof typeof STATUS, confidence: number,
  kind: keyof typeof KIND, text: string, ref?: SourceId): Derivation => {
  const [from, to] = edge.split('>');
  return { id: edge, from, to, type: TYPE[type], status: STATUS[status], confidence,
    evidence: [{ kind: KIND[kind], text, ...(ref && { ref }) }] };
};

/** i('timsort', 'python/cpython', 'Objects/listobject.c', 'C', 'list_sort_impl') */
export const i = (algo: string, repo: string, path: string | undefined, lang: string, symbol?: string): Implementation =>
  ({ algo, repo, lang, ...(path && { path }), ...(symbol && { symbol }) });
