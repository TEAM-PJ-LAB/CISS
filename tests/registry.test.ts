import { describe, expect, it } from 'vitest';
import { d, field, o } from '@/data/dsl';
import { buildRegistry, edgeWeight, registry, SCORE } from '@/lib/registry';

const a = field('sorting');
const fixture = () => buildRegistry(
  [
    a('root', 'Root', '루트.', [o('alice', 1950, 'R', 'V')]),
    a('child', 'Child', '자식.', [o('bob,carol', 1960, 'C', 'V')]),
    a('grand', 'Grand', '손자.', [o('dave', 1970, 'G', 'V'), o('erin', 1971, 'G2', 'V')]),
    a('cousin', 'Cousin', '관련.', [o('frank', 1980, 'X', 'V')]),
  ],
  ['alice', 'bob', 'carol', 'dave', 'erin', 'frank'].map((slug) => ({ slug, name: slug.toUpperCase() })),
  [
    d('root>child', 'var', 'v', 0.9, 'a', '검증 근거 텍스트'),
    d('child>grand', 'opt', 'e', 0.6, 's', '추정 근거 텍스트'),
    d('root>cousin', 'var', 'r', 0.4, 't', '관련 근거 텍스트'),
  ],
  [{ algo: 'grand', repo: 'x/y', lang: 'C' }],
);

describe('credit score v1', () => {
  it('엣지 가중치: 검증 1, 추정 0.5·신뢰도, 관련 0', () => {
    const r = fixture();
    expect(r.derivations.map(edgeWeight)).toEqual([1, SCORE.ESTIMATED * 0.6, 0]);
  });

  it('직접·간접 파생과 구현체 수를 집계하고 관련 엣지는 제외한다', () => {
    const r = fixture();
    expect(r.credit.get('root')).toMatchObject({ direct: 1, descendants: 2, implementations: 0 });
    // 10 + 5·1 + 2·(1 · 0.3 · 0.5)
    expect(r.credit.get('root')!.score).toBe(15.3);
    // 10 + 5·0.3
    expect(r.credit.get('child')!.score).toBe(11.5);
    expect(r.credit.get('grand')!.score).toBe(11);
    expect(r.credit.get('cousin')!.score).toBe(10);
  });

  it('공동 저자는 균등 분배, 복수 기원은 기원별로 균등 분배한다', () => {
    const r = fixture();
    expect(r.authorCredit.get('bob')!.score).toBe(5.8);
    expect(r.authorCredit.get('dave')!.score).toBe(5.5);
    expect(r.authorCredit.get('erin')!.algorithms[0].share).toBe(0.5);
  });

  it('랭킹은 점수 내림차순이며 분야별 랭킹을 지원한다', () => {
    const r = fixture();
    expect(r.ranking().map((x) => x.author.slug)[0]).toBe('alice');
    expect(r.ranking('sorting').length).toBe(6);
    expect(r.ranking('graph')).toEqual([]);
    expect(r.rankOf.get('alice')).toBe(1);
  });

  it('계보 뷰는 상·하위 계보와 인접 관련 엣지를 포함한다', () => {
    const r = fixture();
    const g = r.lineage('child');
    expect(g.nodes.map((n) => n.slug).sort()).toEqual(['child', 'grand', 'root']);
    expect(r.lineage('root').edges.map((e) => e.id)).toContain('root>cousin');
  });
});

describe('seed registry', () => {
  const r = registry();
  it('통계가 일관된다', () => {
    const s = r.stats();
    expect(s.algorithms).toBe(r.algorithms.length);
    expect(s.verified).toBeLessThanOrEqual(s.derivations);
    expect(s.multiOrigin).toBeGreaterThan(10);
  });
  it('모든 알고리즘의 점수는 최소 기원 점수 이상이다', () => {
    for (const a of r.algorithms) expect(r.credit.get(a.slug)!.score).toBeGreaterThanOrEqual(SCORE.ORIGIN);
  });
  it('저자 점수 합은 기원이 있는 알고리즘 점수 합과 같다', () => {
    const algos = r.algorithms.filter((a) => a.origins.every((o) => o.authors.length)).reduce((s, a) => s + r.credit.get(a.slug)!.score, 0);
    const authors = [...r.authorCredit.values()].reduce((s, x) => s + x.score, 0);
    expect(Math.abs(algos - authors)).toBeLessThan(r.authorCredit.size * 0.05 + 1);
  });
});
