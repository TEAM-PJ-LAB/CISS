/** 언어 메뉴 순서. 영어가 기본이라 맨 앞. */
export const LOCALES = ['en', 'ko', 'ja', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
/** 글로벌 기본 언어. 언어 메뉴에서 직접 고른 언어(쿠키)가 없으면 브라우저 언어와 상관없이 이 언어로 연다. x-default도 이 언어. */
export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'ciss-locale';
export const LOCALE_NAME: Record<Locale, string> = { ko: '한국어', en: 'English', ja: '日本語', zh: '简体中文' };
export const HTML_LANG: Record<Locale, string> = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-Hans' };
export const OG_LOCALE: Record<Locale, string> = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP', zh: 'zh_CN' };
export const isLocale = (x: unknown): x is Locale => LOCALES.includes(x as Locale);

/** Accept-Language → 지원 로케일 (q값 우선순위). */
export function negotiate(header: string | null | undefined): Locale {
  const prefs = (header ?? '').split(',').map((part) => {
    const [tag, ...params] = part.trim().toLowerCase().split(';');
    const q = Number(params.find((p) => p.trim().startsWith('q='))?.split('=')[1] ?? 1);
    return { base: tag.split('-')[0], q: Number.isFinite(q) ? q : 0 };
  }).filter((p) => p.base && p.q > 0).sort((a, b) => b.q - a.q);
  return (prefs.find((p) => isLocale(p.base))?.base as Locale | undefined) ?? DEFAULT_LOCALE;
}
