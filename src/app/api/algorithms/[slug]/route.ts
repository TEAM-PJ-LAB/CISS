import { apiAlgorithm, json } from '@/lib/api';
import { registry } from '@/lib/registry';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const r = registry();
  const a = r.algo.get((await params).slug);
  if (!a) return json({ error: 'not_found' }, { status: 404 });
  const lin = r.lineage(a.slug);
  return json({ ...apiAlgorithm(r, a, true), lineage: { nodes: lin.nodes.map((n) => n.slug), edges: lin.edges.map((e) => e.id) } });
}
