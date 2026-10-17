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

async function crossref(doi: string) {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: { 'User-Agent': 'CISS-verify (https://github.com/TEAM-PJ-LAB/CISS)' } });
    if (res.status === 429) { await sleep(2000 * (i + 1)); continue; }
    if (!res.ok) return null;
    const m = (await res.json()).message;
    return { title: [m.title?.[0], m.subtitle?.[0]].filter(Boolean).join(': '), year: m.issued?.['date-parts']?.[0]?.[0] as number | undefined };
  }
  return null;
}

async function arxiv(id: string) {
  const res = await fetch(`https://export.arxiv.org/api/query?id_list=${id}`);
  if (!res.ok) return null;
  const xml = await res.text();
  const title = xml.match(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim();
  const year = Number(xml.match(/<published>(\d{4})/)?.[1]);
  return title ? { title, year } : null;
}

async function verifySources() {
  const out = { ...(checks as Record<string, unknown>) };
  let bad = 0;
  for (const a of ALGORITHMS) for (const o of a.origins) {
    if (!o.id || o.id.startsWith('url:')) continue;
    const meta = o.id.startsWith('doi:') ? await crossref(o.id.slice(4)) : await arxiv(o.id.slice(6));
    const ok = meta && similar(meta.title, o.title) >= 0.5;
    out[o.id] = ok ? { status: 'ok', title: meta!.title, ...(meta!.year && { year: meta!.year }), checked: today, via: o.id.startsWith('doi:') ? 'Crossref' : 'arXiv' }
      : { status: meta ? 'mismatch' : 'notfound', ...(meta && { title: meta.title }), checked: today, via: 'script' };
    if (!ok) { bad++; console.warn(`✗ ${a.slug} ${o.id} → ${meta?.title ?? 'not found'} (expected "${o.title}")`); }
    await sleep(120);
  }
  writeFileSync('src/data/source-checks.json', `${JSON.stringify(Object.fromEntries(Object.entries(out).sort()), null, 1)}\n`);
  return bad;
}

async function verifyImplementations() {
  let bad = 0;
  for (const i of IMPLEMENTATIONS.filter((x) => x.path)) {
    const res = await fetch(`https://raw.githubusercontent.com/${i.repo}/HEAD/${i.path}`);
    const ok = res.ok && (!i.symbol || (await res.text()).includes(i.symbol));
    if (!ok) { bad++; console.warn(`✗ ${i.algo} ${i.repo}/${i.path}${i.symbol ? `#${i.symbol}` : ''} (${res.status})`); }
  }
  return bad;
}

const mode = process.argv[2];
const failures = (mode === '--impl-only' ? 0 : await verifySources()) + (mode === '--sources-only' ? 0 : await verifyImplementations());
console.log(failures ? `${failures} problem(s) found` : 'all sources and implementations verified');
process.exit(failures ? 1 : 0);
