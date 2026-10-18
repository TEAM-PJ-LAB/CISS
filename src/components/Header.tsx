'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/client';
import { withBase } from '@/lib/runtime';
import { LOCALE_COOKIE, LOCALE_NAME, LOCALES, type Locale } from '@/i18n/config';
import type { MsgKey } from '@/i18n';

const NAV: [string, MsgKey][] = [
  ['/algorithms', 'nav.algorithms'],
  ['/graph', 'nav.graph'],
  ['/authors', 'nav.authors'],
  ['/rankings', 'nav.rankings'],
  ['/scan', 'nav.scan'],
  ['/claims', 'nav.claims'],
  ['/about', 'nav.about'],
];

type Theme = 'system' | 'light' | 'dark';
const THEME_KEY = 'ciss-theme';

export function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="mark">
      <path d="M11 3v6M11 9 5 15M11 9l6 6M5 15v3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="11" cy="3" r="2.2" fill="currentColor" />
      <circle cx="5" cy="15" r="2.2" fill="var(--paper)" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="15" r="2.2" fill="var(--paper)" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="5" cy="19.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>('system');
  useEffect(() => { try { setTheme((localStorage.getItem(THEME_KEY) as Theme) || 'system'); } catch { /* blocked */ } }, []);
  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
  const apply = (v: Theme) => {
    setTheme(v);
    if (v === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = v;
    try { if (v === 'system') localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY, v); } catch { /* blocked */ }
  };
  return (
    <button type="button" className="iconbtn" onClick={() => apply(next[theme])} aria-label={t('theme.toggle', { mode: t(`theme.${theme}`) })} title={t(`theme.${theme}`)}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        {theme === 'dark' ? <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5Z" fill="currentColor" />
          : theme === 'light' ? <><circle cx="8" cy="8" r="3" fill="currentColor" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M3 13l1.4-1.4M11.6 4.4 13 3" stroke="currentColor" strokeWidth="1.3" /></>
            : <><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M8 2a6 6 0 0 1 0 12Z" fill="currentColor" /></>}
      </svg>
    </button>
  );
}

function LangSwitch() {
  const { locale, t } = useI18n();
  const path = usePathname();
  const rest = path.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  const pick = (l: Locale) => { document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`; };
  return (
    <details className="lang">
      <summary aria-label={t('lang.label')}>{LOCALE_NAME[locale]}</summary>
      <ul>
        {LOCALES.map((l) => (
          <li key={l}><a href={withBase(`/${l}${rest}`)} hrefLang={l} lang={l} aria-current={l === locale} onClick={() => pick(l)}>{LOCALE_NAME[l]}</a></li>
        ))}
      </ul>
    </details>
  );
}

export default function Header() {
  const { t, href } = useI18n();
  const path = usePathname();
  return (
    <header className="top">
      <div className="wrap">
        <Link href={href('')} className="brand"><Mark /><span>CISS</span><small>{t('brand.tagline')}</small></Link>
        <nav className="nav" aria-label={t('nav.label')}>
          {NAV.map(([p, k]) => <Link key={p} href={href(p)} aria-current={path.startsWith(href(p)) ? 'page' : undefined}>{t(k)}</Link>)}
        </nav>
        <div className="tools"><LangSwitch /><ThemeToggle /></div>
      </div>
    </header>
  );
}
