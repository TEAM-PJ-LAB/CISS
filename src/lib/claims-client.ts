'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ClaimKind, ClaimStatus, PublicClaim } from './claims';
import { ISSUES_REPO, STATIC } from './runtime';

/** 정적 배포(GitHub Pages)에서는 GitHub 이슈가 접수·검수 저장소다. 본문의 마커로 CISS 요청을 식별한다. */
export type ClaimView = PublicClaim & { url?: string };
export const ISSUES_URL = `https://github.com/${ISSUES_REPO}/issues`;
const MARK = /<!--\s*ciss:(\{[^]*?\})\s*-->/;
/** 공백 단위로 URL을 뽑는다. SICI형 DOI처럼 괄호·꺾쇠가 든 URL을 자르지 않기 위해서다. */
const count = (w: string, c: string) => w.split(c).length - 1;
function cleanUrl(raw: string) {
  let w = raw.replace(/^[<(]+(?=https?:)/, '').replace(/[>,.;]+$/, '');
  while (w.endsWith(')') && count(w, '(') < count(w, ')')) w = w.slice(0, -1);
  return w;
}
const urls = (s: string) => s.split(/\s+/).map(cleanUrl).filter((w) => /^https?:\/\/\S+$/.test(w));
const MAX_URL = 7800;

export interface Draft { kind: ClaimKind; target: string; label: string; statement: string; evidence: string[] }

export function issueBody(d: Draft, statement = d.statement) {
  return [
    `<!-- ciss:${JSON.stringify({ kind: d.kind, target: d.target })} -->`,
    `**${d.kind}** · ${d.label} (\`${d.target}\`)`, '', '### Statement', statement, '', '### Evidence', ...d.evidence.map((e) => `- ${e}`),
  ].join('\n');
}

/** 너무 긴 본문은 URL 한도(약 8KB)를 넘으므로 자리표시자로 바꾸고 전체 본문은 클립보드로 넘긴다. */
export function issueUrl(d: Draft): { url: string; full?: string } {
  const title = `[CISS] ${d.kind}: ${d.label}`.slice(0, 120);
  const make = (body: string) => `${ISSUES_URL}/new?${new URLSearchParams({ title, body })}`;
  const url = make(issueBody(d));
  return url.length <= MAX_URL ? { url } : { url: make(issueBody(d, '(paste from clipboard)')), full: issueBody(d) };
}

interface GhIssue { number: number; html_url: string; state: 'open' | 'closed'; body: string | null; created_at: string; closed_at: string | null; user: { login: string } | null; labels: { name: string }[]; pull_request?: unknown }

export function parseIssue(i: GhIssue): ClaimView | null {
  const m = i.body?.match(MARK);
  if (!m || i.pull_request) return null;
  let meta: { kind?: string; target?: string };
  try { meta = JSON.parse(m[1]); } catch { return null; }
  if ((meta.kind !== 'claim' && meta.kind !== 'dispute') || typeof meta.target !== 'string') return null;
  const body = i.body!;
  const sec = (h: string) => body.split(new RegExp(`^###\\s+${h}\\s*$`, 'm'))[1]?.split(/^###\s/m)[0].trim() ?? '';
  const labels = i.labels.map((l) => l.name.toLowerCase());
  const status: ClaimStatus = i.state === 'open' ? 'pending' : labels.includes('accepted') ? 'accepted' : 'rejected';
  return {
    id: i.number, kind: meta.kind, target: meta.target, name: i.user?.login ?? '?',
    statement: sec('Statement') || body.replace(MARK, '').trim(), evidence: [...new Set(urls(sec('Evidence')))].slice(0, 5),
    status, resolution: null, createdAt: i.created_at, updatedAt: i.closed_at, url: i.html_url,
  };
}

let ghCache: Promise<ClaimView[]> | null = null;

async function load(): Promise<ClaimView[]> {
  if (!STATIC) {
    const r = await fetch('/api/claims?limit=500', { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()).claims;
  }
  ghCache ??= fetch(`https://api.github.com/repos/${ISSUES_REPO}/issues?state=all&per_page=100`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((xs: GhIssue[]) => xs.map(parseIssue).filter((x): x is ClaimView => !!x))
    .catch((e) => { ghCache = null; throw e; });
  return ghCache;
}

export function useClaims() {
  const [claims, setClaims] = useState<ClaimView[] | null>(null);
  const [error, setError] = useState(false);
  const reload = useCallback(() => { setError(false); load().then(setClaims).catch(() => setError(true)); }, []);
  useEffect(reload, [reload]);
  return { claims, error, reload };
}
