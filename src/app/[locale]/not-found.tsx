'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n/client';

export default function NotFound() {
  const { t, href } = useI18n();
  return (
    <div className="wrap page">
      <p className="crumb">404</p>
      <h1 className="display">{t('notFound.title')}</h1>
      <p className="lede">{t('notFound.body')}</p>
      <p style={{ marginTop: 24 }}><Link className="btn" href={href('/algorithms')}>{t('notFound.cta')}</Link></p>
    </div>
  );
}
