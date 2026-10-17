import { badgeSvg } from '@/lib/badge';
import { registry } from '@/lib/registry';

export async function GET(_: Request, { params }: { params: Promise<{ kind: string; slug: string }> }) {
  const { kind, slug } = await params;
  const r = registry();
  let svg: string;
  if (kind === 'algorithm' && r.algo.has(slug)) {
    const a = r.algo.get(slug)!;
    const first = a.origins[0];
    const who = first?.authors.length ? `${r.author.get(first.authors[0])!.name.split(' ').pop()}${first.authors.length > 1 ? ' et al.' : ''} ` : '';
    const y = r.yearOf(slug);
    svg = badgeSvg('CISS credited', `${a.name} — ${who}${y == null ? '' : y < 0 ? `${-y} BCE` : y}`.trim());
  } else if (kind === 'author' && r.authorCredit.has(slug)) {
    const ac = r.authorCredit.get(slug)!;
    svg = badgeSvg('CISS credit', `${ac.author.name} · ${ac.score}`, '#1d3fc4');
  } else {
    return new Response(badgeSvg('CISS', 'not found', '#9aa3b8'), { status: 404, headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
  }
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400, s-maxage=86400' } });
}
