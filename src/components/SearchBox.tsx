'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { useI18n } from '@/i18n/client';
import type { Hit } from '@/lib/search';

export default function SearchBox({ initial = '', size = 'md' }: { initial?: string; size?: 'md' | 'lg' }) {
  const router = useRouter();
  const { t, href, locale } = useI18n();
  const id = useId();
  const [q, setQ] = useState(initial);
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(-1);
  const ctl = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!q.trim()) { setHits([]); return; }
    const timer = setTimeout(async () => {
      ctl.current?.abort();
      ctl.current = new AbortController();
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8&locale=${locale}`, { signal: ctl.current.signal });
        if (res.ok) { setHits((await res.json()).hits); setSel(-1); }
      } catch { /* superseded */ }
    }, 120);
    return () => clearTimeout(timer);
  }, [q, locale]);

  const to = (h: Hit) => href(`/${h.kind === 'author' ? 'authors' : 'algorithms'}/${h.slug}`);
  const go = (path: string) => { setOpen(false); router.push(path); };

  return (
    <form role="search" className={`search ${size}`} onSubmit={(e) => { e.preventDefault(); if (q.trim()) go(sel >= 0 ? to(hits[sel]) : href(`/search?q=${encodeURIComponent(q)}`)); }}>
      <label htmlFor={id} className="sr">{t('search.label')}</label>
      <svg className="sicon" width="18" height="18" viewBox="0 0 18 18" aria-hidden><circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m12 12 4.5 4.5" stroke="currentColor" strokeWidth="1.5" /></svg>
      <input
        id={id} className="input" type="search" value={q} autoComplete="off" spellCheck={false}
        placeholder={t('search.placeholder')}
        role="combobox" aria-autocomplete="list" aria-expanded={open && hits.length > 0} aria-controls={`${id}-list`}
        aria-activedescendant={sel >= 0 ? `${id}-${sel}` : undefined}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, -1)); }
          else if (e.key === 'Escape') setOpen(false);
        }}
      />
      <kbd className="kbd" aria-hidden>↵</kbd>
      {open && hits.length > 0 && (
        <ul className="sugg" id={`${id}-list`} role="listbox">
          {hits.map((h, i) => (
            <li key={`${h.kind}-${h.slug}`} id={`${id}-${i}`} role="option" aria-selected={i === sel}>
              <a href={to(h)} onMouseDown={(e) => { e.preventDefault(); go(to(h)); }}>
                <span className={h.kind === 'algorithm' ? 'aname' : undefined}>{h.label}</span>
                <small>{h.kind === 'author' ? `${t('search.contributor')} — ` : ''}{h.sub}</small>
              </a>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
