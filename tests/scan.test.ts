import { describe, expect, it } from 'vitest';
import { detect, parseDeps } from '@/lib/scan/detect';
import { scan, selectFiles } from '@/lib/scan';
import { parseTarget, repoFromUrl } from '@/lib/scan/sources';

const slugs = (fs: { path: string; text: string }[]) => detect(fs).map((f) => f.slug);

describe('target parsing (GitHub · GitLab · Bitbucket · npm · PyPI)', () => {
  it.each([
    ['https://github.com/python/cpython', { host: 'github', path: 'python/cpython' }],
    ['github.com/orlp/pdqsort/tree/master', { host: 'github', path: 'orlp/pdqsort', ref: 'master' }],
    ['https://github.com/facebook/zstd.git', { host: 'github', path: 'facebook/zstd' }],
    ['torvalds/linux', { host: 'github', path: 'torvalds/linux' }],
    ['https://gitlab.com/inkscape/inkscape', { host: 'gitlab', path: 'inkscape/inkscape' }],
    ['https://gitlab.com/group/sub/proj/-/tree/dev', { host: 'gitlab', path: 'group/sub/proj', ref: 'dev' }],
    ['https://bitbucket.org/team/repo/src/main/', { host: 'bitbucket', path: 'team/repo', ref: 'main' }],
  ])('%s', (input, repo) => expect(parseTarget(input)).toEqual({ kind: 'repo', repo }));
  it('parses package specifiers', () => {
    expect(parseTarget('npm:@noble/hashes')).toEqual({ kind: 'npm', name: '@noble/hashes' });
    expect(parseTarget('https://www.npmjs.com/package/fflate')).toEqual({ kind: 'npm', name: 'fflate' });
    expect(parseTarget('pypi:networkx')).toEqual({ kind: 'pypi', name: 'networkx' });
    expect(parseTarget('https://pypi.org/project/numpy/')).toEqual({ kind: 'pypi', name: 'numpy' });
  });
  it('rejects unsupported input', () => expect(() => parseTarget('https://example.com/x')).toThrow(/Unsupported/));
  it('normalizes repository URLs from registries', () => {
    expect(repoFromUrl('git+https://github.com/101arrowz/fflate.git')).toEqual({ host: 'github', path: '101arrowz/fflate' });
    expect(repoFromUrl('git@github.com:owner/repo.git')).toEqual({ host: 'github', path: 'owner/repo' });
    expect(repoFromUrl('github:owner/repo')).toEqual({ host: 'github', path: 'owner/repo' });
    expect(repoFromUrl('https://example.org')).toBeNull();
  });
});

describe('manifest parsing', () => {
  it('reads dependencies from common manifests', () => {
    expect(parseDeps('package.json', '{"dependencies":{"bcrypt":"^5"},"devDependencies":{"vitest":"1"}}').map((d) => d.name)).toEqual(['bcrypt', 'vitest']);
    expect(parseDeps('requirements.txt', '# c\nxgboost==2.0\nnumpy>=1\n-r other.txt').map((d) => d.name)).toEqual(['xgboost', 'numpy']);
    expect(parseDeps('pyproject.toml', '[project]\ndependencies = [\n  "lightgbm>=4",\n  "peft",\n]\n[tool.poetry.dependencies]\npython = "^3.11"\nargon2-cffi = "*"').map((d) => d.name)).toEqual(['lightgbm', 'peft', 'argon2-cffi']);
    expect(parseDeps('go.mod', 'module x\nrequire (\n\tgithub.com/hashicorp/raft v1.6.0\n)').map((d) => d.name)).toEqual(['github.com/hashicorp/raft']);
    expect(parseDeps('Cargo.toml', '[package]\nname = "x"\n[dependencies]\nblake3 = "1"').map((d) => d.name)).toEqual(['blake3']);
    expect(parseDeps('Game.csproj', '<PackageReference Include="SimplexNoise" Version="2" />').map((d) => d.name)).toEqual(['simplexnoise']);
  });
});

describe('detection', () => {
  it('detects library calls as strong evidence', () => {
    const f = detect([{ path: 'train.py', text: 'import torch\nopt = torch.optim.AdamW(model.parameters())\nlstm = nn.LSTM(10, 20)' }]);
    expect(f.map((x) => x.slug)).toEqual(expect.arrayContaining(['adamw', 'lstm']));
    expect(f.find((x) => x.slug === 'adamw')!.evidence[0]).toMatchObject({ kind: 'api', line: 2 });
  });
  it('detects declarations in several languages', () => {
    expect(slugs([{ path: 'g.go', text: 'func dijkstra(g Graph, s int) []int {' }])).toContain('dijkstra');
    expect(slugs([{ path: 'q.rs', text: 'pub fn quick_sort<T: Ord>(v: &mut [T]) {' }])).toContain('quicksort');
    expect(slugs([{ path: 'U.java', text: 'class UnionFind {' }])).toContain('union-find');
  });
  it('tracks game-engine and shader code (PRD P2)', () => {
    expect(slugs([{ path: 'Assets/Terrain.cs', text: 'float h = Mathf.PerlinNoise(x, y);' }])).toContain('perlin-noise');
    expect(slugs([{ path: 'nav.gd', text: 'var astar = AStar2D.new()' }])).toContain('a-star');
    expect(slugs([{ path: 'scene.js', text: 'const m = new THREE.MeshPhongMaterial({ color })' }])).toContain('blinn-phong');
  });
  it('reads manifests as dependency evidence', () => {
    const f = detect([{ path: 'package.json', text: '{"dependencies":{"argon2":"^0.31"}}' }]);
    expect(f[0]).toMatchObject({ slug: 'argon2', evidence: [{ kind: 'dep', path: 'package.json' }] });
  });
  it('does not report a single passing mention', () => {
    expect(slugs([{ path: 'a.py', text: '# TODO: maybe use dijkstra later' }])).not.toContain('dijkstra');
  });
  it('respects language scoping of API signatures', () => {
    expect(slugs([{ path: 'a.js', text: 'const x = sorted(arr)' }])).not.toContain('timsort');
    expect(slugs([{ path: 'a.py', text: 'x = sorted(arr)' }])).toContain('timsort');
  });
  it('ignores minified lines and unknown file types', () => {
    expect(slugs([{ path: 'a.py', text: `${'x'.repeat(600)} heapq.heappush(h, 1)` }])).toEqual([]);
    expect(slugs([{ path: 'README.md', text: 'def dijkstra(g):' }])).toEqual([]);
  });
  it('orders evidence by strength and caps confidence below 1', () => {
    const f = detect([
      { path: 'a.py', text: 'import heapq\nheapq.heappush(h, x)' },
      { path: 'b.py', text: 'def heapify(xs):' },
    ]).find((x) => x.slug === 'binary-heap')!;
    expect(f.evidence.map((e) => e.kind)).toEqual(['api', 'decl']);
    expect(f.confidence).toBeLessThan(1);
    expect(f.level).toBe('high');
  });
});

describe('file selection', () => {
  it('skips vendored/minified files and prioritizes manifests and shallow sources', () => {
    const { picked } = selectFiles([
      { path: 'node_modules/x/index.js' }, { path: 'dist/app.min.js' }, { path: 'src/deep/a/b/c.ts', size: 10 },
      { path: 'src/main.ts', size: 10 }, { path: 'package.json' }, { path: 'tests/main.test.ts' }, { path: 'logo.png' },
    ], 10, 1000);
    expect(picked.map((f) => f.path)).toEqual(['package.json', 'src/main.ts', 'src/deep/a/b/c.ts', 'tests/main.test.ts']);
  });
});

describe('scan pipeline (mocked hosts)', () => {
  const files: Record<string, string> = { 'package.json': '{"dependencies":{"bcrypt":"5"}}', 'src/path.ts': 'export function aStar(start, goal) {\n  return dijkstra(start)\n}' };
  const fake = (async (input: string | URL) => {
    const u = String(input);
    const ok = (body: unknown) => new Response(typeof body === 'string' ? body : JSON.stringify(body));
    if (u === 'https://registry.npmjs.org/fakepkg') return ok({ repository: { url: 'git+https://github.com/acme/route.git' } });
    if (u === 'https://api.github.com/repos/acme/route') return ok({ default_branch: 'main' });
    if (u.startsWith('https://api.github.com/repos/acme/route/git/trees/main')) return ok({ truncated: false, tree: Object.keys(files).map((path) => ({ path, type: 'blob', size: 50 })) });
    const raw = u.match(/^https:\/\/raw\.githubusercontent\.com\/acme\/route\/main\/(.+)$/);
    if (raw) return ok(files[decodeURIComponent(raw[1])]);
    return new Response('not found', { status: 404 });
  }) as typeof fetch;

  it('resolves an npm package to its repository and reports originators', async () => {
    const r = await scan('npm:fakepkg', { fetch: fake });
    expect(r.source).toMatchObject({ host: 'github', path: 'acme/route', ref: 'main', package: { kind: 'npm', name: 'fakepkg' } });
    expect(r.stats).toMatchObject({ listed: 2, scanned: 2, truncated: false });
    expect(r.findings.map((f) => f.slug)).toEqual(expect.arrayContaining(['a-star', 'bcrypt']));
    expect(r.findings.find((f) => f.slug === 'a-star')!.evidence[0].url).toBe('https://github.com/acme/route/blob/main/src/path.ts#L1');
  });
  it('maps upstream failures to typed errors', async () => {
    await expect(scan('https://github.com/acme/missing', { fetch: fake })).rejects.toMatchObject({ code: 'not_found' });
    const limited = (async () => new Response('', { status: 403 })) as unknown as typeof fetch;
    await expect(scan('acme/route', { fetch: limited })).rejects.toMatchObject({ code: 'rate_limited' });
  });
});
