import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { registry } from '@/lib/registry';
import { scan, ScanError, type ScanReport } from '@/lib/scan';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const TTL = 6 * 3600_000;
const STATUS = { bad_input: 400, not_found: 404, no_repository: 422, rate_limited: 429, too_large: 413, upstream: 502 } as const;

/** 탐지 결과에 원작자·점수를 붙여 반환 (PRD §6.2 "원작자 목록 리포트"). */
function enrich(report: ScanReport) {
  const r = registry();
  return {
    ...report,
    findings: report.findings.filter((f) => r.algo.has(f.slug)).map((f) => {
      const a = r.algo.get(f.slug)!;
      const authors = [...new Set(a.origins.flatMap((o) => o.authors))];
      return { ...f, name: a.name, field: a.field, year: r.yearOf(a.slug), score: r.credit.get(a.slug)!.score,
        authors: authors.map((s) => ({ slug: s, name: r.author.get(s)?.name ?? s })) };
    }),
  };
}

async function run(req: Request, input: string | null, fresh: boolean) {
  if (!input?.trim() || input.length > 300) return NextResponse.json({ error: 'bad_input', message: 'Provide ?url= or {"url": "..."}' }, { status: 400 });
  const key = input.trim().toLowerCase().replace(/\/+$/, '').replace(/^https?:\/\/(www\.)?/, '');
  const db = getDb();
  const cached = !fresh && db.prepare('SELECT report, created_at FROM scans WHERE key = ?').get(key) as { report: string; created_at: number } | undefined;
  if (cached && Date.now() - cached.created_at < TTL) return NextResponse.json({ ...enrich(JSON.parse(cached.report)), cached: true });

  const rl = rateLimit(`scan:${clientKey(req)}`, 6, 3);
  if (!rl.ok) return NextResponse.json({ error: 'rate_limited', message: 'Too many scans. Retry later.' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } });
  try {
    const report = await scan(input, { tokens: { github: process.env.GITHUB_TOKEN, gitlab: process.env.GITLAB_TOKEN, bitbucket: process.env.BITBUCKET_TOKEN } });
    db.prepare('INSERT OR REPLACE INTO scans (key, report, created_at) VALUES (?, ?, ?)').run(key, JSON.stringify(report), Date.now());
    return NextResponse.json({ ...enrich(report), cached: false });
  } catch (e) {
    if (e instanceof ScanError) return NextResponse.json({ error: e.code, message: e.message }, { status: STATUS[e.code] });
    return NextResponse.json({ error: 'upstream', message: e instanceof Error ? e.message : 'Scan failed' }, { status: 502 });
  }
}

export const GET = (req: Request) => {
  const p = new URL(req.url).searchParams;
  return run(req, p.get('url'), p.get('fresh') === '1');
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { url?: string; fresh?: boolean };
  return run(req, body.url ?? null, Boolean(body.fresh));
}
