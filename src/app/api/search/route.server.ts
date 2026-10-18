import { isLocale } from '@/i18n/config';
import { registry } from '@/lib/registry';
import { search } from '@/lib/search';

export function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const q = (p.get('q') ?? '').slice(0, 100);
  const limit = Math.min(Math.max(Number(p.get('limit')) || 20, 1), 50);
  const locale = p.get('locale');
  return Response.json({ query: q, hits: search(registry(), q, limit, isLocale(locale) ? locale : 'ko') }, { headers: { 'Cache-Control': 'public, max-age=300' } });
}
