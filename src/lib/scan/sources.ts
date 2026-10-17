/** 저장소 위치 해석과 호스트별 파일 목록·원문 조회 (PRD §6.2 Repo Scan, §6.3 GitLab·Bitbucket·PyPI·npm 확장). */

export type Host = 'github' | 'gitlab' | 'bitbucket';
export interface RepoRef { host: Host; path: string; ref?: string }
export interface RepoFile { path: string; size?: number }
export type Fetch = typeof fetch;

export class ScanError extends Error {
  constructor(public code: 'bad_input' | 'not_found' | 'rate_limited' | 'upstream' | 'no_repository' | 'too_large', message: string) { super(message); }
}

const GH = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/(?:tree|blob)\/([^/?#]+))?\/?(?:[?#].*)?$/i;
const GL = /^(?:https?:\/\/)?(?:www\.)?gitlab\.com\/([^?#]+?)\/?(?:[?#].*)?$/i;
const BB = /^(?:https?:\/\/)?(?:www\.)?bitbucket\.org\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/src\/([^/?#]+).*)?\/?$/i;
const NPM = /^(?:npm:|(?:https?:\/\/)?(?:www\.)?npmjs\.com\/package\/)((?:@[\w.-]+\/)?[\w.-]+)\/?$/i;
const PYPI = /^(?:pypi:|(?:https?:\/\/)?pypi\.org\/project\/)([\w.-]+)\/?$/i;
const SHORT = /^([\w.-]+)\/([\w.-]+)$/;

export type Target = { kind: 'repo'; repo: RepoRef } | { kind: 'npm' | 'pypi'; name: string };

export function parseTarget(input: string): Target {
  const s = input.trim();
  let m: RegExpMatchArray | null;
  if ((m = s.match(GH))) return { kind: 'repo', repo: { host: 'github', path: `${m[1]}/${m[2]}`, ...(m[3] && { ref: m[3] }) } };
  if ((m = s.match(GL))) {
    const [path, rest] = m[1].split('/-/');
    const ref = rest?.match(/^(?:tree|blob)\/([^/]+)/)?.[1];
    const clean = path.replace(/\.git$/, '');
    if (/^[\w.-]+(\/[\w.-]+)+$/.test(clean)) return { kind: 'repo', repo: { host: 'gitlab', path: clean, ...(ref && { ref }) } };
  }
  if ((m = s.match(BB))) return { kind: 'repo', repo: { host: 'bitbucket', path: `${m[1]}/${m[2]}`, ...(m[3] && { ref: m[3] }) } };
  if ((m = s.match(NPM))) return { kind: 'npm', name: m[1].toLowerCase() };
  if ((m = s.match(PYPI))) return { kind: 'pypi', name: m[1] };
  if ((m = s.match(SHORT)) && !s.includes('.')) return { kind: 'repo', repo: { host: 'github', path: `${m[1]}/${m[2]}` } };
  throw new ScanError('bad_input', 'Unsupported input. Use a GitHub/GitLab/Bitbucket URL, owner/repo, npm:<package> or pypi:<package>.');
}

/** git+https://github.com/x/y.git, git@github.com:x/y.git, github:x/y → RepoRef */
export function repoFromUrl(raw: string | undefined | null): RepoRef | null {
  if (!raw) return null;
  const s = raw.trim().replace(/^git\+/, '').replace(/^git:\/\//, 'https://').replace(/^(?:ssh:\/\/)?git@([^:/]+)[:/]/, 'https://$1/')
    .replace(/^github:/, 'https://github.com/').replace(/^gitlab:/, 'https://gitlab.com/').replace(/^bitbucket:/, 'https://bitbucket.org/')
    .replace(/#.*$/, '');
  try {
    const t = parseTarget(s);
    return t.kind === 'repo' ? t.repo : null;
  } catch { return null; }
}

async function getJson<T>(f: Fetch, url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await f(url, { headers: { Accept: 'application/json', 'User-Agent': 'CISS-RepoScan', ...headers }, signal: AbortSignal.timeout(12_000) });
  if (res.status === 404) throw new ScanError('not_found', `Not found: ${url}`);
  if (res.status === 403 || res.status === 429) throw new ScanError('rate_limited', `Upstream rate limit (${res.status}). Configure an access token on the server.`);
  if (!res.ok) throw new ScanError('upstream', `Upstream error ${res.status}`);
  return res.json() as Promise<T>;
}

export async function resolvePackage(f: Fetch, kind: 'npm' | 'pypi', name: string): Promise<RepoRef> {
  if (kind === 'npm') {
    const pkg = await getJson<{ repository?: string | { url?: string } }>(f, `https://registry.npmjs.org/${name.replace('/', '%2F')}`);
    const repo = repoFromUrl(typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url);
    if (!repo) throw new ScanError('no_repository', `npm package "${name}" does not declare a GitHub, GitLab or Bitbucket repository.`);
    return repo;
  }
  const pkg = await getJson<{ info?: { project_urls?: Record<string, string> | null; home_page?: string | null } }>(f, `https://pypi.org/pypi/${encodeURIComponent(name)}/json`);
  const urls = Object.entries(pkg.info?.project_urls ?? {});
  const ranked = [...urls.filter(([k]) => /source|repo|code|github|gitlab/i.test(k)), ...urls, ['home', pkg.info?.home_page ?? '']];
  for (const [, u] of ranked) { const r = repoFromUrl(u); if (r) return r; }
  throw new ScanError('no_repository', `PyPI package "${name}" does not link a GitHub, GitLab or Bitbucket repository.`);
}

export interface Tokens { github?: string; gitlab?: string; bitbucket?: string }

/** 호스트별 어댑터: 기본 브랜치·파일 목록·원문 URL·웹 링크. */
export function provider(f: Fetch, repo: RepoRef, tokens: Tokens = {}) {
  const auth = (t?: string): Record<string, string> => (t ? { Authorization: `Bearer ${t}` } : {});
  if (repo.host === 'github') {
    const api = `https://api.github.com/repos/${repo.path}`;
    const h = { ...auth(tokens.github), Accept: 'application/vnd.github+json' };
    return {
      web: `https://github.com/${repo.path}`,
      async ref() { return repo.ref ?? (await getJson<{ default_branch: string }>(f, api, h)).default_branch; },
      async list(ref: string) {
        const t = await getJson<{ tree: { path: string; type: string; size?: number }[]; truncated: boolean }>(f, `${api}/git/trees/${encodeURIComponent(ref)}?recursive=1`, h);
        return { files: t.tree.filter((x) => x.type === 'blob').map((x) => ({ path: x.path, size: x.size })), truncated: t.truncated };
      },
      raw: (ref: string, p: string) => `https://raw.githubusercontent.com/${repo.path}/${encodeURIComponent(ref)}/${p.split('/').map(encodeURIComponent).join('/')}`,
      rawHeaders: auth(tokens.github),
      line: (ref: string, p: string, n: number) => `https://github.com/${repo.path}/blob/${ref}/${p}#L${n}`,
    };
  }
  if (repo.host === 'gitlab') {
    const api = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repo.path)}`;
    const h: Record<string, string> = tokens.gitlab ? { 'PRIVATE-TOKEN': tokens.gitlab } : {};
    return {
      web: `https://gitlab.com/${repo.path}`,
      async ref() { return repo.ref ?? (await getJson<{ default_branch: string }>(f, api, h)).default_branch; },
      async list(ref: string) {
        const files: RepoFile[] = [];
        let page = 1;
        for (; page <= 10; page++) {
          const batch = await getJson<{ path: string; type: string }[]>(f, `${api}/repository/tree?recursive=true&per_page=100&page=${page}&ref=${encodeURIComponent(ref)}`, h);
          files.push(...batch.filter((x) => x.type === 'blob').map((x) => ({ path: x.path })));
          if (batch.length < 100) break;
        }
        return { files, truncated: page > 10 };
      },
      raw: (ref: string, p: string) => `${api}/repository/files/${encodeURIComponent(p)}/raw?ref=${encodeURIComponent(ref)}`,
      rawHeaders: h,
      line: (ref: string, p: string, n: number) => `https://gitlab.com/${repo.path}/-/blob/${ref}/${p}#L${n}`,
    };
  }
  const api = `https://api.bitbucket.org/2.0/repositories/${repo.path}`;
  const h = auth(tokens.bitbucket);
  return {
    web: `https://bitbucket.org/${repo.path}`,
    async ref() { return repo.ref ?? (await getJson<{ mainbranch?: { name: string } }>(f, api, h)).mainbranch?.name ?? 'main'; },
    async list(ref: string) {
      const files: RepoFile[] = [];
      let url: string | undefined = `${api}/src/${encodeURIComponent(ref)}/?max_depth=12&pagelen=100`;
      let pages = 0;
      while (url && pages++ < 10) {
        const page: { values: { path: string; type: string; size?: number }[]; next?: string } = await getJson(f, url, h);
        files.push(...page.values.filter((x) => x.type === 'commit_file').map((x) => ({ path: x.path, size: x.size })));
        url = page.next;
      }
      return { files, truncated: Boolean(url) };
    },
    raw: (ref: string, p: string) => `${api}/src/${encodeURIComponent(ref)}/${p.split('/').map(encodeURIComponent).join('/')}`,
    rawHeaders: h,
    line: (ref: string, p: string, n: number) => `https://bitbucket.org/${repo.path}/src/${ref}/${p}#lines-${n}`,
  };
}
