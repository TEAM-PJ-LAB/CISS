export const LOCALES = ['ko', 'en', 'ja', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';
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
