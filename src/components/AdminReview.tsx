'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/client';

const KEY = 'ciss-admin-token';

export default function AdminReview({ id, onDone }: { id: number; onDone?: () => void }) {
  const router = useRouter();
  const { t } = useI18n();
  const [token, setToken] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => { try { setToken(sessionStorage.getItem(KEY) ?? ''); } catch { /* storage blocked */ } }, []);

  async function decide(status: 'accepted' | 'rejected') {
    setMsg('');
    try { sessionStorage.setItem(KEY, token); } catch { /* storage blocked */ }
    const res = await fetch(`/api/claims/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, resolution: note }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { if (onDone) onDone(); else router.refresh(); }
    else setMsg(res.status === 401 ? t('admin.unauthorized') : res.status === 503 ? t('admin.disabled') : (data.error ?? t('admin.failed')));
  }

  return (
    <details className="admin">
      <summary>{t('admin.title')}</summary>
      <div className="admin-b">
        <input className="input" type="password" placeholder={t('admin.token')} value={token} onChange={(e) => setToken(e.target.value)} aria-label={t('admin.token')} />
        <input className="input" placeholder={t('admin.note')} value={note} onChange={(e) => setNote(e.target.value)} aria-label={t('admin.note')} />
        <div className="row">
          <button type="button" className="btn" onClick={() => decide('accepted')} disabled={!token || !note.trim()}>{t('admin.accept')}</button>
          <button type="button" className="btn ghost" onClick={() => decide('rejected')} disabled={!token || !note.trim()}>{t('admin.reject')}</button>
        </div>
        {msg && <p className="err" role="alert">{msg}</p>}
      </div>
    </details>
  );
}
