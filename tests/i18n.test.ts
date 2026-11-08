import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALGORITHMS } from '@/data/algorithms';
import { content, formatYear, getT, isClientKey } from '@/i18n';
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
  it('client components only use keys shipped to the client', () => {
    const client = walk('src').filter((f) => /\.tsx?$/.test(f)).map((f) => readFileSync(f, 'utf8')).filter((s) => s.startsWith("'use client'")).join('\n');
    const literal = [...client.matchAll(/'([a-z][a-zA-Z]*\.[a-zA-Z][\w.]*)'/g)].map((m) => m[1]).filter((k) => k in ko);
    const prefixes = [...client.matchAll(/t\(`([\w.]+)\$\{/g)].map((m) => m[1]);
    expect(literal.length).toBeGreaterThan(50);
    expect([...literal, ...prefixes].filter((k) => !isClientKey(k))).toEqual([]);
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
    expect(negotiate('de')).toBe('en');
    expect(negotiate(null)).toBe('en');
  });
  it('formats BCE years per locale', () => {
    expect(Object.fromEntries(LOCALES.map((l) => [l, formatYear(getT(l), -300)]))).toEqual({ ko: '기원전 300년', en: '300 BCE', ja: '紀元前300年', zh: '公元前300年' });
  });
});

describe('page-scoped client messages', () => {
  it('keeps page-only namespaces out of the shared layout dictionary', async () => {
    const { clientMessages, pageMessages, PAGE_NS } = await import('@/i18n');
    const base = Object.keys(clientMessages('en'));
    expect(base.some((k) => PAGE_NS.some((n) => k.startsWith(`${n}.`)))).toBe(false);
    expect(Object.keys(pageMessages('en', ['scan'])).length).toBeGreaterThan(10);
  });
  it('components that use page-only namespaces are mounted only under I18nExtend', () => {
    const uses = (f: string) => /t\(\s*['`](admin|claimForm|scan)\./.test(readFileSync(f, 'utf8'));
    const files = walk('src/components').filter((f) => f.endsWith('.tsx'));
    const name = (f: string) => f.split('/').pop()!.replace('.tsx', '');
    const comps = files.filter(uses).map(name);
    for (let grew = true; grew;) { // 그 컴포넌트를 렌더하는 컴포넌트도 포함
      const more = files.filter((f) => !comps.includes(name(f)) && comps.some((c) => new RegExp(`import ${c}\\b`).test(readFileSync(f, 'utf8')))).map(name);
      comps.push(...more); grew = more.length > 0;
    }
    expect(comps).toContain('ClaimsBoard');
    const pages = walk('src/app').filter((f) => f.endsWith('page.tsx')).map((f) => readFileSync(f, 'utf8'));
    for (const c of comps) {
      for (const p of pages.filter((s) => new RegExp(`import ${c}\\b`).test(s))) expect(p, c).toContain('I18nExtend');
    }
    expect(comps.length).toBeGreaterThan(0);
  });
});
