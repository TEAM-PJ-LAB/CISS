/**
 * 등록 신청 자동 검사 (registry-bot이 GitHub Actions에서 실행). 네트워크는 주입받은 fetch로만 한다(테스트에서 대체).
 */
import { createHash } from 'node:crypto';
import type { Draft, Registration, RegistrationSource } from './registrations';

export type Fetch = (url: string, init?: RequestInit) => Promise<Response>;
export interface Check { id: string; ok: boolean; required: boolean; detail: string }
export interface CheckResult { checks: Check[]; passed: boolean; sources: RegistrationSource[]; code?: Registration['code'] }

const UA = { 'User-Agent': 'CISS-registry-bot (https://github.com/TEAM-PJ-LAB/CISS)' };

/** 러너 내부망 요청을 막는다: http(s)만, IP 리터럴·localhost 금지. */
export const publicUrl = (u: string) => {
  try {
    const x = new URL(u);
    return (x.protocol === 'https:' || x.protocol === 'http:') && !/^(localhost|.*\.local|.*\.internal)$/i.test(x.hostname)
      && !/^\d{1,3}(\.\d{1,3}){3}$/.test(x.hostname) && !x.hostname.startsWith('[');
  } catch { return false; }
};

async function sourceCheck(f: Fetch, url: string): Promise<RegistrationSource & { ok: boolean; why?: string }> {
  if (!publicUrl(url)) return { url, ok: false, why: 'only public http(s) URLs are accepted' };
  try {
    const doi = url.match(/^https:\/\/doi\.org\/(10\.\d{4,9}\/\S+)$/)?.[1];
    if (doi) {
      const r = await f(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: UA });
      if (r.ok) {
        const m = (await r.json()).message;
        return { url, ok: true, title: [m.title?.[0], m.subtitle?.[0]].filter(Boolean).join(': ') || undefined, check: 'Crossref' };
      }
      const d = await f(`https://api.datacite.org/dois/${encodeURIComponent(doi)}`, { headers: UA });
      if (d.ok) return { url, ok: true, title: (await d.json()).data?.attributes?.titles?.[0]?.title, check: 'DataCite' };
      return { url, ok: false, why: 'DOI not registered (Crossref, DataCite)' };
    }
    const ax = url.match(/^https:\/\/arxiv\.org\/abs\/(\d{4}\.\d{4,5})$/)?.[1];
    if (ax) {
      const r = await f(`https://export.arxiv.org/api/query?id_list=${ax}`, { headers: UA });
      const title = r.ok ? (await r.text()).match(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/\s+/g, ' ').trim() : undefined;
      return title ? { url, ok: true, title, check: 'arXiv' } : { url, ok: false, why: 'arXiv id not found' };
    }
    const r = await f(url, { method: 'GET', redirect: 'follow', headers: UA });
    return r.ok ? { url, ok: true, check: 'web' } : { url, ok: false, why: `HTTP ${r.status}` };
  } catch (e) {
    return { url, ok: false, why: (e as Error).message.slice(0, 120) };
  }
}

/** 신청서 + 등록자 계정 → 검사 결과. gh는 GitHub REST 호출(토큰 포함), f는 일반 fetch. */
export async function runChecks(d: Draft, registrant: string, knownSlugs: Set<string>, gh: Fetch, f: Fetch): Promise<CheckResult> {
  const checks: Check[] = [];
  const add = (id: string, ok: boolean, detail: string, required = true) => checks.push({ id, ok, required, detail });

  const srcs = await Promise.all(d.sources.map((u) => sourceCheck(f, u)));
  for (const s of srcs) add('source', s.ok, s.ok ? `${s.check}: ${s.title ?? s.url}` : `${s.url} — ${s.why}`);

  for (const p of d.parents) add('parent', knownSlugs.has(p.slug), knownSlugs.has(p.slug) ? `${p.slug} (${p.type})` : `${p.slug} is not a CISS algorithm`);

  let code: Registration['code'];
  if (d.code) {
    const { repo, ref, path } = d.code;
    const meta = await gh(`/repos/${repo}`);
    if (!meta.ok) add('code.repo', false, `${repo} — repository not found or not public`);
    else {
      const m = await meta.json();
      add('code.repo', !m.private, `${m.full_name}${m.private ? ' is private' : ' is public'}`);
      const c = await gh(`/repos/${repo}/commits/${encodeURIComponent(ref ?? m.default_branch)}`);
      const sha: string | undefined = c.ok ? (await c.json()).sha : undefined;
      add('code.commit', !!sha, sha ? `${ref ?? m.default_branch} → ${sha}` : `cannot resolve ${ref ?? m.default_branch}`);
      let sha256: string | undefined;
      if (sha && path) {
        const raw = await f(`https://raw.githubusercontent.com/${m.full_name}/${sha}/${path.split('/').map(encodeURIComponent).join('/')}`, { headers: UA });
        if (raw.ok) sha256 = createHash('sha256').update(Buffer.from(await raw.arrayBuffer())).digest('hex');
        add('code.file', !!sha256, sha256 ? `${path} sha256 ${sha256}` : `${path} not found at ${sha.slice(0, 7)}`);
      }
      const owner: string = m.owner?.login ?? '';
      let member = owner.toLowerCase() === registrant.toLowerCase();
      let how = member ? 'owner' : '';
      if (!member) {
        const cs = await gh(`/repos/${repo}/contributors?per_page=100`);
        if (cs.ok && (await cs.json() as { login?: string }[]).some((x) => x.login?.toLowerCase() === registrant.toLowerCase())) { member = true; how = 'contributor'; }
      }
      if (!member && m.owner?.type === 'Organization') {
        const om = await gh(`/orgs/${owner}/public_members/${registrant}`);
        if (om.status === 204) { member = true; how = `public member of ${owner}`; }
      }
      add('code.registrant', member, member ? `@${registrant} is ${how} of ${m.full_name}` : `@${registrant} is not the owner, a top-100 contributor or a public org member of ${m.full_name}`);
      if (sha) code = { repo: m.full_name, commit: sha, ...(path ? { path } : {}), ...(sha256 ? { sha256 } : {}) };
    }
  }
  const passed = checks.filter((c) => c.required).every((c) => c.ok);
  return { checks, passed, sources: srcs.map(({ url, title, check }) => ({ url, ...(title ? { title } : {}), ...(check ? { check } : {}) })), ...(code ? { code } : {}) };
}

/** 봇 댓글 본문. 같은 이슈에서는 마커로 찾아 갱신한다. */
export const BOT_MARK = '<!-- ciss-registry-bot -->';
export function checksComment(formErrors: Record<string, string>, res: CheckResult | null, slug: string): string {
  const rows = [
    ...Object.entries(formErrors).map(([k, v]) => `| ❌ | form: ${k} | ${v} |`),
    ...(res?.checks ?? []).map((c) => `| ${c.ok ? '✅' : c.required ? '❌' : '⚠️'} | ${c.id} | ${c.detail.replace(/\|/g, '\\|')} |`),
  ];
  const ok = !Object.keys(formErrors).length && !!res?.passed;
  return [BOT_MARK, `### CISS registration checks: ${ok ? 'passed ✅' : 'needs changes ❌'}`, '',
    `Slug: \`${slug}\``, '', '| | check | detail |', '|---|---|---|', ...(rows.length ? rows : ['| ✅ | form | ok |']), '',
    ok ? 'A maintainer can now review and add the `ciss:approved` label to issue the certificate.'
      : 'Edit the issue to fix the items marked ❌; the checks run again automatically.'].join('\n');
}
