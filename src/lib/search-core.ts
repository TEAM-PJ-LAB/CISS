/** 검색 코어 — 서버(/api/search)와 정적 빌드(브라우저)가 같은 채점 규칙을 쓴다. */
export const norm = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[\s\-–—_.'’()*·/、・]+/g, '');

export type Hit = { kind: 'algorithm' | 'author'; slug: string; label: string; sub: string; score: number };

/** k: a=알고리즘, p=기여자 · n: 이름들(앞의 top개는 대표명) · au: 저자명 · sm: 정의 · a: 저자(slug,name) */
export interface IndexEntry {
  k: 'a' | 'p'; s: string; l: string; n: string[]; top: number; sub: string; sc: number;
  f?: string; y?: number | null; au?: string[]; sm?: string; a?: { s: string; n: string }[];
}
export interface SearchIndex { fields: Record<string, string[]>; entries: IndexEntry[] }

const scoreText = (q: string, text: string, base: number) => {
  const t = norm(text);
  if (!t || !q) return 0;
  if (t === q) return base;
  if (t.startsWith(q)) return base * 0.7;
  if (t.includes(q)) return base * 0.5;
  return 0;
};

export function searchIndex(idx: SearchIndex, query: string, limit = 30): Hit[] {
  const q = norm(query);
  if (!q) return [];
  const field = Object.entries(idx.fields).find(([f, names]) => f === q || names.includes(q))?.[0];
  const hits: Hit[] = [];
  for (const e of idx.entries) {
    let s: number;
    if (e.k === 'a') {
      s = Math.max(0, ...e.n.map((n, i) => scoreText(q, n, i < e.top ? 100 : 80)));
      s = Math.max(s, ...(e.au ?? []).map((n) => scoreText(q, n, 50)), scoreText(q, e.sm ?? '', 20));
      if (field && e.f === field) s = Math.max(s, 40);
    } else {
      s = scoreText(q, e.l, 90) || scoreText(q, e.s, 70);
    }
    if (s > 0) hits.push({ kind: e.k === 'a' ? 'algorithm' : 'author', slug: e.s, label: e.l, sub: e.sub, score: s + e.sc / 1000 });
  }
  return hits.sort((x, y) => y.score - x.score).slice(0, limit);
}
