import type { Registry } from './registry';

/** shields 스타일 2단 배지. 폭은 Verdana 11px 근사 폭으로 계산. */
const charW = (c: string) => {
  const code = c.codePointAt(0)!;
  if (code > 0x2e80) return 11;
  if ('ijlI.,:;|!\'`'.includes(c)) return 3.2;
  if ('mwMW@'.includes(c)) return 9.6;
  if (c === ' ') return 3.6;
  return /[A-Z0-9]/.test(c) ? 7.4 : 6.3;
};
export const textWidth = (s: string) => [...s].reduce((w, c) => w + charW(c), 0);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function badgeSvg(label: string, value: string, color = '#177245') {
  const lw = Math.round(textWidth(label) + 14);
  const vw = Math.round(textWidth(value) + 14);
  const w = lw + vw;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${esc(`${label}: ${value}`)}"><title>${esc(`${label}: ${value}`)}</title>`
    + `<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>`
    + `<clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)">`
    + `<rect width="${lw}" height="20" fill="#16213a"/><rect x="${lw}" width="${vw}" height="20" fill="${color}"/><rect width="${w}" height="20" fill="url(#s)"/></g>`
    + `<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">`
    + `<text x="${lw / 2}" y="14">${esc(label)}</text><text x="${lw + vw / 2}" y="14">${esc(value)}</text></g></svg>`;
}

/** 알고리즘·기여자 배지. 대상이 없으면 null. */
export function badgeFor(r: Registry, kind: string, slug: string): string | null {
  if (kind === 'algorithm' && r.algo.has(slug)) {
    const a = r.algo.get(slug)!;
    const first = a.origins[0];
    const who = first?.authors.length ? `${r.author.get(first.authors[0])!.name.split(' ').pop()}${first.authors.length > 1 ? ' et al.' : ''} ` : '';
    const y = r.yearOf(slug);
    return badgeSvg('CISS credited', `${a.name} — ${who}${y == null ? '' : y < 0 ? `${-y} BCE` : y}`.trim());
  }
  if (kind === 'author' && r.authorCredit.has(slug)) {
    const ac = r.authorCredit.get(slug)!;
    return badgeSvg('CISS credit', `${ac.author.name} · ${ac.score}`, '#1d3fc4');
  }
  return null;
}
