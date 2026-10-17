import type { Metadata } from 'next';
import GraphExplorer from '@/components/GraphExplorer';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { toGraph } from '@/lib/graph';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/graph', t('nav.graph'), t('graph.meta'));
}

export default async function GraphPage({ params }: Props) {
  const x = ctx((await params).locale);
  const g = toGraph(x, x.r.algorithms, x.r.derivations);
  const linked = new Set(x.r.derivations.flatMap((e) => [e.from, e.to]));
  return (
    <div className="wrap page">
      <h1 className="display">{x.t('nav.graph')}</h1>
      <p className="lede">{x.t('graph.lede', { n: x.r.algorithms.length - linked.size })}</p>
      <GraphExplorer {...g} />
    </div>
  );
}
