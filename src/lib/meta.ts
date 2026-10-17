import type { Metadata } from 'next';
import { LOCALES, OG_LOCALE, type Locale } from '@/i18n/config';

/** 로케일별 canonical·hreflang. path는 로케일 접두사 없이 ('' | '/algorithms/x'). */
export const pageMeta = (locale: Locale, path: string, title?: string, description?: string): Metadata => ({
  ...(title && { title }),
  ...(description && { description }),
  alternates: {
    canonical: `/${locale}${path}`,
    languages: { ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])), 'x-default': `/ko${path}` },
  },
  openGraph: { ...(title && { title }), ...(description && { description }), locale: OG_LOCALE[locale], siteName: 'CISS', type: 'website', url: `/${locale}${path}` },
});
