import type { Metadata } from 'next';
import ClaimsBoard from '@/components/ClaimsBoard';
import type { TargetOptions } from '@/components/ClaimForm';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/claims', t('nav.claims'), t('claims.meta'));
}

export default async function Claims({ params }: Props) {
  const { r, t } = ctx((await params).locale);
  const byName = <T extends { label: string }>(xs: T[]) => xs.sort((a, b) => a.label.localeCompare(b.label));
  const options: TargetOptions = {
    algorithm: byName(r.algorithms.map((a) => ({ value: `algorithm:${a.slug}`, label: a.name }))),
    derivation: byName(r.derivations.map((e) => ({ value: `derivation:${e.id}`, label: `${r.algo.get(e.from)!.name} → ${r.algo.get(e.to)!.name}` }))),
    author: byName([...r.authorCredit.values()].map((a) => ({ value: `author:${a.author.slug}`, label: a.author.name }))),
  };
  return (
    <div className="wrap page">
      <h1 className="display">{t('nav.claims')}</h1>
      <p className="lede">{t('claims.lede')}</p>
      <ClaimsBoard options={options} />
    </div>
  );
}
