import { json } from '@/lib/api';
import { registry } from '@/lib/registry';

export function GET() {
  const r = registry();
  return json({ authors: r.ranking().map((x, i) => ({ rank: i + 1, slug: x.author.slug, name: x.author.name, org: Boolean(x.author.org), score: x.score, byField: x.byField, algorithms: x.algorithms.map((y) => y.slug) })) });
}
