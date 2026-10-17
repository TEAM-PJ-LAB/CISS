import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { Algorithm, EdgeStatus, Field, Origin, SourceId } from '@/data/types';
import { formatYear } from '@/i18n';
import type { Ctx } from '@/lib/ctx';

export const fieldColor = (f: Field) => ({ '--fc': `var(--f-${f})` }) as CSSProperties;

export const sourceHref = (id: SourceId) =>
  id.startsWith('doi:') ? `https://doi.org/${id.slice(4)}` : id.startsWith('arxiv:') ? `https://arxiv.org/abs/${id.slice(6)}` : id.slice(4);

export const sourceText = (id: SourceId) =>
  id.startsWith('doi:') ? `doi:${id.slice(4)}` : id.startsWith('arxiv:') ? `arXiv:${id.slice(6)}` : new URL(id.slice(4)).host + new URL(id.slice(4)).pathname.replace(/\/$/, '');

export function FieldTag({ x, field, link = false }: { x: Ctx; field: Field; link?: boolean }) {
  const body = <><i className="fdot" style={fieldColor(field)} aria-hidden />{x.t(`field.${field}`)}</>;
  return link ? <Link className="ftag" href={x.href(`/algorithms?field=${field}`)}>{body}</Link> : <span className="ftag">{body}</span>;
}

export const Status = ({ x, s }: { x: Ctx; s: EdgeStatus }) =>
  <span className={`st ${s}`} title={x.t(`statusHint.${s}`)}>{x.t(`status.${s}`)}</span>;

export function AlgoRef({ x, a, year = true }: { x: Ctx; a: Algorithm; year?: boolean }) {
  return (
    <Link href={x.href(`/algorithms/${a.slug}`)} className="aref">
      <i className="fdot" style={fieldColor(a.field)} aria-hidden />
      <span className="aname">{a.name}</span>
      {year && <span className="yr">{formatYear(x.t, x.r.yearOf(a.slug))}</span>}
    </Link>
  );
}

export function Authors({ x, slugs, max }: { x: Ctx; slugs: string[]; max?: number }) {
  if (!slugs.length) return <span className="muted">{x.t('author.unknown')}</span>;
  const shown = max && slugs.length > max ? slugs.slice(0, max - 1) : slugs;
  return (
    <>
      {shown.map((s, i) => (
        <span key={s}>{i > 0 && ', '}<Link href={x.href(`/authors/${s}`)}>{x.r.author.get(s)?.name ?? s}</Link></span>
      ))}
      {shown.length < slugs.length && <span className="muted"> {x.t('common.andMore', { n: slugs.length - shown.length })}</span>}
    </>
  );
}

export function Citation({ x, a, i, o: raw }: { x: Ctx; a: Algorithm; i: number; o: Origin }) {
  const o = x.c.origin(a, i, raw);
  const check = o.id ? x.r.checks[o.id] : undefined;
  return (
    <div className="cite">
      <span className="who"><Authors x={x} slugs={o.authors} /></span>{' '}
      ({formatYear(x.t, o.year)}). <span className="ttl">{o.title}</span>. {o.venue}.
      <span className="ids">
        {o.id ? <a href={sourceHref(o.id)} target="_blank" rel="noopener noreferrer">{sourceText(o.id)}</a> : x.t('cite.noId')}
        {check?.status === 'ok' && <span className="chk" title={check.title}> {x.t('cite.checked', { via: check.via, date: check.checked })}</span>}
        {o.note && <span className="note">{o.note}</span>}
      </span>
    </div>
  );
}

export function Section({ title, aside, children, id }: { title: ReactNode; aside?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section className="sect" id={id} aria-labelledby={id && `${id}-h`}>
      <header><h2 id={id && `${id}-h`}>{title}</h2>{aside && <div className="aside">{aside}</div>}</header>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
