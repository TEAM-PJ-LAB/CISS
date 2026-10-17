/** 프로세스 내 토큰 버킷. 단일 인스턴스 배포 기준 — 다중 인스턴스는 공유 저장소로 교체할 것. */
const buckets = new Map<string, { tokens: number; at: number }>();

export function rateLimit(key: string, capacity: number, perMinute: number, now = Date.now()) {
  const b = buckets.get(key) ?? { tokens: capacity, at: now };
  b.tokens = Math.min(capacity, b.tokens + ((now - b.at) / 60_000) * perMinute);
  b.at = now;
  const ok = b.tokens >= 1;
  if (ok) b.tokens -= 1;
  buckets.set(key, b);
  if (buckets.size > 10_000) for (const [k, v] of buckets) if (now - v.at > 600_000) buckets.delete(k);
  return { ok, retryAfter: ok ? 0 : Math.ceil(((1 - b.tokens) / perMinute) * 60) };
}

export const clientKey = (req: Request) =>
  req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
