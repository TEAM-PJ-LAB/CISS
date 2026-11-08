import type { Metadata } from 'next';
import Link from '@/components/AppLink';
import RegisterForm from '@/components/RegisterForm';
import { Section } from '@/components/ui';
import { FIELDS } from '@/data/types';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { ctx } from '@/lib/ctx';
import { pageMeta } from '@/lib/meta';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/register', t('registry.cta'), t('register.meta'));
}

export default async function Register({ params }: Props) {
  const { t, href } = ctx((await params).locale);
  const l = {
    name: t('register.f.name'), slug: t('register.f.slug'), slugHint: t('register.f.slugHint'), field: t('register.f.field'),
    summary: t('register.f.summary'), summaryHint: t('register.f.summaryHint'), authors: t('register.f.authors'), authorsHint: t('register.f.authorsHint'),
    sources: t('register.f.sources'), sourcesHint: t('register.f.sourcesHint'), code: t('register.f.code'), codeHint: t('register.f.codeHint'),
    parents: t('register.f.parents'), parentsHint: t('register.f.parentsHint'), license: t('register.f.license'), submit: t('register.submit'),
    opened: t('register.opened'), copied: t('register.copied'), invalid: t('register.invalid'), github: t('register.github'),
  };
  return (
    <div className="wrap page narrow">
      <p className="crumb"><Link href={href('/registry')}>{t('nav.registry')}</Link></p>
      <h1 className="display">{t('registry.cta')}</h1>
      <p className="lede">{t('register.lede')}</p>
      <ol className="steps">
        {(['step1', 'step2', 'step3', 'step4'] as const).map((s) => <li key={s}>{t(`registry.${s}`)}</li>)}
      </ol>
      <RegisterForm l={l} fields={FIELDS.map((f) => ({ value: f, label: t(`field.${f}`) }))} />
      <p className="hint cert-note">{t('registry.disclaimer')}</p>
      <Section id="wiki" title={t('register.wikiTitle')}>
        <p className="measure">{t('register.wikiBody')}</p>
      </Section>
    </div>
  );
}
