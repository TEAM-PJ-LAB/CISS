import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import LineageGraph from '@/components/LineageGraph';
import SearchBox from '@/components/SearchBox';
import { AlgoRef, FieldTag, Section, Status } from '@/components/ui';
import { EDGE_STATUSES } from '@/data/types';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { toGraph } from '@/lib/graph';
import { pageMeta } from '@/lib/meta';

const HERO = 'quicksort';
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMeta((await params).locale, '');
}

export default async function Home({ params }: Props) {
  const x = ctx((await params).locale);
  const { r, t, href } = x;
  const s = r.stats();
  const lin = r.lineage(HERO);
  const top = r.topAlgorithms(8);
  const ranking = r.ranking().slice(0, 8);

  return (
    <>
      <section className="atlas" aria-labelledby="hero-h">
        <div className="wrap atlas-grid">
          <div className="atlas-copy">
            <h1 id="hero-h">{t('home.title')}</h1>
            <p className="lede">{t('home.lede')}</p>
            <SearchBox size="lg" />
            <dl className="atlas-facts">
              <div><dt>{t('home.fact.algorithms')}</dt><dd>{s.algorithms}</dd></div>
              <div><dt>{t('home.fact.authors')}</dt><dd>{s.authors}</dd></div>
              <div><dt>{t('home.fact.edges')}</dt><dd>{s.derivations}</dd></div>
              <div><dt>{t('home.fact.sources')}</dt><dd>{s.sourcesChecked}<small>/{s.sources}</small></dd></div>
            </dl>
          </div>
          <figure className="atlas-chart">
            <LineageGraph {...toGraph(x, lin.nodes, lin.edges)} focus={HERO} height={460} controls={false} className="draw" />
            <figcaption>
              <Link href={href(`/algorithms/${HERO}`)}>{t('home.heroCaption')}</Link>
              <span>{t('home.heroHint')}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="wrap">
        <section className="legend" aria-label={t('home.legend')}>
          {EDGE_STATUSES.map((k) => (
            <div key={k}>
              <Status x={x} s={k} />
              <p>{t(`statusHint.${k}`)}</p>
            </div>
          ))}
        </section>

        <div className="two">
          <Section title={t('home.topAlgorithms')} aside={<Link href={href('/algorithms')}>{t('common.viewAll')}</Link>}>
            <ol className="rows ranked">
              {top.map((a, i) => {
                const c = r.credit.get(a.slug)!;
                return (
                  <li key={a.slug}>
                    <span className="rank">{i + 1}</span>
                    <AlgoRef x={x} a={a} />
                    <span className="num score-sm">{c.score}</span>
                    <span className="meta">{t('credit.line', { d: c.direct, n: c.descendants, i: c.implementations })}</span>
                  </li>
                );
              })}
            </ol>
          </Section>
          <Section title={t('home.ranking')} aside={<Link href={href('/rankings')}>{t('home.byField')}</Link>}>
            <ol className="rows ranked">
              {ranking.map((y, i) => (
                <li key={y.author.slug}>
                  <span className="rank">{i + 1}</span>
                  <Link href={href(`/authors/${y.author.slug}`)} className="pname">{y.author.name}</Link>
                  <span className="num score-sm">{y.score}</span>
                  <span className="meta">
                    {y.algorithms.slice(0, 3).map((z) => r.algo.get(z.slug)!.name).join(', ')}
                    {y.algorithms.length > 3 && ` ${t('common.andMore', { n: y.algorithms.length - 3 })}`}
                  </span>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <Section title={t('home.fields')} aside={t('home.fieldsAside', { n: s.algorithms, m: s.multiOrigin })}>
          <ul className="field-index">
            {r.fields.map((f) => (
              <li key={f} style={{ '--fc': `var(--f-${f})` } as CSSProperties}>
                <FieldTag x={x} field={f} link />
                <span className="num">{r.algorithms.filter((a) => a.field === f).length}</span>
                <p>{r.topAlgorithms(3, f).map((a) => a.name).join(', ')}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t('home.principles')}>
          <ul className="principles">
            <li><h3>{t('home.p1.h')}</h3><p>{t('home.p1.b')}</p></li>
            <li><h3>{t('home.p2.h')}</h3><p>{t('home.p2.b')}</p></li>
            <li><h3>{t('home.p3.h')}</h3><p>{t('home.p3.b', { p: Math.round(s.verifiedRatio * 100) })}</p></li>
          </ul>
          <p className="muted small" style={{ marginTop: 20 }}>
            {t('home.cta')} <Link href={href('/claims')}>{t('nav.claims')}</Link>
          </p>
        </Section>
      </div>
    </>
  );
}
