import { json } from '@/lib/api';
import { CSV_TABLES, datasetPayload } from '@/lib/dataset';
import { registry } from '@/lib/registry';

/** 전체 계보 데이터셋 덤프 (PRD §6.3). ?format=csv&table=algorithms|origins|derivations|authors|implementations */
export function GET(req: Request) {
  const r = registry();
  const p = new URL(req.url).searchParams;
  if (p.get('format') === 'csv') {
    const table = p.get('table') ?? 'algorithms';
    const build = CSV_TABLES[table];
    if (!build) return json({ error: 'unknown_table', tables: Object.keys(CSV_TABLES) }, { status: 400 });
    return new Response(build(r), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="ciss-${table}.csv"`, 'Cache-Control': 'public, max-age=3600' } });
  }
  return json(datasetPayload(r), { headers: { 'Content-Disposition': 'inline; filename="ciss-dataset.json"' } });
}
