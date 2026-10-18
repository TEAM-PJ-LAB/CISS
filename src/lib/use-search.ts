'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { dataPath, STATIC, withBase } from './runtime';
import { searchIndex, type Hit, type SearchIndex } from './search-core';

const indexes = new Map<string, Promise<SearchIndex>>();

/** 정적 빌드: 로케일별 인덱스 JSON을 한 번만 받아 캐시. */
export function loadIndex(locale: Locale) {
  if (!indexes.has(locale)) {
    indexes.set(locale, fetch(withBase(dataPath(`search-${locale}.json`))).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    }));
  }
  return indexes.get(locale)!;
}

/** 서버 모드는 /api/search, 정적 모드는 브라우저 내 인덱스 검색. */
export async function runSearch(q: string, locale: Locale, limit: number, signal?: AbortSignal): Promise<Hit[]> {
  if (STATIC) return searchIndex(await loadIndex(locale), q, limit);
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=${limit}&locale=${locale}`, { signal });
  return res.ok ? (await res.json()).hits : [];
}

export function useSearch(q: string, locale: Locale, limit: number, debounce = 120) {
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!q.trim()) { setHits([]); return; }
    const ctl = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      runSearch(q, locale, limit, ctl.signal).then(setHits).catch(() => { /* superseded */ }).finally(() => setLoading(false));
    }, debounce);
    return () => { clearTimeout(timer); ctl.abort(); };
  }, [q, locale, limit, debounce]);
  return { hits, loading };
}
