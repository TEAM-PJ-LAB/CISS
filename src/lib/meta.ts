import type { Metadata } from 'next';
import { LOCALES, OG_LOCALE, type Locale } from '@/i18n/config';
import { BASE_PATH } from './runtime';

/** 로케일별 canonical·hreflang. path는 로케일 접두사 없이 ('' | '/algorithms/x'). */
export const pageMeta = (locale: Locale, path: string, title?: string, description?: string): Metadata => {
  const u = (l: string) => `${BASE_PATH}/${l}${path}`;
  return {
  ...(title && { title }),
  ...(description && { description }),
  alternates: {
    canonical: u(locale),
    languages: { ...Object.fromEntries(LOCALES.map((l) => [l, u(l)])), 'x-default': u('ko') },
  },
  openGraph: { ...(title && { title }), ...(description && { description }), locale: OG_LOCALE[locale], siteName: 'CISS', type: 'website', url: u(locale) },
  };
};
