'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/i18n/client';
import { useSearch } from '@/lib/use-search';
import SearchBox from './SearchBox';

export default function SearchResults() {
  const { t, href, locale } = useI18n();
  const q = useSearchParams().get('q') ?? '';
  const { hits, loading } = useSearch(q, locale, 60, 0);
  const algos = hits.filter((h) => h.kind === 'algorithm');
  const people = hits.filter((h) => h.kind === 'author');
  return (
    <>
      <div style={{ marginTop: 20 }}><SearchBox key={q} initial={q} size="lg" /></div>
      {q.trim() && !loading && <p className="lede">{t('search.summary', { q, n: hits.length })}</p>}
      {q.trim() && !loading && !hits.length && <p className="empty">{t('search.none')} <Link href={href('/algorithms')}>{t('nav.algorithms')}</Link></p>}
      {algos.length > 0 && (
        <section className="sect"><header><h2>{t('nav.algorithms')}</h2><div className="aside">{algos.length}</div></header>
          <ul className="rows">{algos.map((h) => (
            <li key={h.slug}><Link href={href(`/algorithms/${h.slug}`)} className="aname">{h.label}</Link><span /><span className="meta">{h.sub}</span></li>
          ))}</ul>
        </section>
      )}
      {people.length > 0 && (
        <section className="sect"><header><h2>{t('nav.authors')}</h2><div className="aside">{people.length}</div></header>
          <ul className="rows">{people.map((h) => (
            <li key={h.slug}><Link href={href(`/authors/${h.slug}`)} className="pname">{h.label}</Link><span /><span className="meta">{h.sub}</span></li>
          ))}</ul>
        </section>
      )}
    </>
  );
}
