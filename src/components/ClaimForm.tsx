'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n/client';
import { issueUrl } from '@/lib/claims-client';
import { STATIC } from '@/lib/runtime';

type Opt = { value: string; label: string };
export type TargetOptions = { algorithm: Opt[]; derivation: Opt[]; author: Opt[] };
const TYPES = ['algorithm', 'derivation', 'author'] as const;
type T = (typeof TYPES)[number];

const URL_RE = /^https?:\/\/\S+$/;

/** 정적 배포용 검증. 서버 모드는 validateClaim(서버)이 최종 판정한다. */
function check(target: string, statement: string, evidence: string[]) {
  const e: Record<string, string> = {};
  if (!target) e.target = 'invalid';
  if (statement.length < 20 || statement.length > 4000) e.statement = 'invalid';
  if (!evidence.length || evidence.length > 5 || !evidence.every((u) => URL_RE.test(u))) e.evidence = 'invalid';
  return e;
}

export default function ClaimForm({ options, initial, onSubmitted }: { options: TargetOptions; initial?: string; onSubmitted?: () => void }) {
  const { t } = useI18n();
  const initType = initial?.split(':')[0] as T;
  const [type, setType] = useState<T>(TYPES.includes(initType) ? initType : 'algorithm');
  const [target, setTarget] = useState(initial ?? '');
  const [kind, setKind] = useState<'claim' | 'dispute'>('dispute');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(form: HTMLFormElement) {
    setBusy(true); setErrors({}); setMsg(null);
    const f = new FormData(form);
    if (STATIC) {
      const statement = String(f.get('statement') ?? '').trim();
      const evidence = String(f.get('evidence') ?? '').split(/\s+/).filter(Boolean);
      const bad = check(target, statement, evidence);
      setBusy(false);
      if (Object.keys(bad).length) { setErrors(bad); setMsg({ ok: false, text: t('claimForm.invalid') }); return; }
      const label = Object.values(options).flat().find((o) => o.value === target)?.label ?? target;
      const { url, full } = issueUrl({ kind, target, label, statement, evidence });
      if (full) await navigator.clipboard?.writeText(full).catch(() => undefined);
      window.open(url, '_blank', 'noopener');
      setMsg({ ok: true, text: t(full ? 'claimForm.copied' : 'claimForm.opened') });
      return;
    }
    try {
      const res = await fetch('/api/claims', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, target, name: f.get('name'), contact: f.get('contact'), statement: f.get('statement'), evidence: String(f.get('evidence') ?? '') }),
      });
      const data = await res.json();
      if (res.ok) {
        form.reset(); setTarget('');
        setMsg({ ok: true, text: t('claimForm.success', { id: data.claim.id }) });
        onSubmitted?.();
      } else {
        setErrors(data.fields ?? {});
        setMsg({ ok: false, text: res.status === 429 ? t('claimForm.tooMany') : t('claimForm.invalid') });
      }
    } catch {
      setMsg({ ok: false, text: t('claimForm.network') });
    } finally { setBusy(false); }
  }

  const err = (k: string) => errors[k] && <p className="err" id={`e-${k}`}>{t(`claimForm.err.${k}` as Parameters<typeof t>[0])}</p>;

  return (
    <form className="grid-form" onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }} noValidate>
      <fieldset className="full seg">
        <legend className="label">{t('claimForm.kind')}</legend>
        {(['dispute', 'claim'] as const).map((k) => (
          <label key={k} className={kind === k ? 'on' : undefined}>
            <input type="radio" name="kind" checked={kind === k} onChange={() => setKind(k)} />
            <b>{t(`claim.kind.${k}`)}</b><span>{t(`claimForm.kindHint.${k}`)}</span>
          </label>
        ))}
      </fieldset>
      <div>
        <label className="label" htmlFor="ttype">{t('claimForm.targetType')}</label>
        <select id="ttype" className="select" value={type} onChange={(e) => { setType(e.target.value as T); setTarget(''); }}>
          {TYPES.map((x) => <option key={x} value={x}>{t(`claimForm.type.${x}`)}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="target">{t('claimForm.target')}</label>
        <select id="target" className="select" value={target} onChange={(e) => setTarget(e.target.value)} aria-describedby="e-target" required>
          <option value="">{t('claimForm.choose')}</option>
          {options[type].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {err('target')}
      </div>
      {!STATIC && <><div>
        <label className="label" htmlFor="name">{t('claimForm.name')}</label>
        <input id="name" name="name" className="input" maxLength={80} required aria-describedby="e-name" autoComplete="nickname" />
        {err('name')}
      </div>
      <div>
        <label className="label" htmlFor="contact">{t('claimForm.contact')}</label>
        <input id="contact" name="contact" className="input" maxLength={200} aria-describedby="h-contact e-contact" autoComplete="email" />
        <p className="hint" id="h-contact">{t('claimForm.contactHint')}</p>
        {err('contact')}
      </div></>}
      <div className="full">
        <label className="label" htmlFor="statement">{t('claimForm.statement')}</label>
        <textarea id="statement" name="statement" className="textarea" maxLength={4000} required aria-describedby="e-statement" placeholder={t('claimForm.statementPh')} />
        {err('statement')}
      </div>
      <div className="full">
        <label className="label" htmlFor="evidence">{t('claimForm.evidence')}</label>
        <textarea id="evidence" name="evidence" className="textarea short" required aria-describedby="h-evidence e-evidence" placeholder="https://doi.org/…  https://github.com/…/commit/…" />
        <p className="hint" id="h-evidence">{t('claimForm.evidenceHint')}</p>
        {err('evidence')}
      </div>
      <div className="full row">
        <button className="btn" disabled={busy}>{busy ? t('claimForm.submitting') : STATIC ? t('claimForm.openIssue') : t(`claimForm.submit.${kind}`)}</button>
        {STATIC && <p className="hint">{t('claimForm.githubHint')}</p>}
        {msg && <p className={msg.ok ? 'ok' : 'err'} role="status">{msg.text}</p>}
      </div>
    </form>
  );
}
