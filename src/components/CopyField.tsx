'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n/client';

export default function CopyField({ label, value }: { label: string; value: string }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  return (
    <div className="snippet">
      <div className="snippet-h">
        <span>{label}</span>
        <button type="button" className="linkbtn" onClick={async () => {
          try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* clipboard blocked */ }
        }}>{done ? t('copy.done') : t('copy.action')}</button>
      </div>
      <pre><code>{value}</code></pre>
    </div>
  );
}
