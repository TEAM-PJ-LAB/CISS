/** CISS domain model — PRD §5. */

export const FIELDS = [
  'sorting', 'searching', 'structures', 'graph', 'strings', 'compression',
  'cryptography', 'ml', 'numerical', 'geometry', 'graphics', 'systems',
] as const;
export type Field = (typeof FIELDS)[number];

/** PRD §5 Derivation 유형. */
export const DERIVATION_TYPES = ['variant', 'optimization', 'generalization', 'composition', 'port'] as const;
export type DerivationType = (typeof DERIVATION_TYPES)[number];

/**
 * verified  — 원 논문 인용·저자 진술·표준 참고서에 파생 관계가 명시됨
 * estimated — 시간 순서·구조 유사성 등 간접 근거만 있음 (PRD §8 "추정")
 * related   — 같은 문제를 다루지만 파생 근거 없음 (PRD §8 "관련"), 점수 미반영
 */
export const EDGE_STATUSES = ['verified', 'estimated', 'related'] as const;
export type EdgeStatus = (typeof EDGE_STATUSES)[number];

export const EVIDENCE_KINDS = ['citation', 'author-statement', 'reference-work', 'structural', 'temporal'] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

/** `doi:…` | `arxiv:…` | `url:…` */
export type SourceId = `doi:${string}` | `arxiv:${string}` | `url:${string}`;

export interface Origin {
  authors: string[]; // author slugs; empty = 기원 미상
  year: number; // negative = BCE
  title: string;
  venue: string;
  id?: SourceId;
  note?: string;
}

export interface Algorithm {
  slug: string;
  name: string;
  ko?: string;
  aka?: string[];
  field: Field;
  summary: string;
  origins: Origin[]; // >1 = 복수 기원 (PRD §8 독립 발견)
  kw?: string[];
}

export interface Author {
  slug: string;
  name: string;
  org?: boolean;
}

export interface Evidence {
  kind: EvidenceKind;
  text: string;
  ref?: SourceId;
}

export interface Derivation {
  id: string; // `${from}>${to}`
  from: string;
  to: string;
  type: DerivationType;
  status: EdgeStatus;
  confidence: number; // 0..1
  evidence: Evidence[];
}

export interface Implementation {
  algo: string;
  repo: string; // owner/name
  path?: string; // file path at HEAD
  symbol?: string;
  lang: string;
}
