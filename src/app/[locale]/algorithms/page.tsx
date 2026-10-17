import type { Metadata } from 'next';
import Link from 'next/link';
import { Authors, fieldColor } from '@/components/ui';
import { FIELDS, type Field } from '@/data/types';
import { formatYear, getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

const SORTS = ['score', 'year', 'name'] as const;
type Sort = (typeof SORTS)[number];
type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ field?: string; sort?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/algorithms', t('nav.algorithms'), t('algorithms.meta'));
}

export default async function Algorithms({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const x = ctx(locale);
  const { r, t, c, href } = x;
  const field = FIELDS.includes(sp.field as Field) ? (sp.field as Field) : undefined;
  const sort: Sort = SORTS.includes(sp.sort as Sort) ? (sp.sort as Sort) : 'score';
  const q = (f?: Field, s: Sort = sort) => href(`/algorithms?${new URLSearchParams({ ...(f && { field: f }), ...(s !== 'score' && { sort: s }) })}`.replace(/\?$/, ''));

  const list = r.algorithms.filter((a) => !field || a.field === field).sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name)
      : sort === 'year' ? (r.yearOf(a.slug) ?? 9999) - (r.yearOf(b.slug) ?? 9999)
        : r.credit.get(b.slug)!.score - r.credit.get(a.slug)!.score);

  return (
    <div className="wrap page">
      <h1 className="display">{field ? t(`field.${field}`) : t('nav.algorithms')}</h1>
      <p className="lede">{t('algorithms.lede', { n: list.length })}</p>
      <nav className="filters" aria-label={t('algorithms.fieldFilter')}>
        <Link href={q()} aria-current={!field}>{t('common.all')}</Link>
        {FIELDS.map((f) => (
          <Link key={f} href={q(f)} aria-current={f === field}><i className="fdot" style={fieldColor(f)} aria-hidden />{t(`field.${f}`)}</Link>
        ))}
      </nav>
      <p className="sorter">
        <span className="muted">{t('algorithms.sort')}</span>
        {SORTS.map((s) => s === sort ? <b key={s}>{t(`algorithms.sort.${s}`)}</b> : <Link key={s} href={q(field, s)}>{t(`algorithms.sort.${s}`)}</Link>)}
      </p>
      <div className="scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th>{t('col.algorithm')}</th><th>{t('col.originator')}</th><th>{t('col.year')}</th>
              <th className="num">{t('col.direct')}</th><th className="num">{t('col.descendants')}</th><th className="num">{t('col.impl')}</th><th className="num">{t('col.score')}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => {
              const cr = r.credit.get(a.slug)!;
              const authors = [...new Set(a.origins.flatMap((o) => o.authors))];
              const local = c.local(a);
              return (
                <tr key={a.slug}>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
