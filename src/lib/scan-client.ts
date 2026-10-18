import type { Locale } from '@/i18n/config';
import { loadIndex } from './use-search';

/** 브라우저 fetch: User-Agent를 지정하면 일부 브라우저가 CORS 사전 요청을 보내므로 제거한다. */
const browserFetch: typeof fetch = (u, init) => {
  const headers = new Headers(init?.headers);
  headers.delete('User-Agent');
  return fetch(u, { ...init, headers });
};

/** 정적 배포: 스캔 엔진을 브라우저에서 실행하고 검색 인덱스로 원작자·점수를 붙인다. */
export async function scanInBrowser(input: string, locale: Locale) {
  const [{ scan }, idx] = await Promise.all([import('./scan'), loadIndex(locale)]);
  const report = await scan(input, { fetch: browserFetch, maxFiles: 120 });
  const by = new Map(idx.entries.filter((e) => e.k === 'a').map((e) => [e.s, e]));
  return {
    ...report, cached: false,
    findings: report.findings.filter((f) => by.has(f.slug)).map((f) => {
      const e = by.get(f.slug)!;
      return { ...f, name: e.l, field: e.f!, year: e.y ?? null, score: e.sc, authors: (e.a ?? []).map((x) => ({ slug: x.s, name: x.n })) };
    }),
  };
}
