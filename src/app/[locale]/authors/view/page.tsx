import type { Metadata } from 'next';
import AuthorView from '@/components/AuthorView';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { wikiLinks } from '@/lib/runtime';
import { SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ locale: Locale }> };

/** 정적 페이지가 없는 기여자를 데이터 파일로 그리는 공용 페이지 (lib/featured). 색인하지 않는다. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getT((await params).locale);
  return { title: t('nav.authors'), robots: { index: false, follow: true } };
}

export default async function AuthorViewPage({ params }: Props) {
  const t = getT((await params).locale);
  const l = {
    authors: t('nav.authors'), designed: t('author.designed'), designedAside: t('author.designedAside'), algorithm: t('col.algorithm'),
    with: t('author.with'), share: t('author.share'), points: t('author.points'), solo: t('author.solo'), lede: t('author.lede'),
    score: t('col.score'), rank: t('author.rank'), formula: t('algo.formula'), badge: t('badge.title'), requestFix: t('author.requestFix'),
    edit: t('wiki.edit'), history: t('wiki.history'), org: t('authors.org'), notFoundTitle: t('notFound.title'), notFoundBody: t('notFound.body'),
    loading: t('common.loading'),
  };
  return <div className="wrap page"><AuthorView l={l} site={SITE_URL} wiki={wikiLinks('src/data/authors.ts')} /></div>;
}
