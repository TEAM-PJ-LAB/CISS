import type { Metadata } from 'next';
import Link from 'next/link';
import { AlgoRef, fieldColor } from '@/components/ui';
import { FIELDS, type Field } from '@/data/types';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ field?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/rankings', t('nav.rankings'), t('rankings.meta'));
}

export default async function Rankings({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const x = ctx(locale);
  const { r, t, href } = x;
  const field = FIELDS.includes(sp.field as Field) ? (sp.field as Field) : undefined;
  const people = r.ranking(field).slice(0, 50);
  const algos = r.topAlgorithms(15, field);
  const max = people[0]?.value ?? 1;

  return (
    <div className="wrap page">
      <h1 className="display">{field ? t('rankings.fieldTitle', { field: t(`field.${field}`) }) : t('nav.rankings')}</h1>
      <p className="lede">{t('rankings.lede')}</p>
      <nav className="filters" aria-label={t('algorithms.fieldFilter')}>
        <Link href={href('/rankings')} aria-current={!field}>{t('common.all')}</Link>
        {FIELDS.map((f) => (
          <Link key={f} href={href(`/rankings?field=${f}`)} aria-current={f === field}><i className="fdot" style={fieldColor(f)} aria-hidden />{t(`field.${f}`)}</Link>
        ))}
      </nav>
      <div className="two wide-left">
        <section className="sect" aria-labelledby="people-h">
          <header><h2 id="people-h">{t('rankings.people')}</h2><div className="aside">{t('rankings.top', { n: people.length })}</div></header>
          <ol className="rows ranked bars">
            {people.map((y, i) => (
              <li key={y.author.slug}>
                <span className="rank">{i + 1}</span>
                <Link href={href(`/authors/${y.author.slug}`)} className="pname">{y.author.name}</Link>
                <span className="num score-sm">{y.value}</span>
                <span className="meta">
                  <span className="bar" aria-hidden><i style={{ width: `${(y.value / max) * 100}%` }} /></span>
                  {y.algorithms.filter((z) => !field || r.algo.get(z.slug)!.field === field).slice(0, 3).map((z) => r.algo.get(z.slug)!.name).join(', ')}
                </span>
              </li>
            ))}
          </ol>
        </section>
        <section className="sect" aria-labelledby="algos-h">
          <header><h2 id="algos-h">{t('rankings.algorithms')}</h2><div className="aside">{t('rankings.algorithmsAside')}</div></header>
          <ol className="rows ranked">
            {algos.map((a, i) => (
              <li key={a.slug}>
                <span className="rank">{i + 1}</span>
                <AlgoRef x={x} a={a} />
                <span className="num score-sm">{r.credit.get(a.slug)!.score}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
