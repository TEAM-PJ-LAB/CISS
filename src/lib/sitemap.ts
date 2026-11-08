import type { Locale } from '@/i18n/config';
import type { Registry } from './registry';

/** 색인 대상 경로(로케일 접두사 없이). 검색 결과 페이지는 noindex라 뺀다. */
export const SECTIONS = ['', '/algorithms', '/graph', '/authors', '/rankings', '/scan', '/claims', '/about', '/developers'] as const;

export const sitemapPaths = (r: Registry): string[] => [
  ...SECTIONS,
  ...r.algorithms.map((a) => `/algorithms/${a.slug}`),
  ...[...r.authorCredit.keys()].map((s) => `/authors/${s}`),
];

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** 페이지의 canonical·hreflang과 같은 URL(끝 슬래시 포함)로 sitemap을 만든다. x-default는 ko. */
export const sitemapXml = (siteUrl: string, paths: string[], locales: readonly Locale[]): string => {
  const u = (l: string, p: string) => esc(`${siteUrl.replace(/\/$/, '')}/${l}${p}/`);
  const rows = paths.flatMap((p) => {
    const alt = [...locales.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${u(l, p)}"/>`),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${u('ko', p)}"/>`].join('');
    return locales.map((l) => `<url><loc>${u(l, p)}</loc>${alt}</url>`);
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join('\n')}\n</urlset>\n`;
};
