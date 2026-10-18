import type { Metadata } from 'next';
import Link from 'next/link';
import { Authors, fieldColor } from '@/components/ui';
import { AlgorithmsView, type AlgoRow } from '@/components/QueryViews';
import { formatYear, getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/algorithms', t('nav.algorithms'), t('algorithms.meta'));
}

export default async function Algorithms({ params }: Props) {
  const x = ctx((await params).locale);
  const { r, t, c, href } = x;
  const rows: AlgoRow[] = r.algorithms.map((a) => {
    const cr = r.credit.get(a.slug)!;
    const authors = [...new Set(a.origins.flatMap((o) => o.authors))];
    const local = c.local(a);
    return {
      s: a.slug, f: a.field, y: r.yearOf(a.slug) ?? 9999, n: a.name, sc: cr.score,
      node: (
        <tr>
          <td>
            <Link href={href(`/algorithms/${a.slug}`)} className="aref"><i className="fdot" style={fieldColor(a.field)} aria-hidden /><span className="aname">{a.name}</span></Link>
            {local && local !== a.name && <div className="sub">{local}</div>}
          </td>
          <td className="small"><Authors x={x} slugs={authors} max={3} />
            {a.origins.length > 1 && <div className="muted">{t('algorithms.multiOrigin', { n: a.origins.length })}</div>}</td>
          <td className="small nowrap">{formatYear(t, r.yearOf(a.slug))}</td>
          <td className="num">{cr.direct}</td>
          <td className="num">{cr.descendants}</td>
          <td className="num">{cr.implementations}</td>
          <td className="num"><b>{cr.score}</b></td>
        </tr>
      ),
    };
  });
  const head = (
    <thead>
      <tr>
        <th>{t('col.algorithm')}</th><th>{t('col.originator')}</th><th>{t('col.year')}</th>
        <th className="num">{t('col.direct')}</th><th className="num">{t('col.descendants')}</th><th className="num">{t('col.impl')}</th><th className="num">{t('col.score')}</th>
      </tr>
    </thead>
  );
  return <div className="wrap page"><AlgorithmsView rows={rows} head={head} /></div>;
}
