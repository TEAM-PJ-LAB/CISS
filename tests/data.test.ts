import { describe, expect, it } from 'vitest';
import { ALGORITHMS } from '@/data/algorithms';
import { AUTHORS } from '@/data/authors';
import { DERIVATIONS } from '@/data/derivations';
import { IMPLEMENTATIONS } from '@/data/implementations';
import { DERIVATION_TYPES, EDGE_STATUSES, FIELDS } from '@/data/types';

const algo = new Map(ALGORITHMS.map((a) => [a.slug, a]));
const year = (s: string) => Math.min(...algo.get(s)!.origins.map((o) => o.year));
const dup = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);

describe('seed lineage DB integrity', () => {
  it('PRD Phase 0 범위(100~300개)를 만족한다', () => {
    expect(ALGORITHMS.length).toBeGreaterThanOrEqual(100);
    expect(ALGORITHMS.length).toBeLessThanOrEqual(300);
  });

  it('slug가 유일하고 형식이 올바르다', () => {
    expect(dup(ALGORITHMS.map((a) => a.slug))).toEqual([]);
    expect(dup(AUTHORS.map((a) => a.slug))).toEqual([]);
    for (const s of [...algo.keys(), ...AUTHORS.map((a) => a.slug)]) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('모든 알고리즘은 분야·정의·유효한 기원을 가진다', () => {
    for (const a of ALGORITHMS) {
      expect(FIELDS).toContain(a.field);
      expect(a.summary.trim().endsWith('.'), a.slug).toBe(true);
      for (const o of a.origins) {
        expect(o.title.length, a.slug).toBeGreaterThan(0);
        expect(o.venue.length, a.slug).toBeGreaterThan(0);
        expect(Number.isInteger(o.year) && o.year <= 2026, a.slug).toBe(true);
        if (o.id) expect(o.id, a.slug).toMatch(/^(doi:10\.\d{4,9}\/\S+|arxiv:\d{4}\.\d{4,5}|url:https:\/\/\S+)$/);
      }
    }
  });

  it('기원 저자는 모두 등록되어 있고 고아 저자가 없다', () => {
    const used = new Set(ALGORITHMS.flatMap((a) => a.origins.flatMap((o) => o.authors)));
    const known = new Set(AUTHORS.map((a) => a.slug));
    expect([...used].filter((s) => !known.has(s))).toEqual([]);
    expect([...known].filter((s) => !used.has(s))).toEqual([]);
  });

  it('파생 엣지는 근거·신뢰도·유형을 필수로 가진다 (PRD §5)', () => {
    expect(dup(DERIVATIONS.map((e) => e.id))).toEqual([]);
    for (const e of DERIVATIONS) {
      expect(algo.has(e.from), e.id).toBe(true);
      expect(algo.has(e.to), e.id).toBe(true);
      expect(e.from).not.toBe(e.to);
      expect(DERIVATION_TYPES).toContain(e.type);
      expect(EDGE_STATUSES).toContain(e.status);
      expect(e.confidence > 0 && e.confidence <= 1, e.id).toBe(true);
      expect(e.evidence.length, e.id).toBeGreaterThan(0);
      for (const ev of e.evidence) expect(ev.text.length, e.id).toBeGreaterThan(5);
    }
  });

  it('검증 엣지는 신뢰도 0.8 이상, 관련 엣지는 0.6 이하이다', () => {
    for (const e of DERIVATIONS) {
      if (e.status === 'verified') expect(e.confidence, e.id).toBeGreaterThanOrEqual(0.8);
      if (e.status === 'related') expect(e.confidence, e.id).toBeLessThanOrEqual(0.6);
    }
  });

  it('파생은 시간을 거스르지 않는다 (후손 연도 ≥ 조상 연도)', () => {
    for (const e of DERIVATIONS.filter((x) => x.status !== 'related')) {
      if (algo.get(e.from)!.origins.length && algo.get(e.to)!.origins.length) expect(year(e.to), e.id).toBeGreaterThanOrEqual(year(e.from));
    }
  });

  it('파생 그래프(관련 제외)는 사이클이 없다', () => {
    const adj = new Map<string, string[]>();
    for (const e of DERIVATIONS.filter((x) => x.status !== 'related')) adj.set(e.from, [...(adj.get(e.from) ?? []), e.to]);
    const state = new Map<string, number>();
    const visit = (s: string): boolean => {
      if (state.get(s) === 1) return false;
      if (state.get(s) === 2) return true;
      state.set(s, 1);
      const ok = (adj.get(s) ?? []).every(visit);
      state.set(s, 2);
      return ok;
    };
    for (const s of algo.keys()) expect(visit(s), s).toBe(true);
  });

  it('같은 쌍에 중복·역방향 엣지가 없다', () => {
    const pairs = DERIVATIONS.map((e) => [e.from, e.to].sort().join('|'));
    expect(dup(pairs)).toEqual([]);
  });

  it('구현체는 등록된 알고리즘과 owner/repo 형식을 가리킨다', () => {
    for (const i of IMPLEMENTATIONS) {
      expect(algo.has(i.algo), i.algo).toBe(true);
      expect(i.repo).toMatch(/^[\w.-]+\/[\w.-]+$/);
    }
  });
});

describe('source verification', () => {
  it('every DOI and arXiv identifier has been checked against a bibliographic index', async () => {
    const checks = (await import('@/data/source-checks.json')).default as Record<string, { status: string }>;
    const ids = new Set(ALGORITHMS.flatMap((a) => a.origins.map((o) => o.id)).filter((id) => id && !id.startsWith("url:")) as string[]);
    expect([...ids].filter((id) => checks[id]?.status !== 'ok')).toEqual([]);
  });
});
