import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALGORITHMS } from '@/data/algorithms';
import { content, formatYear, getT } from '@/i18n';
import { contentCatalog } from '@/i18n/catalog';
import { LOCALES, negotiate } from '@/i18n/config';
import en from '@/i18n/content/en.json';
import ja from '@/i18n/content/ja.json';
import zh from '@/i18n/content/zh.json';
import mEn from '@/i18n/messages/en.json';
import mJa from '@/i18n/messages/ja.json';
import ko from '@/i18n/messages/ko.json';
import mZh from '@/i18n/messages/zh.json';

const HANGUL = /[가-힣]/;
const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

describe('UI messages', () => {
  const others = { en: mEn, ja: mJa, zh: mZh } as Record<string, Record<string, string>>;
  it.each(Object.keys(others))('%s has exactly the Korean keys with the same placeholders', (l) => {
    expect(Object.keys(others[l]).sort()).toEqual(Object.keys(ko).sort());
    for (const [k, v] of Object.entries(ko)) expect(vars(others[l][k]), `${l}:${k}`).toBe(vars(v));
  });
  it.each(Object.keys(others))('%s contains no untranslated Korean', (l) => {
    expect(Object.entries(others[l]).filter(([, v]) => HANGUL.test(v)).map(([k]) => k)).toEqual([]);
  });
  it('every literal key used in source exists', () => {
    const src = walk('src').filter((f) => /\.tsx?$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
    const used = [...src.matchAll(/\bt\(\s*'([\w.-]+)'/g)].map((m) => m[1]);
    expect(used.filter((k) => !(k in ko))).toEqual([]);
  });
});

describe('content translations', () => {
  const cat = contentCatalog();
  it('ja/zh cover every catalog key, en every non-name key', () => {
    for (const k of Object.keys(cat)) {
      expect(ja, k).toHaveProperty([k]);
      expect(zh, k).toHaveProperty([k]);
      if (!k.endsWith('.local')) expect(en, k).toHaveProperty([k]);
    }
  });
  it('translations contain no Korean and no stale keys', () => {
    for (const t of [en, ja, zh] as Record<string, string>[]) {
      expect(Object.entries(t).filter(([, v]) => HANGUL.test(v)).map(([k]) => k)).toEqual([]);
      expect(Object.keys(t).filter((k) => !(k in cat))).toEqual([]);
    }
  });
  it('content accessor falls back to Korean source only for ko', () => {
    const qs = ALGORITHMS.find((a) => a.slug === 'quicksort')!;
    expect(content('ko').summary(qs)).toBe(qs.summary);
    expect(HANGUL.test(content('en').summary(qs))).toBe(false);
    expect(content('en').local(qs)).toBeUndefined();
    expect(content('ja').local(qs)).toBeTruthy();
  });
});

describe('locale helpers', () => {
  it('negotiates Accept-Language by q value', () => {
    expect(negotiate('ja-JP,ja;q=0.9,en;q=0.8')).toBe('ja');
    expect(negotiate('fr-FR,zh-CN;q=0.7,en;q=0.5')).toBe('zh');
    expect(negotiate('en;q=0.4,ko;q=0.9')).toBe('ko');
    expect(negotiate('de')).toBe('ko');
    expect(negotiate(null)).toBe('ko');
  });
  it('formats BCE years per locale', () => {
    expect(LOCALES.map((l) => formatYear(getT(l), -300))).toEqual(['기원전 300년', '300 BCE', '紀元前300年', '公元前300年']);
  });
});
