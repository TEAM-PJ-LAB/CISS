'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n/client';
import { useClaims } from '@/lib/claims-client';
import { STATIC } from '@/lib/runtime';
import AdminReview from './AdminReview';
import ClaimForm, { type TargetOptions } from './ClaimForm';
import { ClaimItem, LoadError } from './ClaimList';
import { withQuery } from './QueryViews';

const STATUSES = ['pending', 'accepted', 'rejected'] as const;
type S = (typeof STATUSES)[number];

export default withQuery(function ClaimsBoard({ options, q }: { options: TargetOptions; q: URLSearchParams }) {
  const { t, href } = useI18n();
  const { claims, error, reload } = useClaims();
  const status = STATUSES.includes(q.get('status') as S) ? (q.get('status') as S) : undefined;
  const label = new Map(Object.values(options).flat().map((o) => [o.value, o.label]));
  const target = q.get('target') ?? '';
  const initial = label.has(target) ? target : undefined;
  const count = (s: S) => claims?.filter((c) => c.status === s).length ?? 0;
  const shown = claims?.filter((c) => !status || c.status === status) ?? [];
  const path = (tg: string) => {
    const [k, ...rest] = tg.split(':');
    const id = rest.join(':');
    return k === 'author' ? `/authors/${id}` : k === 'algorithm' ? `/algorithms/${id}` : `/algorithms/${id.split('>')[1] ?? id}#parents`;
  };

  return (
    <>
      <section className="sect">
        <header><h2>{t('claims.submit')}</h2></header>
        {STATIC && <p className="small muted" style={{ margin: '12px 0 20px' }}>{t('claims.github')}</p>}
        <div className="form-wrap"><ClaimForm key={initial} options={options} initial={initial} onSubmitted={reload} /></div>
      </section>
      <section className="sect">
        <header><h2>{t('claims.received')}</h2>{claims && <div className="aside">{t('claims.counts', { p: count('pending'), a: count('accepted'), r: count('rejected') })}</div>}</header>
        <nav className="filters" aria-label={t('claims.statusFilter')}>
          <Link href={href('/claims')} aria-current={!status}>{t('common.all')}</Link>
          {STATUSES.map((s) => <Link key={s} href={href(`/claims?status=${s}`)} aria-current={s === status}>{t(`claim.status.${s}`)}</Link>)}
        </nav>
        {error ? <LoadError /> : !claims ? <p className="empty muted">{t('common.loading')}</p> : shown.length ? (
          <ul className="rows report">
            {shown.map((c) => (
              <ClaimItem key={c.id} c={c} target={<Link href={href(path(c.target))}>{label.get(c.target) ?? c.target}</Link>}>
                {!STATIC && c.status === 'pending' && <AdminReview id={c.id} onDone={reload} />}
              </ClaimItem>
            ))}
          </ul>
        ) : <p className="empty muted">{status ? t('claims.noneStatus') : t('claims.none')}</p>}
      </section>
    </>
  );
});
