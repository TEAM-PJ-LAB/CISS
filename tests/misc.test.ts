import { describe, expect, it } from 'vitest';
import { badgeSvg, textWidth } from '@/lib/badge';
import { rateLimit } from '@/lib/rate-limit';

describe('badge', () => {
  it('renders a sized, escaped SVG', () => {
    const svg = badgeSvg('CISS credited', 'A<B & "C"');
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('A&lt;B &amp; &quot;C&quot;');
    expect(svg).not.toContain('A<B');
    expect(Number(svg.match(/width="(\d+)"/)![1])).toBeGreaterThan(textWidth('CISS credited'));
  });
  it('measures CJK wider than Latin', () => expect(textWidth('퀵정렬')).toBeGreaterThan(textWidth('abc')));
});

describe('rate limit', () => {
  it('allows a burst up to capacity then refills over time', () => {
    const t0 = 1_000_000;
    const key = `k${Math.random()}`;
    expect([1, 2, 3].map(() => rateLimit(key, 3, 6, t0).ok)).toEqual([true, true, true]);
    const blocked = rateLimit(key, 3, 6, t0);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(rateLimit(key, 3, 6, t0 + 10_000).ok).toBe(true);
  });
});
