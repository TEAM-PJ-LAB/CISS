/**
 * 시드 DB 출처 검증 (PRD §7 Verification).
 *  - DOI → Crossref, arXiv ID → arXiv API: 등록 제목이 기대 제목과 같은 작업인지 비교
 *  - 구현체 → raw.githubusercontent.com HEAD: 파일 존재와 심볼 포함 여부
 * 결과: src/data/source-checks.json 갱신 (네트워크가 허용된 환경에서 실행).
 *   npm run verify:sources [-- --impl-only | --sources-only]
 */
import { writeFileSync } from 'node:fs';
import { ALGORITHMS } from '../src/data/algorithms/index.ts';
import { IMPLEMENTATIONS } from '../src/data/implementations.ts';
import checks from '../src/data/source-checks.json' with { type: 'json' };

const today = new Date().toISOString().slice(0, 10);
const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const similar = (a: string, b: string) => {
  const x = new Set(norm(a).split(' ')), y = new Set(norm(b).split(' '));
  const inter = [...x].filter((w) => y.has(w)).length;
  return inter / Math.max(1, Math.min(x.size, y.size));
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const UA = { 'User-Agent': 'CISS-verify (https://github.com/TEAM-PJ-LAB/CISS)' };
type Meta = { title: string; year?: number; via: string; authors?: string[] };

/** 등록 메타데이터에 결함이 있어(예: Crossref 제목이 빈 칸) 출판사 페이지로 직접 확인한 항목. 근거를 via에 남긴다. */
const MANUAL: Record<string, Meta> = {
  'doi:10.4086/toc.2012.v008a019': { title: 'Distance Transforms of Sampled Functions', year: 2012, via: 'Theory of Computing article page (Crossref title empty)' },
};

/** DataCite: arXiv(10.48550)·Eurographics(10.2312)·대학 보고서 등 Crossref에 없는 DOI. */
async function datacite(doi: string): Promise<Meta | null> {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(`https://api.datacite.org/dois/${encodeURIComponent(doi)}`, { headers: UA });
    if (res.status === 429 || res.status >= 500) { await sleep(2000 * (i + 1)); continue; }
    if (!res.ok) return null;
    const a = (await res.json()).data?.attributes;
    return a?.titles?.[0]?.title ? { title: a.titles[0].title, year: a.publicationYear ?? undefined, via: 'DataCite',
      authors: (a.creators ?? []).map((c: { familyName?: string; name?: string }) => c.familyName ?? c.name?.split(',')[0] ?? '') } : null;
  }
  return null;
}

async function crossref(doi: string): Promise<Meta | null> {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: UA });
    if (res.status === 429 || res.status >= 500) { await sleep(2000 * (i + 1)); continue; }
    if (res.status === 404) return datacite(doi);
    if (!res.ok) return null;
    const m = (await res.json()).message;
    return { title: [m.title?.[0], m.subtitle?.[0]].filter(Boolean).join(': '), year: m.issued?.['date-parts']?.[0]?.[0] as number | undefined, via: 'Crossref',
      authors: (m.author ?? []).map((x: { family?: string; name?: string }) => x.family ?? x.name ?? '') };
  }
  return null;
}

/** arXiv API는 요청 간 3초 간격을 요구한다. 실패하면 arXiv DOI(DataCite)로 확인한다. */
let lastArxiv = 0;
async function arxiv(id: string): Promise<Meta | null> {
  for (let i = 0; i < 3; i++) {
    await sleep(Math.max(0, lastArxiv + 3100 - Date.now()));
    lastArxiv = Date.now();
    const res = await fetch(`https://export.arxiv.org/api/query?id_list=${id}`, { headers: UA });
    const xml = res.ok ? await res.text() : '';
    const title = xml.match(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim();
    if (title && title !== 'Error') return { title, year: Number(xml.match(/<published>(\d{4})/)?.[1]) || undefined, via: 'arXiv',
      authors: [...(xml.split('</title>')[1] ?? '').matchAll(/<name>([^<]+)<\/name>/g)].map((x) => x[1].trim().split(/\s+/).pop()!) };
  }
  return datacite(`10.48550/arXiv.${id}`);
}

const details: Record<string, unknown> = {};

async function verifySources() {
  const out = { ...(checks as Record<string, unknown>) };
  let bad = 0;
  for (const a of ALGORITHMS) for (const o of a.origins) {
    if (!o.id || o.id.startsWith('url:')) continue;
    const meta = MANUAL[o.id] ?? (o.id.startsWith('doi:') ? await crossref(o.id.slice(4)) : await arxiv(o.id.slice(6)));
    const ok = meta && similar(meta.title, o.title) >= 0.5;
    if (meta) details[o.id] = { title: meta.title, year: meta.year, authors: meta.authors ?? [], ours: { title: o.title, year: o.year, authors: o.authors } };
    out[o.id] = ok ? { status: 'ok', title: meta!.title, ...(meta!.year && { year: meta!.year }), checked: today, via: meta!.via }
      : { status: meta ? 'mismatch' : 'notfound', ...(meta && { title: meta.title }), checked: today, via: 'script' };
    if (!ok) { bad++; console.warn(`✗ ${a.slug} ${o.id} → ${meta?.title ?? 'not found'} (expected "${o.title}")`); }
    await sleep(120);
  }
  /* 저자·연도 대조용 상세(커밋하지 않음): VERIFY_DETAILS=경로 */
  if (process.env.VERIFY_DETAILS) writeFileSync(process.env.VERIFY_DETAILS, JSON.stringify(details));
  writeFileSync('src/data/source-checks.json', `${JSON.stringify(Object.fromEntries(Object.entries(out).sort()), null, 1)}\n`);
  return bad;
}

/** raw.githubusercontent.com은 짧은 시간에 요청이 몰리면 429를 준다. Retry-After(없으면 2·4·8·16초)만큼 기다려 다시 묻는다. */
async function rawFetch(url: string) {
  for (let i = 0; ; i++) {
    const res = await fetch(url, { headers: UA });
    if ((res.status !== 429 && res.status < 500) || i === 4) return res;
    await sleep(1000 * (Number(res.headers.get('retry-after')) || 2 ** (i + 1)));
  }
}

async function verifyImplementations() {
  let bad = 0;
  for (const i of IMPLEMENTATIONS.filter((x) => x.path)) {
    const res = await rawFetch(`https://raw.githubusercontent.com/${i.repo}/HEAD/${i.path}`);
    const ok = res.ok && (!i.symbol || (await res.text()).includes(i.symbol));
    if (!ok) { bad++; console.warn(`✗ ${i.algo} ${i.repo}/${i.path}${i.symbol ? `#${i.symbol}` : ''} (${res.status})`); }
  }
  return bad;
}

const mode = process.argv[2];
const failures = (mode === '--impl-only' ? 0 : await verifySources()) + (mode === '--sources-only' ? 0 : await verifyImplementations());
console.log(failures ? `${failures} problem(s) found` : 'all sources and implementations verified');
process.exit(failures ? 1 : 0);
