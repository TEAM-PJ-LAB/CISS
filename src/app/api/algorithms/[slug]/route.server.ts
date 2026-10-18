import { algorithmPayload, json } from '@/lib/api';
import { registry } from '@/lib/registry';

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const body = algorithmPayload(registry(), (await params).slug);
  return body ? json(body) : json({ error: 'not_found' }, { status: 404 });
}
