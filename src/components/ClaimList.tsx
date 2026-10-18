'use client';

import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/client';
import { ISSUES_URL, useClaims, type ClaimView } from '@/lib/claims-client';
import { STATIC } from '@/lib/runtime';

export function LoadError() {
  const { t } = useI18n();
  return <p className="err empty">{STATIC ? <>{t('claim.loadErrorStatic')} <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">{t('claim.viewIssues')}</a></> : t('claim.loadError')}</p>;
}

export function ClaimItem({ c, target, children }: { c: ClaimView; target?: ReactNode; children?: ReactNode }) {
  const { t } = useI18n();
  return (
    <li className="claim">
      <p className="claim-h">
        <span className={`pill ${c.status}`}>{t(`claim.status.${c.status}`)}</span>
        <b>{t(`claim.kind.${c.kind}`)}</b>{target}
        <span className="small muted">{c.name}, <time dateTime={c.createdAt}>{c.createdAt.slice(0, 10)}</time>
          {c.url && <> · <a href={c.url} target="_blank" rel="noopener noreferrer">#{c.id}</a></>}</span>
      </p>
      <p className="claim-b">{c.statement}</p>
      <p className="small">
        {t('claim.evidence')}: {c.evidence.map((e, i) => <span key={e}>{i > 0 && ', '}<a href={e} target="_blank" rel="noopener noreferrer nofollow">{e.replace(/^https?:\/\//, '').slice(0, 64)}</a></span>)}
      </p>
      {c.resolution && <p className="small muted">{t('claim.resolution')}: {c.resolution}</p>}
      {children}
    </li>
  );
}

export default function ClaimList({ target }: { target: string }) {
  const { t } = useI18n();
  const { claims, error } = useClaims();
  if (error) return <LoadError />;
  if (!claims) return <p className="empty muted">{t('common.loading')}</p>;
  const mine = claims.filter((c) => c.target === target);
  if (!mine.length) return <p className="empty muted">{t('claim.none')}</p>;
  return <ul className="rows report">{mine.map((c) => <ClaimItem key={c.id} c={c} />)}</ul>;
}
