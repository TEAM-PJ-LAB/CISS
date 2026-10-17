import { json } from '@/lib/api';
import { registry, SCORE } from '@/lib/registry';

const SCHEMA = 'ciss-lineage/1';
const csv = (rows: (string | number | null | undefined)[][]) =>
  rows.map((r) => r.map((v) => (v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))).join(',')).join('\n') + '\n';

/** 전체 계보 데이터셋 덤프 (PRD §6.3). ?format=csv&table=algorithms|origins|derivations|authors|implementations */
export function GET(req: Request) {
  const r = registry();
  const p = new URL(req.url).searchParams;
  if (p.get('format') === 'csv') {
    const table = p.get('table') ?? 'algorithms';
    const tables: Record<string, () => string> = {
      algorithms: () => csv([['slug', 'name', 'name_ko', 'field', 'year', 'summary_ko', 'direct', 'descendants', 'implementations', 'score'],
        ...r.algorithms.map((a) => { const c = r.credit.get(a.slug)!; return [a.slug, a.name, a.ko, a.field, r.yearOf(a.slug), a.summary, c.direct, c.descendants, c.implementations, c.score]; })]),
      origins: () => csv([['algorithm', 'index', 'authors', 'year', 'title', 'venue', 'id', 'note'],
        ...r.algorithms.flatMap((a) => a.origins.map((o, i) => [a.slug, i, o.authors.join(';'), o.year, o.title, o.venue, o.id, o.note]))]),
      derivations: () => csv([['id', 'from', 'to', 'type', 'status', 'confidence', 'evidence_kind', 'evidence_ko', 'evidence_ref'],
        ...r.derivations.map((e) => [e.id, e.from, e.to, e.type, e.status, e.confidence, e.evidence[0].kind, e.evidence[0].text, e.evidence[0].ref])]),
      authors: () => csv([['slug', 'name', 'org', 'score', 'algorithms'],
        ...r.ranking().map((x) => [x.author.slug, x.author.name, x.author.org ? 1 : 0, x.score, x.algorithms.map((y) => y.slug).join(';')])]),
      implementations: () => csv([['algorithm', 'repo', 'path', 'symbol', 'lang'], ...r.implementations.map((i) => [i.algo, i.repo, i.path, i.symbol, i.lang])]),
    };
    if (!tables[table]) return json({ error: 'unknown_table', tables: Object.keys(tables) }, { status: 400 });
    return new Response(tables[table](), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="ciss-${table}.csv"`, 'Cache-Control': 'public, max-age=3600' } });
  }
  return json({
    schema: SCHEMA, generatedAt: new Date().toISOString(), score: SCORE, stats: r.stats(),
    algorithms: r.algorithms, authors: r.authors, derivations: r.derivations, implementations: r.implementations, sourceChecks: r.checks,
  }, { headers: { 'Content-Disposition': 'inline; filename="ciss-dataset.json"' } });
}
