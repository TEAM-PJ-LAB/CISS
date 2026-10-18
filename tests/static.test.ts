import { describe, expect, it } from 'vitest';
import { badgeFor } from '@/lib/badge';
import { issueBody, issueUrl, parseIssue } from '@/lib/claims-client';
import { registry } from '@/lib/registry';
import { buildSearchIndex, search } from '@/lib/search';
import { searchIndex } from '@/lib/search-core';

const draft = { kind: 'dispute' as const, target: 'derivation:quicksort>introsort', label: 'Quicksort → Introsort', statement: 'Introsort was described by Musser in 1997 as a hybrid.', evidence: ['https://doi.org/10.1002/(SICI)1097-024X(199708)27:8<983::AID-SPE117>3.0.CO;2-%23'] };
const issue = (over: Record<string, unknown> = {}) => ({
  number: 7, html_url: 'https://github.com/o/r/issues/7', state: 'open', body: issueBody(draft), created_at: '2026-10-01T00:00:00Z', closed_at: null, user: { login: 'octocat' }, labels: [], ...over,
}) as Parameters<typeof parseIssue>[0];

describe('GitHub issue claims (static mode)', () => {
  it('round-trips a draft through the issue body', () => {
    const c = parseIssue(issue())!;
    expect(c).toMatchObject({ id: 7, kind: 'dispute', target: draft.target, name: 'octocat', statement: draft.statement, status: 'pending', url: 'https://github.com/o/r/issues/7' });
    expect(c.evidence).toEqual(draft.evidence);
  });
  it('keeps balanced parentheses and drops wrapping punctuation in evidence URLs', () => {
    const body = issueBody({ ...draft, evidence: [] }) + '\n- https://en.wikipedia.org/wiki/Sort_(C%2B%2B)\n(see https://example.org/a).\n<https://example.org/b>';
    expect(parseIssue(issue({ body }))!.evidence).toEqual(['https://en.wikipedia.org/wiki/Sort_(C%2B%2B)', 'https://example.org/a', 'https://example.org/b']);
  });
  it('maps issue state and labels to claim status', () => {
    expect(parseIssue(issue({ state: 'closed', labels: [{ name: 'Accepted' }] }))!.status).toBe('accepted');
    expect(parseIssue(issue({ state: 'closed' }))!.status).toBe('rejected');
  });
  it('ignores pull requests, unmarked issues and malformed markers', () => {
    expect(parseIssue(issue({ pull_request: {} }))).toBeNull();
    expect(parseIssue(issue({ body: 'plain bug report' }))).toBeNull();
    expect(parseIssue(issue({ body: '<!-- ciss:{"kind":"x","target":"a"} -->' }))).toBeNull();
    expect(parseIssue(issue({ body: '<!-- ciss:{oops} -->' }))).toBeNull();
  });
  it('keeps the new-issue URL under the length limit and hands long text to the clipboard', () => {
    const short = issueUrl(draft);
    expect(short.full).toBeUndefined();
    expect(new URL(short.url).searchParams.get('body')).toBe(issueBody(draft));
    const long = issueUrl({ ...draft, statement: '가'.repeat(4000) });
    expect(long.url.length).toBeLessThanOrEqual(7800);
    expect(long.full).toContain('가'.repeat(4000));
  });
});

describe('static export payloads', () => {
  const r = registry();
  it('browser search over the exported index matches server search', () => {
    for (const l of ['ko', 'en', 'ja', 'zh'] as const) {
      const idx = JSON.parse(JSON.stringify(buildSearchIndex(r, l)));
      for (const q of ['dijkstra', '퀵', 'クイック', '排序', 'hoare', 'graphics']) expect(searchIndex(idx, q, 20)).toEqual(search(r, q, 20, l));
    }
  });
  it('builds a badge for every algorithm and author, and none for unknown slugs', () => {
    for (const a of r.algorithms) expect(badgeFor(r, 'algorithm', a.slug)).toMatch(/^<svg/);
    for (const s of r.authorCredit.keys()) expect(badgeFor(r, 'author', s)).toMatch(/^<svg/);
    expect(badgeFor(r, 'algorithm', 'nope')).toBeNull();
    expect(badgeFor(r, 'other', 'quicksort')).toBeNull();
  });
});
