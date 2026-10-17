import type { Metadata } from 'next';
import ScanForm from '@/components/ScanForm';
import { getT } from '@/i18n';
import type { Locale } from '@/i18n/config';
import { pageMeta } from '@/lib/meta';
import { WEIGHT } from '@/lib/scan/detect';

type Props = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ url?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  return pageMeta(locale, '/scan', t('nav.scan'), t('scan.meta'));
}

export default async function ScanPage({ params, searchParams }: Props) {
  const [{ locale }, { url }] = await Promise.all([params, searchParams]);
  const t = getT(locale);
  return (
    <div className="wrap page narrow">
      <h1 className="display">{t('nav.scan')}</h1>
      <p className="lede">{t('scan.lede')}</p>
      <ScanForm initial={url} />
      <section className="sect">
        <header><h2>{t('scan.howTitle')}</h2></header>
        <ul className="method">
          <li><b>{t('scan.kind.api')}</b> <span className="num">{WEIGHT.api}</span><p>{t('scan.how.api')}</p></li>
          <li><b>{t('scan.kind.dep')}</b> <span className="num">{WEIGHT.dep}</span><p>{t('scan.how.dep')}</p></li>
          <li><b>{t('scan.kind.decl')}</b> <span className="num">{WEIGHT.decl}</span><p>{t('scan.how.decl')}</p></li>
          <li><b>{t('scan.kind.mention')}</b> <span className="num">{WEIGHT.mention}</span><p>{t('scan.how.mention')}</p></li>
        </ul>
        <p className="small muted" style={{ marginTop: 16 }}>{t('scan.how.score')}</p>
      </section>
    </div>
  );
}
