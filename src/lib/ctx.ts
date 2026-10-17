import { content, getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { lp } from '@/i18n/format';
import { registry } from './registry';

/** 서버 컴포넌트용 렌더 컨텍스트. */
export const ctx = (locale: Locale) => ({
  locale, r: registry(), t: getT(locale), c: content(locale), href: (p: string) => lp(locale, p),
});
export type Ctx = ReturnType<typeof ctx>;
export const pct = (x: number) => `${Math.round(x * 100)}%`;
