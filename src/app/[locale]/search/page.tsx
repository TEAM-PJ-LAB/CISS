import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { ...pageMeta(locale, '/search', getT(locale)('search.title')), robots: { index: false } };
}

export default async function SearchPage({ params }: Props) {
  const t = getT((await params).locale);
  return (
    <div className="wrap page narrow">
      <h1 className="display">{t('search.title')}</h1>
      <Suspense><SearchResults /></Suspense>
    </div>
  );
}
