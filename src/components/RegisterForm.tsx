'use client';

import { useState } from 'react';
import { issueFormUrl } from '@/lib/registrations';
import { ISSUES_REPO } from '@/lib/runtime';

type L = Record<'name' | 'slug' | 'slugHint' | 'field' | 'summary' | 'summaryHint' | 'authors' | 'authorsHint' | 'sources' | 'sourcesHint'
  | 'code' | 'codeHint' | 'parents' | 'parentsHint' | 'license' | 'submit' | 'opened' | 'copied' | 'invalid' | 'github', string>;

const MAX_URL = 7800;
const GH = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/(blob|tree)\/\S+)?\/?$/;

/** 사이트 안에서 쓰고 GitHub 이슈 폼으로 넘긴다. 최종 검사는 registry-bot이 한다. 문구는 서버에서 받는다(클라이언트 사전 크기 절약). */
export default function RegisterForm({ l, fields }: { l: L; fields: { value: string; label: string }[] }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(form: HTMLFormElement) {
    const f = new FormData(form);
    const v = Object.fromEntries(['name', 'slug', 'field', 'summary', 'authors', 'sources', 'code', 'parents', 'license'].map((k) => [k, String(f.get(k) ?? '').trim()]));
    const ok = v.name && v.field && v.summary.length >= 40 && v.authors && (v.sources || v.code) && (!v.code || GH.test(v.code));
    if (!ok) { setMsg({ ok: false, text: l.invalid }); return; }
    let url = issueFormUrl(ISSUES_REPO, v);
    let copied = false;
    if (url.length > MAX_URL) {
      url = issueFormUrl(ISSUES_REPO, { ...v, summary: '' });
      copied = !!(await navigator.clipboard?.writeText(v.summary).then(() => true).catch(() => false));
    }
    window.open(url, '_blank', 'noopener');
    setMsg({ ok: true, text: copied ? l.copied : l.opened });
  }

  const area = (id: string, label: string, hint?: string, short = false, req = false) => (
    <div className="full">
      <label className="label" htmlFor={`r-${id}`}>{label}</label>
      <textarea id={`r-${id}`} name={id} className={`textarea${short ? ' short' : ''}`} required={req} aria-describedby={hint ? `h-${id}` : undefined} />
      {hint && <p className="hint" id={`h-${id}`}>{hint}</p>}
    </div>
  );

  return (
    <form className="grid-form" onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }} noValidate>
      <div>
        <label className="label" htmlFor="r-name">{l.name}</label>
        <input id="r-name" name="name" className="input" maxLength={120} required />
      </div>
      <div>
        <label className="label" htmlFor="r-field">{l.field}</label>
        <select id="r-field" name="field" className="select" required defaultValue="">
          <option value="" disabled>—</option>
          {fields.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="r-slug">{l.slug}</label>
        <input id="r-slug" name="slug" className="input" maxLength={60} pattern="[a-z0-9]+(-[a-z0-9]+)*" aria-describedby="h-slug" />
        <p className="hint" id="h-slug">{l.slugHint}</p>
      </div>
      <div>
        <label className="label" htmlFor="r-license">{l.license}</label>
        <input id="r-license" name="license" className="input" maxLength={60} placeholder="MIT" />
      </div>
      {area('summary', l.summary, l.summaryHint, false, true)}
      {area('authors', l.authors, l.authorsHint, true, true)}
      {area('sources', l.sources, l.sourcesHint, true)}
      <div className="full">
        <label className="label" htmlFor="r-code">{l.code}</label>
        <input id="r-code" name="code" className="input" type="url" placeholder="https://github.com/owner/repo/blob/main/src/algo.py" aria-describedby="h-code" />
        <p className="hint" id="h-code">{l.codeHint}</p>
      </div>
      {area('parents', l.parents, l.parentsHint, true)}
      <div className="full row">
        <button className="btn">{l.submit}</button>
        <p className="hint">{l.github}</p>
        {msg && <p className={msg.ok ? 'ok' : 'err'} role="status">{msg.text}</p>}
      </div>
    </form>
  );
}
