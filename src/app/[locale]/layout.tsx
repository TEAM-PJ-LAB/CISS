import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import { getT, messages } from '@/i18n';
import { I18nProvider } from '@/i18n/client';
import { HTML_LANG, isLocale, LOCALES, type Locale } from '@/i18n/config';
import { lp } from '@/i18n/format';
import { pageMeta } from '@/lib/meta';
import { registry } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';
import '../globals.css';

const FONTS: Record<Locale, string> = {
  ko: 'family=IBM+Plex+Sans+KR:wght@400;500;600&family=Noto+Serif+KR:wght@500;600;700',
  en: 'family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700',
  ja: 'family=IBM+Plex+Sans+JP:wght@400;500;600&family=Noto+Serif+JP:wght@500;600;700',
  zh: 'family=Noto+Sans+SC:wght@400;500;600&family=Noto+Serif+SC:wght@500;600;700',
};

const THEME_INIT = `try{var t=localStorage.getItem('ciss-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getT(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('meta.title'), template: '%s — CISS' },
    description: t('meta.description'),
    ...pageMeta(locale, ''),
  };
}

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#eceff4' }, { media: '(prefers-color-scheme: dark)', color: '#0a1022' }],
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getT(locale);
  const s = registry().stats();
  const href = (p: string) => lp(locale, p);
  return (
    <html lang={HTML_LANG[locale]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?${FONTS[locale]}&display=swap`} />
      </head>
      <body>
        <I18nProvider locale={locale} messages={messages(locale)}>
          <a className="skip" href="#main">{t('a11y.skip')}</a>
          <Header />
          <main id="main">{children}</main>
          <footer className="foot">
            <div className="wrap foot-grid">
              <div>
                <p className="foot-brand">CISS</p>
                <p>{t('footer.stats', { a: s.algorithms, b: s.authors, c: s.derivations, p: Math.round(s.verifiedRatio * 100) })}</p>
                <p className="muted">{t('footer.disclaimer')}</p>
              </div>
              <ul>
                <li><Link href={href('/about')}>{t('nav.about')}</Link></li>
                <li><Link href={href('/developers')}>{t('nav.developers')}</Link></li>
                <li><Link href={href('/claims')}>{t('nav.claims')}</Link></li>
                <li><a href="https://github.com/TEAM-PJ-LAB/CISS">GitHub</a></li>
              </ul>
            </div>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}
