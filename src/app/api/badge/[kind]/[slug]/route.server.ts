import { badgeFor, badgeSvg } from '@/lib/badge';
import { registry } from '@/lib/registry';

export async function GET(_: Request, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const svg = badgeFor(registry(), kind, slug);
  const type = 'image/svg+xml; charset=utf-8';
  if (!svg) return new Response(badgeSvg('CISS', 'not found', '#9aa3b8'), { status: 404, headers: { 'Content-Type': type } });
  return new Response(svg, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400, s-maxage=86400' } });
}
