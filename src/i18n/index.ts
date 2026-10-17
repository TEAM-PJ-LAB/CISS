import type { Algorithm, Derivation, Origin } from '@/data/types';
import enC from './content/en.json';
import jaC from './content/ja.json';
import zhC from './content/zh.json';
import type { Locale } from './config';
import { interpolate, type Vars } from './format';
import en from './messages/en.json';
import ja from './messages/ja.json';
import ko from './messages/ko.json';
import zh from './messages/zh.json';

export type MsgKey = keyof typeof ko;
export type Messages = Record<MsgKey, string>;
export type T = (key: MsgKey, vars?: Vars) => string;

const MESSAGES: Record<Locale, Messages> = { ko, en, ja, zh };
const CONTENT: Record<Locale, Record<string, string>> = { ko: {}, en: enC, ja: jaC, zh: zhC };
const HANGUL = /[가-힣]/;

export const messages = (locale: Locale): Messages => MESSAGES[locale];

export function getT(locale: Locale): T {
  const m = MESSAGES[locale];
  return (key, vars) => interpolate(m[key] ?? ko[key] ?? key, vars);
}

/** 시드 콘텐츠의 로케일별 표현. 한국어 원문이 정본이며 번역이 없으면 원문을 그대로 쓴다. */
export function content(locale: Locale) {
  const c = CONTENT[locale];
  const tr = (key: string, ko: string) => (locale === 'ko' ? ko : c[key] ?? ko);
  return {
    summary: (a: Algorithm) => tr(`a.${a.slug}.summary`, a.summary),
    local: (a: Algorithm) => (locale === 'en' || !a.ko ? undefined : tr(`a.${a.slug}.local`, a.ko)),
    origin: (a: Algorithm, i: number, o: Origin) => ({
      ...o,
      title: HANGUL.test(o.title) ? tr(`a.${a.slug}.o${i}.title`, o.title) : o.title,
      venue: HANGUL.test(o.venue) ? tr(`a.${a.slug}.o${i}.venue`, o.venue) : o.venue,
      note: o.note && HANGUL.test(o.note) ? tr(`a.${a.slug}.o${i}.note`, o.note) : o.note,
    }),
    evidence: (e: Derivation, i: number) => tr(`e.${e.id}${i ? `.${i}` : ''}`, e.evidence[i].text),
  };
}
export type Content = ReturnType<typeof content>;

export function formatYear(t: T, y: number | null | undefined) {
  return y == null ? t('year.unknown') : y < 0 ? t('year.bce', { n: -y }) : String(y);
}
