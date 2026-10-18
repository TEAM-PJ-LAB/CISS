import type { Metadata } from 'next';
import { RankingsView, type RankData } from '@/components/QueryViews';
import { FIELDS } from '@/data/types';
import { formatYear, getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/rankings', t('nav.rankings'), t('rankings.meta'));
}

export default async function Rankings({ params }: Props) {
  const { r, t } = ctx((await params).locale);
  const data: RankData = Object.fromEntries([undefined, ...FIELDS].map((field) => [field ?? '', {
    people: r.ranking(field).slice(0, 50).map((y) => ({
      s: y.author.slug, n: y.author.name, v: y.value,
      a: y.algorithms.filter((z) => !field || r.algo.get(z.slug)!.field === field).slice(0, 3).map((z) => r.algo.get(z.slug)!.name).join(', '),
    })),
    algos: r.topAlgorithms(15, field).map((a) => ({ s: a.slug, n: a.name, f: a.field, y: formatYear(t, r.yearOf(a.slug)), sc: r.credit.get(a.slug)!.score })),
  }]));
  return <div className="wrap page"><RankingsView data={data} /></div>;
}
