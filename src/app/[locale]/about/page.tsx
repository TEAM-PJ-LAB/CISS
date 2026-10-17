import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, Status } from '@/components/ui';
import { DERIVATION_TYPES, EDGE_STATUSES, EVIDENCE_KINDS } from '@/data/types';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';
import { SCORE } from '@/lib/registry';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/about', t('nav.about'), t('about.meta'));
}

const PHASES = ['p0', 'p1', 'p2', 'p3', 'p4'] as const;

export default async function About({ params }: Props) {
  const x = ctx((await params).locale);
  const { r, t, href } = x;
  const s = r.stats();
  const q = r.credit.get('quicksort')!;

  return (
    <div className="wrap page narrow prose">
      <h1 className="display">{t('nav.about')}</h1>
      <p className="lede">{t('about.lede')}</p>

      <Section id="unit" title={t('about.unit.h')}>
        <p>{t('about.unit.b1')}</p>
        <p>{t('about.unit.b2')}</p>
        <dl className="defs">
          {(['algorithm', 'origin', 'author', 'implementation', 'derivation'] as const).map((k) => (
            <div key={k}><dt>{t(`about.model.${k}`)}</dt><dd>{t(`about.model.${k}.d`)}</dd></div>
          ))}
        </dl>
      </Section>

      <Section id="types" title={t('about.types.h')}>
        <dl className="defs">
          {DERIVATION_TYPES.map((k) => <div key={k}><dt>{t(`type.${k}`)}</dt><dd>{t(`about.type.${k}`)}</dd></div>)}
        </dl>
      </Section>

      <Section id="evidence" title={t('about.evidence.h')}>
        <p>{t('about.evidence.b')}</p>
        <dl className="defs">
          {EDGE_STATUSES.map((k) => <div key={k}><dt><Status x={x} s={k} /></dt><dd>{t(`statusHint.${k}`)}</dd></div>)}
        </dl>
        <p className="small muted">{t('about.evidence.kinds')} {EVIDENCE_KINDS.map((k) => t(`evidence.${k}`)).join(', ')}.</p>
      </Section>

      <Section id="score" title={t('about.score.h')}>
        <p>{t('about.score.b')}</p>
        <pre className="formula">{`w(e)       = 1                       ${t('status.verified')}
           = ${SCORE.ESTIMATED} × confidence        ${t('status.estimated')}
           = 0                       ${t('status.related')}

score(a)   = ${SCORE.ORIGIN}
           + ${SCORE.DIRECT} × Σ w(e)                 e ∈ ${t('col.direct')}
           + ${SCORE.INDIRECT} × Σ best(v) × ${SCORE.DECAY}^(d−1)     v ∈ ${t('col.descendants')}
           + ${SCORE.IMPL} × ${t('col.impl')}

author(p)  = Σ score(a) × 1/|origins(a)| × 1/|authors(o)|`}</pre>
        <p className="small">{t('about.score.example', { d: q.direct, n: q.descendants, i: q.implementations, s: q.score })} <Link href={href('/algorithms/quicksort')}>Quicksort</Link></p>
        <p className="small muted">{t('about.score.note')}</p>
      </Section>

      <Section id="sources" title={t('about.sources.h')}>
        <p>{t('about.sources.b1', { a: s.algorithms, o: s.multiOrigin })}</p>
        <p>{t('about.sources.b2', { c: s.sourcesChecked, n: s.sources })}</p>
        <p>{t('about.sources.b3', { i: s.implementations })}</p>
      </Section>

      <Section id="roadmap" title={t('about.roadmap.h')}>
        <ol className="phases">
          {PHASES.map((p) => <li key={p}><b>{t(`about.${p}.h`)}</b><p>{t(`about.${p}.b`)}</p></li>)}
        </ol>
      </Section>

      <Section id="privacy" title={t('about.privacy.h')}>
        <p>{t('about.privacy.b')}</p>
        <p>{t('about.disclaimer')}</p>
      </Section>
    </div>
  );
}
