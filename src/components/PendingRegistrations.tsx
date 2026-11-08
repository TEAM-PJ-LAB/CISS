'use client';

import { useEffect, useState } from 'react';
import { REGISTER_LABEL } from '@/lib/registrations';
import { ISSUES_REPO } from '@/lib/runtime';

interface Issue { number: number; title: string; html_url: string; created_at: string; user: { login: string } | null; labels: { name: string }[] }
type L = Record<'none' | 'error' | 'loading' | 'passed' | 'failed' | 'waiting', string>;

/** 검토 중인 등록 신청 = 라벨 ciss:register가 붙은 열린 이슈 (GitHub 공개 API, 비인증). */
export default function PendingRegistrations({ l, locale }: { l: L; locale: string }) {
  const [rows, setRows] = useState<Issue[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(`https://api.github.com/repos/${ISSUES_REPO}/issues?labels=${encodeURIComponent(REGISTER_LABEL)}&state=open&per_page=50`, { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((xs: Issue[]) => setRows(xs.filter((x) => !('pull_request' in x))))
      .catch(() => setError(true));
  }, []);
  if (error) return <p className="empty">{l.error}</p>;
  if (!rows) return <p className="empty">{l.loading}</p>;
  if (!rows.length) return <p className="empty">{l.none}</p>;
  const status = (x: Issue) => {
    const n = x.labels.map((y) => y.name);
    return n.includes('ciss:checks-passed') ? ['ok', l.passed] : n.includes('ciss:checks-failed') ? ['err', l.failed] : ['muted', l.waiting];
  };
  return (
    <ul className="rows">
      {rows.map((x) => {
        const [cls, text] = status(x);
        return (
          <li key={x.number}>
            <a href={x.html_url} target="_blank" rel="noopener noreferrer">{x.title.replace(/^\[Register\]\s*/i, '') || `#${x.number}`}</a>
            <span className={cls}>{text}</span>
            <span className="meta">#{x.number} · @{x.user?.login ?? '?'} · {new Date(x.created_at).toLocaleDateString(locale)}</span>
          </li>
        );
      })}
    </ul>
  );
}
