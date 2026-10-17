import { json } from '@/lib/api';
import { registry } from '@/lib/registry';

export function GET() {
  const r = registry();
  return json({
    nodes: r.algorithms.map((a) => ({ id: a.slug, name: a.name, field: a.field, year: r.yearOf(a.slug), score: r.credit.get(a.slug)!.score })),
    edges: r.derivations,
  });
}
