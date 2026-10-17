import type { Metadata } from 'next';
import Link from 'next/link';
import AdminReview from '@/components/AdminReview';
import ClaimForm, { type TargetOptions } from '@/components/ClaimForm';
import { ClaimItem } from '@/components/ClaimList';
import { Section } from '@/components/ui';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { CLAIM_STATUSES, claimCounts, listClaims, targetExists, targetLabel, type ClaimStatus } from '@/lib/claims';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ target?: string; status?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/claims', t('nav.claims'), t('claims.meta'));
}

export default async function Claims({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const { r, t, href } = ctx(locale);
  const status = CLAIM_STATUSES.includes(sp.status as ClaimStatus) ? (sp.status as ClaimStatus) : undefined;
  const claims = listClaims({ status });
  const counts = claimCounts();
  const byName = <T extends { label: string }>(xs: T[]) => xs.sort((a, b) => a.label.localeCompare(b.label));
  const options: TargetOptions = {
    algorithm: byName(r.algorithms.map((a) => ({ value: `algorithm:${a.slug}`, label: a.name }))),
    derivation: byName(r.derivations.map((e) => ({ value: `derivation:${e.id}`, label: `${r.algo.get(e.from)!.name} → ${r.algo.get(e.to)!.name}` }))),
    author: byName([...r.authorCredit.values()].map((a) => ({ value: `author:${a.author.slug}`, label: a.author.name }))),
  };
  const initial = sp.target && targetExists(r, sp.target) ? sp.target : undefined;

  return (
    <div className="wrap page">
      <h1 className="display">{t('nav.claims')}</h1>
      <p className="lede">{t('claims.lede')}</p>

      <Section title={t('claims.submit')}>
        <div className="form-wrap"><ClaimForm options={options} initial={initial} /></div>
      </Section>

      <Section title={t('claims.received')} aside={t('claims.counts', { p: counts.pending, a: counts.accepted, r: counts.rejected })}>
        <nav className="filters" aria-label={t('claims.statusFilter')}>
          <Link href={href('/claims')} aria-current={!status}>{t('common.all')}</Link>
          {CLAIM_STATUSES.map((s) => <Link key={s} href={href(`/claims?status=${s}`)} aria-current={s === status}>{t(`claim.status.${s}`)}</Link>)}
        </nav>
        {claims.length ? (
          <ul className="rows report">
            {claims.map((c) => {
              const tg = targetLabel(r, c.target);
              return (
                <ClaimItem key={c.id} c={c} target={<Link href={href(tg.href)}>{tg.text}</Link>}>
                  {c.status === 'pending' && <AdminReview id={c.id} />}
                </ClaimItem>
              );
            })}
          </ul>
        ) : <p className="empty muted">{status ? t('claims.noneStatus') : t('claims.none')}</p>}
      </Section>
    </div>
  );
}
