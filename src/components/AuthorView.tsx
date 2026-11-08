'use client';

import { Fragment, useEffect, useState, type CSSProperties } from 'react';
import Link from '@/components/AppLink';
import CopyField from '@/components/CopyField';
import { useI18n } from '@/i18n/client';
import { interpolate } from '@/i18n/format';
import { dataPath, withBase } from '@/lib/runtime';

/** export-static이 data/author-pages/<slug>.json으로 내보내는 형태 (lib/featured 범위 밖 기여자). */
export interface AuthorPage {
  slug: string; name: string; org: boolean; rank: number; total: number; score: number; derived: number;
  byField: Record<string, number>;
  algorithms: { slug: string; name: string; field: string; year: number | null; share: number; points: number; with: { slug: string; name: string; path: string }[] }[];
}
type L = Record<'authors' | 'designed' | 'designedAside' | 'algorithm' | 'with' | 'share' | 'points' | 'solo' | 'lede' | 'score' | 'rank' | 'formula'
  | 'badge' | 'requestFix' | 'edit' | 'history' | 'org' | 'notFoundTitle' | 'notFoundBody' | 'loading', string>;

const dot = (f: string) => ({ '--fc': `var(--f-${f})` }) as CSSProperties;

export default function AuthorView({ l, site, wiki }: { l: L; site: string; wiki: { edit: string; history: string } }) {
  const { t, href, locale } = useI18n();
  const [slug, setSlug] = useState<string | null>(null);
  const [a, setA] = useState<AuthorPage | null | undefined>(undefined);
  useEffect(() => {
    const s = new URLSearchParams(location.search).get('a') ?? '';
    setSlug(s);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) { setA(null); return; }
    fetch(withBase(dataPath(`author-pages/${s}.json`))).then((r) => (r.ok ? r.json() : null)).then(setA).catch(() => setA(null));
  }, []);
  useEffect(() => { if (a) { const id = setTimeout(() => { document.title = `${a.name} — CISS`; }); return () => clearTimeout(id); } }, [a]);
  const yr = (y: number | null) => (y == null ? t('year.unknown') : y < 0 ? t('year.bce', { n: -y }) : String(y));

  if (a === undefined) return <p className="empty">{l.loading}</p>;
  if (!a) return <div><h1 className="display">{l.notFoundTitle}</h1><p className="lede">{l.notFoundBody}</p><p><Link href={href('/authors')}>{l.authors}</Link></p></div>;
  const badge = `[![CISS credit](${site}/badge/author/${a.slug}.svg)](${site}/${locale}/authors/${slug}/)`;
  return (
    <div className="record">
      <article>
        <p className="crumb"><Link href={href('/authors')}>{l.authors}</Link>
          <span className="wiki"><a href={wiki.edit} target="_blank" rel="noopener noreferrer">{l.edit}</a><a href={wiki.history} target="_blank" rel="noopener noreferrer">{l.history}</a></span></p>
        <h1 className="display">{a.name}</h1>
        <p className="lede">{a.org && `${l.org}. `}{interpolate(l.lede, { n: a.algorithms.length, m: a.derived })}</p>
        <section className="sect">
          <header><h2>{l.designed}</h2><div className="aside">{l.designedAside}</div></header>
          <div className="scroll">
            <table className="tbl">
              <thead><tr><th>{l.algorithm}</th><th>{l.with}</th><th className="num">{l.share}</th><th className="num">{l.points}</th></tr></thead>
              <tbody>
                {a.algorithms.map((y) => (
                  <tr key={y.slug}>
                    <td><Link href={href(`/algorithms/${y.slug}`)} className="aref"><i className="fdot" style={dot(y.field)} aria-hidden /><span className="aname">{y.name}</span><span className="yr">{yr(y.year)}</span></Link></td>
                    <td className="small">{y.with.length ? y.with.map((w, i) => <span key={w.slug}>{i > 0 && ', '}<Link href={href(w.path)}>{w.name}</Link></span>) : <span className="muted">{l.solo}</span>}</td>
                    <td className="num small">{Math.round(y.share * 100)}%</td>
                    <td className="num"><b>{y.points}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="sect">
          <header><h2>{t('nav.claims')}</h2></header>
          <p className="empty"><Link href={href(`/claims?target=author:${a.slug}`)}>{l.requestFix}</Link></p>
        </section>
      </article>
      <aside className="side">
        <p className="side-l">{l.score}</p>
        <p className="score">{a.score}</p>
        <p className="side-sub">{interpolate(l.rank, { n: a.total, k: a.rank })} · <Link href={href('/about#score')}>{l.formula}</Link></p>
        <dl>
          {Object.entries(a.byField).sort((p, q) => q[1] - p[1]).map(([f, v]) => (
            <Fragment key={f}><dt><span className="ftag"><i className="fdot" style={dot(f)} aria-hidden />{t(`field.${f}` as Parameters<typeof t>[0])}</span></dt><dd>{v}</dd></Fragment>
          ))}
        </dl>
        <div className="badge-box">
          <p className="side-l">{l.badge}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="badge-img" src={withBase(`/badge/author/${a.slug}.svg`)} alt={`CISS credit: ${a.name}`} height={20} />
          <CopyField label="Markdown" value={badge} />
        </div>
      </aside>
    </div>
  );
}
