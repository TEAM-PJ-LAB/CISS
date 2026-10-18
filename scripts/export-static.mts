/**
 * 정적 배포(GitHub Pages)용 데이터·배지 생성. `next build`(CISS_STATIC=1) 뒤 out/에 쓴다.
 * 서버 모드의 /api/* 응답과 같은 페이로드 빌더를 쓰므로 내용이 일치한다.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getT } from '../src/i18n';
import { HTML_LANG, LOCALES } from '../src/i18n/config';
import { algorithmPayload, algorithmsPayload, authorPayload, authorsPayload, graphPayload } from '../src/lib/api';
import { badgeFor } from '../src/lib/badge';
import { CSV_TABLES, datasetPayload } from '../src/lib/dataset';
import { registry } from '../src/lib/registry';
import { buildSearchIndex } from '../src/lib/search';

const root = process.argv[2] ?? 'out';
const r = registry();
let n = 0;
const put = (path: string, body: string) => {
  const f = join(root, path);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, body);
  n++;
};
const json = (path: string, data: unknown) => put(path, JSON.stringify(data));

for (const l of LOCALES) json(`data/search-${l}.json`, buildSearchIndex(r, l));
json('data/algorithms.json', algorithmsPayload(r));
json('data/authors.json', authorsPayload(r));
json('data/graph.json', graphPayload(r));
json('data/dataset.json', datasetPayload(r));
for (const [t, build] of Object.entries(CSV_TABLES)) put(`data/csv/${t}.csv`, build(r));
for (const a of r.algorithms) {
  json(`data/algorithms/${a.slug}.json`, algorithmPayload(r, a.slug));
  put(`badge/algorithm/${a.slug}.svg`, badgeFor(r, 'algorithm', a.slug)!);
}
for (const slug of r.authorCredit.keys()) {
  json(`data/authors/${slug}.json`, authorPayload(r, slug));
  put(`badge/author/${slug}.svg`, badgeFor(r, 'author', slug)!);
}
put('.nojekyll', '');

/* GitHub Pages는 없는 경로에 /404.html을 준다. Next 런타임 없이 경로의 로케일로 문구를 고르는 자립형 페이지. */
const base = (process.env.BASE_PATH ?? '').replace(/\/$/, '');
const esc = (x: string) => x.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const nf = Object.fromEntries(LOCALES.map((l) => { const t = getT(l); return [l, { lang: HTML_LANG[l], title: t('notFound.title'), body: t('notFound.body'), cta: t('notFound.cta') }]; }));
put('404.html', `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>404 · CISS</title><style>
:root{--paper:#eceff4;--ink:#0f1a33;--muted:#5a6479;--accent:#1d3fc4;--rule:#d5dae4}
@media (prefers-color-scheme:dark){:root{--paper:#0a1022;--ink:#e7ebf3;--muted:#9ba5bc;--accent:#8fa7ff;--rule:#222c46}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--paper);color:var(--ink);font:400 16px/1.7 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:560px;padding:32px 16px}b{font:600 13px/1 ui-monospace,monospace;letter-spacing:.12em;color:var(--muted)}
h1{font:600 clamp(28px,5vw,40px)/1.2 Georgia,"Noto Serif KR",serif;margin:12px 0 8px}p{color:var(--muted);margin:0 0 24px}
a{display:inline-block;padding:10px 18px;border:1px solid var(--rule);border-radius:999px;color:var(--accent);text-decoration:none}a:hover{border-color:var(--accent)}
</style></head><body><main><b>404 · CISS</b><h1 id="t">${esc(nf.ko.title)}</h1><p id="b">${esc(nf.ko.body)}</p><a id="a" href="${base}/ko/algorithms/">${esc(nf.ko.cta)}</a></main>
<script>(function(){var M=${JSON.stringify(nf)},B=${JSON.stringify(base)},p=location.pathname.slice(B.length).split('/')[1],l=M[p]?p:((navigator.language||'').slice(0,2) in M?(navigator.language||'').slice(0,2):'ko'),m=M[l];
document.documentElement.lang=m.lang;document.getElementById('t').textContent=m.title;document.getElementById('b').textContent=m.body;var a=document.getElementById('a');a.textContent=m.cta;a.href=B+'/'+l+'/algorithms/'})()</script></body></html>`);
console.log(`export-static: ${n} files -> ${root}/`);
