import { json } from '@/lib/api';
import { registry } from '@/lib/registry';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const r = registry();
  const slug = (await params).slug;
  const ac = r.authorCredit.get(slug);
  if (!ac) return json({ error: 'not_found' }, { status: 404 });
  return json({ slug, name: ac.author.name, org: Boolean(ac.author.org), rank: r.rankOf.get(slug), score: ac.score, byField: ac.byField, algorithms: ac.algorithms });
}
