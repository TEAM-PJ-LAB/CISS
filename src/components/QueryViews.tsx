'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Fragment, Suspense, type CSSProperties, type ReactNode } from 'react';
import { FIELDS, type Field } from '@/data/types';
import { useI18n } from '@/i18n/client';

const fc = (f: string) => ({ '--fc': `var(--f-${f})` }) as CSSProperties;
const asField = (v: string | null) => (FIELDS.includes(v as Field) ? (v as Field) : undefined);

/** useSearchParams는 정적 빌드에서 Suspense 경계가 필요하다. 빌드 HTML에는 기본 상태를 넣는다. */
export function withQuery<P extends { q: URLSearchParams }>(View: (p: P) => ReactNode) {
  type O = Omit<P, 'q'>;
  const V = View as (p: O & { q: URLSearchParams }) => ReactNode;
  const Q = (p: O) => <V {...p} q={useSearchParams()} />;
  return function Wrapped(p: O) {
    return <Suspense fallback={<V {...p} q={new URLSearchParams()} />}><Q {...p} /></Suspense>;
  };
}

function FieldNav({ base, field, extra = '' }: { base: string; field?: Field; extra?: string }) {
  const { t, href } = useI18n();
  const to = (f?: Field) => href(`${base}${f || extra ? `?${new URLSearchParams({ ...(f && { field: f }) })}${extra && f ? '&' : ''}${extra}` : ''}`);
  return (
    <nav className="filters" aria-label={t('algorithms.fieldFilter')}>
      <Link href={to()} aria-current={!field}>{t('common.all')}</Link>
      {FIELDS.map((f) => <Link key={f} href={to(f)} aria-current={f === field}><i className="fdot" style={fc(f)} aria-hidden />{t(`field.${f}`)}</Link>)}
    </nav>
  );
}

/* ── /algorithms ───────────────────────────────────────── */
export interface AlgoRow { s: string; f: Field; y: number; n: string; sc: number; node: ReactNode }
const SORTS = ['score', 'year', 'name'] as const;
type Sort = (typeof SORTS)[number];

export const AlgorithmsView = withQuery(function Algorithms({ rows, head, q }: { rows: AlgoRow[]; head: ReactNode; q: URLSearchParams }) {
  const { t, href } = useI18n();
  const field = asField(q.get('field'));
  const sort: Sort = SORTS.includes(q.get('sort') as Sort) ? (q.get('sort') as Sort) : 'score';
  const list = rows.filter((a) => !field || a.f === field).sort((a, b) =>
    sort === 'name' ? a.n.localeCompare(b.n) : sort === 'year' ? a.y - b.y : b.sc - a.sc);
  const link = (s: Sort) => href(`/algorithms${field || s !== 'score' ? `?${new URLSearchParams({ ...(field && { field }), ...(s !== 'score' && { sort: s }) })}` : ''}`);
  return (
    <>
      <h1 className="display">{field ? t(`field.${field}`) : t('nav.algorithms')}</h1>
      <p className="lede">{t('algorithms.lede', { n: list.length })}</p>
      <FieldNav base="/algorithms" field={field} extra={sort !== 'score' ? `sort=${sort}` : ''} />
      <p className="sorter">
        <span className="muted">{t('algorithms.sort')}</span>
        {SORTS.map((s) => (s === sort ? <b key={s}>{t(`algorithms.sort.${s}`)}</b> : <Link key={s} href={link(s)}>{t(`algorithms.sort.${s}`)}</Link>))}
      </p>
      <div className="scroll"><table className="tbl">{head}<tbody>{list.map((a) => <Fragment key={a.s}>{a.node}</Fragment>)}</tbody></table></div>
    </>
  );
});

/* ── /authors ──────────────────────────────────────────── */
export interface AuthorRow { s: string; l: string; n: string; node: ReactNode }

export const AuthorsView = withQuery(function Authors({ rows, head, q }: { rows: AuthorRow[]; head: ReactNode; q: URLSearchParams }) {
  const { t, href } = useI18n();
  const letters = [...new Set(rows.map((r) => r.l))].sort();
  const letter = letters.includes(q.get('letter') ?? '') ? q.get('letter')! : undefined;
  const list = letter ? rows.filter((r) => r.l === letter).sort((a, b) => a.n.localeCompare(b.n)) : rows;
  return (
    <>
      <nav className="filters alpha" aria-label={t('authors.letter')}>
        <Link href={href('/authors')} aria-current={!letter}>{t('authors.byScore')}</Link>
        {letters.map((l) => <Link key={l} href={href(`/authors?letter=${encodeURIComponent(l)}`)} aria-current={l === letter}>{l}</Link>)}
      </nav>
      <div className="scroll"><table className="tbl">{head}<tbody>{list.map((r) => <Fragment key={r.s}>{r.node}</Fragment>)}</tbody></table></div>
    </>
  );
});

/* ── /rankings ─────────────────────────────────────────── */
export interface RankPerson { s: string; n: string; v: number; a: string }
export interface RankAlgo { s: string; n: string; f: Field; y: string; sc: number }
export type RankData = Record<string, { people: RankPerson[]; algos: RankAlgo[] }>;

export const RankingsView = withQuery(function Rankings({ data, q }: { data: RankData; q: URLSearchParams }) {
  const { t, href } = useI18n();
  const field = asField(q.get('field'));
  const { people, algos } = data[field ?? ''];
  const max = people[0]?.v || 1;
  return (
    <>
      <h1 className="display">{field ? t('rankings.fieldTitle', { field: t(`field.${field}`) }) : t('nav.rankings')}</h1>
      <p className="lede">{t('rankings.lede')}</p>
      <FieldNav base="/rankings" field={field} />
      <div className="two wide-left">
        <section className="sect" aria-labelledby="people-h">
          <header><h2 id="people-h">{t('rankings.people')}</h2><div className="aside">{t('rankings.top', { n: people.length })}</div></header>
          <ol className="rows ranked bars">
            {people.map((y, i) => (
              <li key={y.s}>
                <span className="rank">{i + 1}</span>
                <Link href={href(`/authors/${y.s}`)} className="pname">{y.n}</Link>
                <span className="num score-sm">{y.v}</span>
                <span className="meta"><span className="bar" aria-hidden><i style={{ width: `${(y.v / max) * 100}%` }} /></span>{y.a}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="sect" aria-labelledby="algos-h">
          <header><h2 id="algos-h">{t('rankings.algorithms')}</h2><div className="aside">{t('rankings.algorithmsAside')}</div></header>
          <ol className="rows ranked">
            {algos.map((a, i) => (
              <li key={a.s}>
                <span className="rank">{i + 1}</span>
                <Link href={href(`/algorithms/${a.s}`)} className="aref"><i className="fdot" style={fc(a.f)} aria-hidden /><span className="aname">{a.n}</span><span className="yr">{a.y}</span></Link>
                <span className="num score-sm">{a.sc}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
});
