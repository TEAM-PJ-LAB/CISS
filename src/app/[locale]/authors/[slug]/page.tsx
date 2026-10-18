import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import ClaimList from '@/components/ClaimList';
import CopyField from '@/components/CopyField';
import { AlgoRef, Authors, Section, fieldColor } from '@/components/ui';
import type { Field } from '@/data/types';
import { getT } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';
import { registry } from '@/lib/registry';
import { badgePath, withBase } from '@/lib/runtime';
import { SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const generateStaticParams = () => LOCALES.flatMap((locale) => [...registry().authorCredit.keys()].map((slug) => ({ locale, slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const ac = registry().authorCredit.get(slug);
  return ac ? pageMeta(locale, `/authors/${slug}`, ac.author.name, getT(locale)('author.meta', { name: ac.author.name, n: ac.algorithms.length })) : {};
}

export default async function AuthorPage({ params }: Props) {
  const { locale, slug } = await params;
  const x = ctx(locale);
  const { r, t, href } = x;
  const ac = r.authorCredit.get(slug);
  if (!ac) notFound();

  const fields = (Object.entries(ac.byField) as [Field, number][]).sort((a, b) => b[1] - a[1]);
  const fieldRank = (f: Field) => r.ranking(f).findIndex((y) => y.author.slug === slug) + 1;
  const coauthors = [...new Set(ac.algorithms.flatMap((y) => r.algo.get(y.slug)!.origins
    .filter((o) => o.authors.includes(slug)).flatMap((o) => o.authors)))].filter((s) => s !== slug);
  const derived = ac.algorithms.flatMap((y) => r.out.get(y.slug)!.filter((e) => e.status !== 'related'));
  const badge = `[![CISS credit](${SITE_URL}${badgePath('author', slug)})](${SITE_URL}/${locale}/authors/${slug})`;

  return (
    <div className="wrap page record">
      <article>
        <p className="crumb"><Link href={href('/authors')}>{t('nav.authors')}</Link></p>
        <h1 className="display">{ac.author.name}</h1>
        <p className="lede">{ac.author.org && `${t('authors.org')}. `}{t('author.lede', { n: ac.algorithms.length, m: new Set(derived.map((e) => e.to)).size })}</p>

        <Section title={t('author.designed')} aside={t('author.designedAside')}>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>{t('col.algorithm')}</th><th>{t('author.with')}</th><th className="num">{t('author.share')}</th><th className="num">{t('author.points')}</th></tr></thead>
              <tbody>
                {ac.algorithms.map((y) => {
                  const a = r.algo.get(y.slug)!;
                  const others = [...new Set(a.origins.flatMap((o) => o.authors))].filter((s) => s !== slug);
                  return (
                    <tr key={y.slug}>
                      <td><AlgoRef x={x} a={a} /></td>
                      <td className="small">{others.length ? <Authors x={x} slugs={others} max={4} /> : <span className="muted">{t('author.solo')}</span>}</td>
                      <td className="num small">{Math.round(y.share * 100)}%</td>
                      <td className="num"><b>{y.points}</b></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {derived.length > 0 && (
          <Section title={t('author.lineage')} aside={t('author.lineageAside')}>
            <ul className="rows">
              {derived.map((e) => (
                <li key={e.id}>
                  <span className="chain"><AlgoRef x={x} a={r.algo.get(e.from)!} year={false} /><span className="arrow" aria-hidden>→</span><AlgoRef x={x} a={r.algo.get(e.to)!} /></span>
                  <span className={`st ${e.status}`}>{t(`type.${e.type}`)}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {coauthors.length > 0 && (
          <Section title={t('author.coauthors')}>
            <p className="empty"><Authors x={x} slugs={coauthors} /></p>
          </Section>
        )}

        <Section title={t('nav.claims')} aside={<Link href={href(`/claims?target=author:${slug}`)}>{t('author.requestFix')}</Link>}>
          <ClaimList target={`author:${slug}`} />
        </Section>
      </article>

      <aside className="side" aria-label={t('algo.creditPanel')}>
        <p className="side-l">{t('col.score')}</p>
        <p className="score">{ac.score}</p>
        <p className="side-sub">{t('author.rank', { n: r.authorCredit.size, k: r.rankOf.get(slug)! })} · <Link href={href('/about#score')}>{t('algo.formula')}</Link></p>
        <dl>
          {fields.map(([f, v]) => (
            <Fragment key={f}>
              <dt><span className="ftag"><i className="fdot" style={fieldColor(f)} aria-hidden />{t(`field.${f}`)}</span> <span className="muted small">{t('author.fieldRank', { k: fieldRank(f) })}</span></dt>
              <dd>{v}</dd>
            </Fragment>
          ))}
        </dl>
        <div className="badge-box">
          <p className="side-l">{t('badge.title')}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="badge-img" src={withBase(badgePath('author', slug))} alt={`CISS credit: ${ac.author.name}`} height={20} />
          <CopyField label="Markdown" value={badge} />
        </div>
      </aside>
    </div>
  );
}
