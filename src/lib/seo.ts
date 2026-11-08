import type { T } from '@/i18n';
import { HTML_LANG, type Locale } from '@/i18n/config';

export const FULL_NAME = 'Code Information Sharing Service';
export const PUBLISHER = { '@type': 'Organization', name: 'Team PJ', url: 'https://team-pj-lab.github.io/' } as const;

/** 홈 페이지용 schema.org WebSite. 검색 결과의 사이트 이름을 'CISS'로 알린다. */
export const websiteLd = (siteUrl: string, locale: Locale, t: T) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CISS',
  alternateName: [FULL_NAME, t('meta.title')],
  url: `${siteUrl.replace(/\/$/, '')}/${locale}/`,
  inLanguage: HTML_LANG[locale],
  description: t('meta.description'),
  publisher: PUBLISHER,
});

/** <script type="application/ld+json"> 본문. '<'를 이스케이프해 스크립트 탈출을 막는다. */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
