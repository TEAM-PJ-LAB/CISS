import type { Metadata } from 'next';
import Link from '@/components/AppLink';
import CopyField from '@/components/CopyField';
import PendingRegistrations from '@/components/PendingRegistrations';
import { AlgoRef, Empty, FieldTag, Section } from '@/components/ui';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx, type Ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';
import { REGISTRATIONS, type Registration } from '@/lib/registrations';
import { ISSUES_REPO, withBase } from '@/lib/runtime';
import { SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/registry', t('nav.registry'), t('registry.meta'));
}

const when = (iso: string, locale: string) => new Date(iso).toLocaleString(locale, { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';
const shown = (url: string) => url.replace(/^https:\/\/(doi\.org|arxiv\.org\/abs)\//, (_, h) => (h === 'doi.org' ? 'doi:' : 'arXiv:'));

function Certificate({ x, g }: { x: Ctx; g: Registration }) {
  const { t, r, locale } = x;
  const badge = `[![CISS registered](${SITE_URL}/badge/registration/${g.id}.svg)](${SITE_URL}/${locale}/registry/#${g.id})`;
  const codeUrl = g.code && `https://github.com/${g.code.repo}/${g.code.path ? `blob/${g.code.commit}/${g.code.path}` : `tree/${g.code.commit}`}`;
  return (
    <article className="cert" id={g.id}>
      <header>
        <span className="cert-id">{g.id}</span>
        <h3>{g.name}</h3>
        <FieldTag x={x} field={g.field} />
      </header>
      <p className="measure">{g.summary}</p>
      <dl className="cert-dl">
        <dt>{t('registry.cert.registrant')}</dt>
        <dd><a href={`https://github.com/${g.registrant.login}`} target="_blank" rel="noopener noreferrer">@{g.registrant.login}</a> <span className="muted">(GitHub id {g.registrant.id})</span></dd>
        <dt>{t('registry.cert.registeredAt')}</dt><dd>{when(g.registeredAt, locale)}</dd>
        <dt>{t('registry.cert.certifiedAt')}</dt><dd>{when(g.certifiedAt, locale)}</dd>
        <dt>{t('registry.cert.designers')}</dt><dd>{g.authors.join(', ')}</dd>
        {g.code && <><dt>{t('registry.cert.code')}</dt><dd><a href={codeUrl} target="_blank" rel="noopener noreferrer">{g.code.repo}@{g.code.commit.slice(0, 12)}{g.code.path && <span className="path">/{g.code.path}</span>}</a>
          {g.code.sha256 && <code className="hash">sha256 {g.code.sha256}</code>}</dd></>}
        {g.sources.length > 0 && <><dt>{t('registry.cert.sources')}</dt><dd>{g.sources.map((s) => (
          <span key={s.url} className="cert-src"><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title ?? shown(s.url)}</a>{s.check && <span className="chk"> ✓ {s.check}</span>}</span>
        ))}</dd></>}
        {g.parents.length > 0 && <><dt>{t('registry.cert.parents')}</dt><dd>{g.parents.map((p) => (
          <span key={p.slug} className="cert-src">{r.algo.has(p.slug) ? <AlgoRef x={x} a={r.algo.get(p.slug)!} /> : p.slug} <span className="etype">{t(`type.${p.type}`)}</span>{p.note && <span className="muted"> — {p.note}</span>}</span>
        ))}</dd></>}
        {g.license && <><dt>{t('registry.cert.license')}</dt><dd>{g.license}</dd></>}
        <dt>{t('registry.cert.issue')}</dt><dd><a href={`https://github.com/${ISSUES_REPO}/issues/${g.issue}`} target="_blank" rel="noopener noreferrer">{ISSUES_REPO}#{g.issue}</a></dd>
      </dl>
      <div className="badge-box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="badge-img" src={withBase(`/badge/registration/${g.id}.svg`)} alt={`CISS registered: ${g.id}`} height={20} />
        <CopyField label="Markdown" value={badge} />
      </div>
    </article>
  );
}

export default async function RegistryPage({ params }: Props) {
  const x = ctx((await params).locale);
  const { t, href, locale } = x;
  const regs = [...REGISTRATIONS].sort((a, b) => b.id.localeCompare(a.id));
  return (
    <div className="wrap page">
      <h1 className="display">{t('nav.registry')}</h1>
      <p className="lede measure">{t('registry.lede')}</p>
      <p><Link className="btn" href={href('/register')}>{t('registry.cta')}</Link></p>
      <Section id="how" title={t('registry.how')}>
        <ol className="steps">{(['step1', 'step2', 'step3', 'step4'] as const).map((s) => <li key={s}>{t(`registry.${s}`)}</li>)}</ol>
        <p className="hint cert-note">{t('registry.disclaimer')}</p>
      </Section>
      <Section id="certified" title={t('registry.certified', { n: regs.length })}>
        {regs.length ? regs.map((g) => <Certificate key={g.id} x={x} g={g} />) : <Empty>{t('registry.none')}</Empty>}
      </Section>
      <Section id="pending" title={t('registry.pending')}>
        <PendingRegistrations locale={locale} l={{ none: t('registry.pendingNone'), error: t('registry.pendingError'), loading: t('common.loading'),
          passed: t('registry.status.passed'), failed: t('registry.status.failed'), waiting: t('registry.status.waiting') }} />
      </Section>
    </div>
  );
}
