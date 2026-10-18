import { SCORE, type Registry } from './registry';

const SCHEMA = 'ciss-lineage/1';
const csv = (rows: (string | number | null | undefined)[][]) =>
  rows.map((r) => r.map((v) => (v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))).join(',')).join('\n') + '\n';

export const CSV_TABLES: Record<string, (r: Registry) => string> = {
  algorithms: (r) => csv([['slug', 'name', 'name_ko', 'field', 'year', 'summary_ko', 'direct', 'descendants', 'implementations', 'score'],
    ...r.algorithms.map((a) => { const c = r.credit.get(a.slug)!; return [a.slug, a.name, a.ko, a.field, r.yearOf(a.slug), a.summary, c.direct, c.descendants, c.implementations, c.score]; })]),
  origins: (r) => csv([['algorithm', 'index', 'authors', 'year', 'title', 'venue', 'id', 'note'],
    ...r.algorithms.flatMap((a) => a.origins.map((o, i) => [a.slug, i, o.authors.join(';'), o.year, o.title, o.venue, o.id, o.note]))]),
  derivations: (r) => csv([['id', 'from', 'to', 'type', 'status', 'confidence', 'evidence_kind', 'evidence_ko', 'evidence_ref'],
    ...r.derivations.map((e) => [e.id, e.from, e.to, e.type, e.status, e.confidence, e.evidence[0].kind, e.evidence[0].text, e.evidence[0].ref])]),
  authors: (r) => csv([['slug', 'name', 'org', 'score', 'algorithms'],
    ...r.ranking().map((x) => [x.author.slug, x.author.name, x.author.org ? 1 : 0, x.score, x.algorithms.map((y) => y.slug).join(';')])]),
  implementations: (r) => csv([['algorithm', 'repo', 'path', 'symbol', 'lang'], ...r.implementations.map((i) => [i.algo, i.repo, i.path, i.symbol, i.lang])]),
};

export const datasetPayload = (r: Registry) => ({
  schema: SCHEMA, generatedAt: new Date().toISOString(), score: SCORE, stats: r.stats(),
  algorithms: r.algorithms, authors: r.authors, derivations: r.derivations, implementations: r.implementations, sourceChecks: r.checks,
});
