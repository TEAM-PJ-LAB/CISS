import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ClaimList from '@/components/ClaimList';
import CopyField from '@/components/CopyField';
import LineageGraph from '@/components/LineageGraph';
import { AlgoRef, Citation, Empty, FieldTag, Section, Status, sourceHref, sourceText } from '@/components/ui';
import type { Derivation } from '@/data/types';
import { content, formatYear } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/config';
import { ctx, pct, type Ctx } from '@/lib/ctx';
import { toGraph } from '@/lib/graph';
import { pageMeta } from '@/lib/meta';
import { registry } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const generateStaticParams = () => LOCALES.flatMap((locale) => registry().algorithms.map((a) => ({ locale, slug: a.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = registry().algo.get(slug);
  return a ? pageMeta(locale, `/algorithms/${slug}`, a.name, content(locale).summary(a)) : {};
}

function EdgeRow({ x, e, other }: { x: Ctx; e: Derivation; other: string }) {
  return (
    <div className="edge">
      <AlgoRef x={x} a={x.r.algo.get(other)!} />
      <span className="edge-meta">
        {e.status !== 'related' && <span className="etype">{x.t(`type.${e.type}`)}</span>}
        <Status x={x} s={e.status} />
        <span className="conf" title={x.t('edge.confidence')}>{pct(e.confidence)}</span>
      </span>
      {e.evidence.map((ev, i) => (
        <p key={i} className="ev">
          <span className="evk">{x.t(`evidence.${ev.kind}`)}</span>{x.c.evidence(e, i)}
          {ev.ref && <> — <a href={sourceHref(ev.ref)} target="_blank" rel="noopener noreferrer">{sourceText(ev.ref)}</a></>}
        </p>
      ))}
    </div>
  );
}

export default async function AlgorithmPage({ params }: Props) {
  const { locale, slug } = await params;
  const x = ctx(locale);
  const { r, t, c, href } = x;
  const a = r.algo.get(slug);
  if (!a) notFound();

  const cr = r.credit.get(slug)!;
  const rank = r.topAlgorithms(r.algorithms.length).findIndex((y) => y.slug === slug) + 1;
  const lin = r.lineage(slug);
  const parents = r.inc.get(slug)!.filter((e) => e.status !== 'related');
  const children = r.out.get(slug)!.filter((e) => e.status !== 'related');
  const related = [...r.inc.get(slug)!, ...r.out.get(slug)!].filter((e) => e.status === 'related');
  const impls = r.impls.get(slug) ?? [];
  const badge = `[![CISS credited](${SITE_URL}/api/badge/algorithm/${slug})](${SITE_URL}/${locale}/algorithms/${slug})`;
  const local = c.local(a);
  const names = [local !== a.name ? local : undefined, ...(a.aka ?? [])].filter(Boolean);

  return (
    <div className="wrap page record">
      <article>
        <p className="crumb"><Link href={href('/algorithms')}>{t('nav.algorithms')}</Link><span aria-hidden>/</span><FieldTag x={x} field={a.field} link /></p>
        <h1 className="display">{a.name}</h1>
        <p className="aka">{names.join(', ')}{names.length > 0 && <span aria-hidden> — </span>}<span className="yr">{formatYear(t, r.yearOf(slug))}</span></p>
        <p className="lede measure">{c.summary(a)}</p>

        <Section id="origin" title={t('algo.origin')} aside={a.origins.length > 1 ? t('algo.multiOrigin', { n: a.origins.length }) : undefined}>
          {a.origins.length ? a.origins.map((o, i) => <Citation key={i} x={x} a={a} i={i} o={o} />)
            : <Empty>{t('algo.folklore')} <Link href={href(`/claims?target=algorithm:${slug}`)}>{t('claim.kind.claim')}</Link></Empty>}
        </Section>

        <Section id="lineage" title={t('algo.lineage')} aside={t('algo.lineageAside', { n: lin.nodes.length, m: lin.edges.length })}>
          {lin.nodes.length > 1
            ? <div className="frame"><LineageGraph {...toGraph(x, lin.nodes, lin.edges)} focus={slug} height={Math.min(640, 240 + lin.nodes.length * 24)} labels={lin.nodes.length < 24} /></div>
            : <Empty>{t('algo.noLineage')}</Empty>}
        </Section>

        {parents.length > 0 && (
          <Section id="parents" title={t('algo.parents')} aside={t('algo.parentsAside')}>
            {parents.map((e) => <EdgeRow key={e.id} x={x} e={e} other={e.from} />)}
          </Section>
        )}
        {children.length > 0 && (
          <Section id="children" title={t('algo.children')} aside={t('algo.childrenAside')}>
            {children.map((e) => <EdgeRow key={e.id} x={x} e={e} other={e.to} />)}
          </Section>
        )}
        {related.length > 0 && (
          <Section id="related" title={t('algo.related')} aside={t('algo.relatedAside')}>
            {related.map((e) => <EdgeRow key={e.id} x={x} e={e} other={e.from === slug ? e.to : e.from} />)}
          </Section>
        )}

        <Section id="impl" title={t('algo.impl')} aside={impls.length ? t('algo.implAside') : undefined}>
          {impls.length ? (
            <ul className="rows impls">
              {impls.map((i) => {
                const url = `https://github.com/${i.repo}${i.path ? `/blob/HEAD/${i.path}` : ''}`;
                return (
                  <li key={url + (i.symbol ?? '')}>
                    <a href={url} target="_blank" rel="noopener noreferrer"><b>{i.repo}</b>{i.path && <span className="path">/{i.path}</span>}</a>
                    <span className="lang">{i.lang}</span>
                    {i.symbol && <span className="meta"><code>{i.symbol}</code></span>}
                  </li>
                );
              })}
            </ul>
          ) : <Empty>{t('algo.noImpl')} <Link href={href('/scan')}>{t('nav.scan')}</Link></Empty>}
        </Section>

        <Section id="claims" title={t('nav.claims')} aside={<Link href={href(`/claims?target=algorithm:${slug}`)}>{t('algo.requestFix')}</Link>}>
          <ClaimList target={`algorithm:${slug}`} />
        </Section>
      </article>

      <aside className="side" aria-label={t('algo.creditPanel')}>
        <p className="side-l">{t('col.score')}</p>
        <p className="score">{cr.score}</p>
        <p className="side-sub">{t('algo.rank', { n: r.algorithms.length, k: rank })} · <Link href={href('/about#score')}>{t('algo.formula')}</Link></p>
        <dl>
          <dt>{t('col.direct')}</dt><dd>{cr.direct}</dd>
          <dt>{t('col.descendants')}</dt><dd>{cr.descendants}</dd>
          <dt>{t('col.impl')}</dt><dd>{cr.implementations}</dd>
          <dt>{t('algo.originDocs')}</dt><dd>{a.origins.length}</dd>
        </dl>
        <div className="badge-box">
          <p className="side-l">{t('badge.title')}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="badge-img" src={`/api/badge/algorithm/${slug}`} alt={`CISS credited: ${a.name}`} height={20} />
          <CopyField label="Markdown" value={badge} />
        </div>
      </aside>
    </div>
  );
}
