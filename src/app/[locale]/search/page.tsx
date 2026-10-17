import type { Metadata } from 'next';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';
import { search } from '@/lib/search';

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { ...pageMeta(locale, '/search', getT(locale)('search.title')), robots: { index: false } };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const [{ locale }, { q = '' }] = await Promise.all([params, searchParams]);
  const x = ctx(locale);
  const hits = search(x.r, q, 60, locale);
  const algos = hits.filter((h) => h.kind === 'algorithm');
  const people = hits.filter((h) => h.kind === 'author');
  return (
    <div className="wrap page narrow">
      <h1 className="display">{x.t('search.title')}</h1>
      <div style={{ marginTop: 20 }}><SearchBox initial={q} size="lg" /></div>
      {q.trim() && <p className="lede">{x.t('search.summary', { q, n: hits.length })}</p>}
      {q.trim() && !hits.length && <p className="empty">{x.t('search.none')} <Link href={x.href('/algorithms')}>{x.t('nav.algorithms')}</Link></p>}
      {algos.length > 0 && (
        <section className="sect"><header><h2>{x.t('nav.algorithms')}</h2><div className="aside">{algos.length}</div></header>
          <ul className="rows">{algos.map((h) => (
            <li key={h.slug}><Link href={x.href(`/algorithms/${h.slug}`)} className="aname">{h.label}</Link><span /><span className="meta">{h.sub}</span></li>
          ))}</ul>
        </section>
      )}
      {people.length > 0 && (
        <section className="sect"><header><h2>{x.t('nav.authors')}</h2><div className="aside">{people.length}</div></header>
          <ul className="rows">{people.map((h) => (
            <li key={h.slug}><Link href={x.href(`/authors/${h.slug}`)} className="pname">{h.label}</Link><span /><span className="meta">{h.sub}</span></li>
          ))}</ul>
        </section>
      )}
    </div>
  );
}
