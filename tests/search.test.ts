import { describe, expect, it } from 'vitest';
import { registry } from '@/lib/registry';
import { norm, search } from '@/lib/search';

const r = registry();
const top = (q: string) => search(r, q)[0];

describe('search', () => {
  it('정규화는 공백·하이픈·대소문자를 무시한다', () => {
    expect(norm('Knuth–Morris-Pratt')).toBe(norm('knuth morris pratt'));
  });
  it('영문명, 한글명, 별칭으로 알고리즘을 찾는다', () => {
    expect(top('quicksort')).toMatchObject({ kind: 'algorithm', slug: 'quicksort' });
    expect(top('퀵 정렬')).toMatchObject({ kind: 'algorithm', slug: 'quicksort' });
    expect(top('BIT')).toMatchObject({ slug: 'fenwick-tree' });
  });
  it('저자명으로 저자와 그 알고리즘을 찾는다', () => {
    const hits = search(r, 'Hoare');
    expect(hits.some((h) => h.kind === 'author' && h.slug === 'hoare')).toBe(true);
    expect(hits.some((h) => h.kind === 'algorithm' && h.slug === 'quicksort')).toBe(true);
  });
  it('분야명으로 해당 분야 알고리즘을 찾는다', () => {
    expect(search(r, '압축', 100).filter((h) => h.kind === 'algorithm').length).toBeGreaterThan(10);
  });
  it('빈 질의는 빈 결과를 낸다', () => {
    expect(search(r, '  ')).toEqual([]);
  });
});
