'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n/client';
import type { PublicClaim } from '@/lib/claims';

export function ClaimItem({ c, target, children }: { c: PublicClaim; target?: ReactNode; children?: ReactNode }) {
  const { t } = useI18n();
  return (
    <li className="claim">
      <p className="claim-h">
        <span className={`pill ${c.status}`}>{t(`claim.status.${c.status}`)}</span>
        <b>{t(`claim.kind.${c.kind}`)}</b>{target}
        <span className="small muted">{c.name}, <time dateTime={c.createdAt}>{c.createdAt.slice(0, 10)}</time></span>
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
  const [claims, setClaims] = useState<PublicClaim[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(`/api/claims?target=${encodeURIComponent(target)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => setClaims(d.claims))
      .catch(() => setError(true));
  }, [target]);
  if (error) return <p className="err empty">{t('claim.loadError')}</p>;
  if (!claims) return <p className="empty muted">{t('common.loading')}</p>;
  if (!claims.length) return <p className="empty muted">{t('claim.none')}</p>;
  return <ul className="rows report">{claims.map((c) => <ClaimItem key={c.id} c={c} />)}</ul>;
}
