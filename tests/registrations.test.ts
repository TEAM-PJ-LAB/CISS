import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { checksComment, runChecks, type Fetch } from '@/lib/registry-checks';
import { draftFromForm, FORM, issueFormUrl, nextId, normalizeSource, parseGitHubCode, parseIssueForm, parseParent, slugify } from '@/lib/registrations';

/** GitHub 이슈 폼이 만드는 본문과 같은 모양. */
const body = (v: Partial<Record<keyof typeof FORM, string>>) => Object.entries(FORM)
  .map(([k, label]) => `### ${label}\n\n${v[k as keyof typeof FORM] ?? '_No response_'}`).join('\n\n');
const good = {
  name: 'Radix Dijkstra', field: 'graph', summary: 'Single-source shortest paths with a monotone radix heap keyed by distance.',
  authors: 'Ada Lovelace\nAlan Turing', sources: 'doi:10.1145/77600.77615\nhttps://arxiv.org/abs/1805.04154v2',
  code: 'https://github.com/octo/radix/blob/main/src/radix.py', parents: 'dijkstra: optimization: radix heap\nradix-sort',
  license: 'MIT', consent: '- [X] I am one of the designers',
};

describe('registration form parsing', () => {
  it('splits an issue-form body into fields and treats _No response_ as empty', () => {
    const f = parseIssueForm(body({ ...good, slug: undefined }));
    expect(f.name).toBe('Radix Dijkstra');
    expect(f.slug).toBe('');
    expect(f.authors).toBe('Ada Lovelace\nAlan Turing');
  });
  it('normalizes DOIs, arXiv ids and URLs, and rejects other text', () => {
    expect(normalizeSource('doi:10.1145/77600.77615')).toBe('https://doi.org/10.1145/77600.77615');
    expect(normalizeSource('10.1145/77600.77615')).toBe('https://doi.org/10.1145/77600.77615');
    expect(normalizeSource('https://arxiv.org/pdf/1805.04154v2.pdf')).toBe('https://arxiv.org/abs/1805.04154');
    expect(normalizeSource('arXiv:1805.04154')).toBe('https://arxiv.org/abs/1805.04154');
    expect(normalizeSource('see my blog')).toBeNull();
  });
  it('reads GitHub repository, tree and blob URLs only', () => {
    expect(parseGitHubCode('https://github.com/octo/radix')).toEqual({ repo: 'octo/radix' });
    expect(parseGitHubCode('https://github.com/octo/radix/blob/v1.2/src/a/b.py')).toEqual({ repo: 'octo/radix', ref: 'v1.2', path: 'src/a/b.py' });
    expect(parseGitHubCode('https://github.com/octo/radix/tree/main')).toEqual({ repo: 'octo/radix', ref: 'main' });
    expect(parseGitHubCode('https://gitlab.com/octo/radix')).toBeNull();
    expect(parseGitHubCode('https://github.com/octo/radix/issues/1')).toBeNull();
  });
  it('parses parent lines with an optional derivation type', () => {
    expect(parseParent('dijkstra: optimization: radix heap')).toEqual({ slug: 'dijkstra', type: 'optimization', note: 'radix heap' });
    expect(parseParent('radix-sort')).toEqual({ slug: 'radix-sort', type: 'variant' });
    expect(parseParent('Not a slug!')).toBeNull();
  });
  it('builds a draft and derives the slug', () => {
    const { draft, errors } = draftFromForm(parseIssueForm(body(good)), new Set(['dijkstra']));
    expect(errors).toEqual({});
    expect(draft).toMatchObject({ slug: 'radix-dijkstra', field: 'graph', authors: ['Ada Lovelace', 'Alan Turing'], consent: true, license: 'MIT',
      sources: ['https://doi.org/10.1145/77600.77615', 'https://arxiv.org/abs/1805.04154'], code: { repo: 'octo/radix', ref: 'main', path: 'src/radix.py' } });
    expect(draft.parents).toHaveLength(2);
    expect(slugify('Ünïcode   Sort’s v2!')).toBe('unicode-sorts-v2');
  });
  it('reports every invalid field', () => {
    const { errors } = draftFromForm(parseIssueForm(body({ name: 'x', slug: 'dijkstra', field: 'cooking', summary: 'short', sources: 'nope', code: 'https://example.com', parents: '??', consent: '- [ ] no' })), new Set(['dijkstra']));
    expect(Object.keys(errors).sort()).toEqual(['authors', 'code', 'consent', 'field', 'parents', 'slug', 'sources', 'summary']);
  });
  it('numbers certificates per year', () => {
    expect(nextId([], 2026)).toBe('CISS-2026-0001');
    expect(nextId([{ id: 'CISS-2026-0007' }, { id: 'CISS-2025-0099' }], 2026)).toBe('CISS-2026-0008');
  });
  it('pre-fills the GitHub issue form by field id', () => {
    const u = new URL(issueFormUrl('TEAM-PJ-LAB/CISS', { name: 'Radix Dijkstra', field: 'graph', summary: '' }));
    expect(u.pathname).toBe('/TEAM-PJ-LAB/CISS/issues/new');
    expect(u.searchParams.get('template')).toBe('register-algorithm.yml');
    expect(u.searchParams.get('field')).toBe('graph');
    expect(u.searchParams.has('summary')).toBe(false);
  });
});

describe('registry bot checks', () => {
  const file = Buffer.from('def radix(): pass\n');
  const json = (x: unknown, status = 200) => new Response(JSON.stringify(x), { status, headers: { 'Content-Type': 'application/json' } });
  const gh: Fetch = async (p) => {
    if (p === '/repos/octo/radix') return json({ full_name: 'octo/radix', private: false, default_branch: 'main', owner: { login: 'octo', type: 'User' } });
    if (p.startsWith('/repos/octo/radix/commits/')) return json({ sha: 'a'.repeat(40) });
    if (p.startsWith('/repos/octo/radix/contributors')) return json([{ login: 'octo' }, { login: 'ada' }]);
    return json({}, 404);
  };
  const net: Fetch = async (u) => {
    if (u.startsWith('https://api.crossref.org/works/')) return json({ message: { title: ['Faster algorithms for the shortest path problem'] } });
    if (u.startsWith('https://export.arxiv.org/')) return new Response('<feed><entry><title>Nearly-Optimal Mergesorts</title></entry></feed>');
    if (u === `https://raw.githubusercontent.com/octo/radix/${'a'.repeat(40)}/src/radix.py`) return new Response(file);
    return new Response('', { status: 404 });
  };
  const { draft } = draftFromForm(parseIssueForm(body(good)), new Set());

  it('passes for a contributor, pins the commit and hashes the file', async () => {
    const res = await runChecks(draft, 'ada', new Set(['dijkstra', 'radix-sort']), gh, net);
    expect(res.passed).toBe(true);
    expect(res.code).toEqual({ repo: 'octo/radix', commit: 'a'.repeat(40), path: 'src/radix.py', sha256: createHash('sha256').update(file).digest('hex') });
    expect(res.sources.map((s) => s.check)).toEqual(['Crossref', 'arXiv']);
    expect(checksComment({}, res, draft.slug)).toContain('passed ✅');
  });
  it('fails when the registrant has no tie to the repository or a parent is unknown', async () => {
    const res = await runChecks(draft, 'mallory', new Set(['dijkstra']), gh, net);
    expect(res.passed).toBe(false);
    expect(res.checks.filter((c) => !c.ok).map((c) => c.id).sort()).toEqual(['code.registrant', 'parent']);
    expect(checksComment({}, res, draft.slug)).toContain('needs changes ❌');
  });
  it('fails for unregistered DOIs and private repositories', async () => {
    const res = await runChecks({ ...draft, sources: ['https://doi.org/10.9999/nothing'], parents: [] }, 'octo', new Set(),
      async (p) => (p === '/repos/octo/radix' ? json({ full_name: 'octo/radix', private: true, default_branch: 'main', owner: { login: 'octo', type: 'User' } }) : gh(p)),
      async (u) => (u.includes('crossref') || u.includes('datacite') ? new Response('', { status: 404 }) : net(u)));
    expect(res.checks.filter((c) => !c.ok).map((c) => c.id).sort()).toEqual(['code.repo', 'source']);
  });
});

describe('parent line formats', () => {
  it('accepts the parenthesised type and a free note without a type', () => {
    expect(parseParent('dijkstra (optimization) uses a heap')).toEqual({ slug: 'dijkstra', type: 'optimization', note: 'uses a heap' });
    expect(parseParent('dijkstra: uses a heap')).toEqual({ slug: 'dijkstra', type: 'variant', note: 'uses a heap' });
  });
});

describe('bot network guard', () => {
  it('refuses private and non-http source URLs', async () => {
    const { publicUrl } = await import('@/lib/registry-checks');
    for (const u of ['http://169.254.169.254/latest', 'http://localhost:8080/', 'http://[::1]/', 'ftp://example.com/x', 'http://metadata.google.internal/'])
      expect(publicUrl(u), u).toBe(false);
    expect(publicUrl('https://doi.org/10.1145/1')).toBe(true);
  });
});
