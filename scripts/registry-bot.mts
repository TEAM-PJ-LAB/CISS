/**
 * CISS registry bot — .github/workflows/registry-bot.yml에서 issues 이벤트로 실행.
 *  - opened/edited: 등록 신청(라벨 ciss:register)을 검사하고 결과 댓글을 갱신한다.
 *  - labeled ciss:approved: 다시 검사해 통과하면 인증 번호를 매겨 registrations.json에 커밋하고 이슈를 닫는다.
 * 이슈 본문은 신뢰하지 않는 입력이므로 실행하지 않고 파싱만 한다.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { ALGORITHMS } from '../src/data/algorithms/index.ts';
import { checksComment, BOT_MARK, runChecks } from '../src/lib/registry-checks.ts';
import { APPROVE_LABEL, draftFromForm, nextId, parseIssueForm, REGISTER_LABEL, type Registration } from '../src/lib/registrations.ts';

const API = process.env.GITHUB_API_URL ?? 'https://api.github.com';
const REPO = process.env.GITHUB_REPOSITORY!;
const TOKEN = process.env.GITHUB_TOKEN!;
const FILE = 'src/data/registrations.json';
const ev = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH!, 'utf8'));
const issue = ev.issue;
const labels: string[] = issue.labels.map((l: { name: string }) => l.name);

const gh = (path: string, init: RequestInit = {}) => fetch(path.startsWith('http') ? path : `${API}${path}`, {
  ...init, headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
});
const ghJson = async (path: string, method: string, body: unknown) => {
  const r = await gh(path, { method, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
};
const iss = `/repos/${REPO}/issues/${issue.number}`;

async function upsertComment(body: string) {
  const cs: { id: number; body: string; user: { type: string } }[] = await (await gh(`${iss}/comments?per_page=100`)).json();
  const mine = cs.find((c) => c.user.type === 'Bot' && c.body.startsWith(BOT_MARK));
  if (mine) await ghJson(`/repos/${REPO}/issues/comments/${mine.id}`, 'PATCH', { body });
  else await ghJson(`${iss}/comments`, 'POST', { body });
}
const setLabel = async (add: string, remove: string[]) => {
  for (const l of remove) if (labels.includes(l)) await gh(`${iss}/labels/${encodeURIComponent(l)}`, { method: 'DELETE' });
  await ghJson(`${iss}/labels`, 'POST', { labels: [add] });
};

async function main() {
  if (!labels.includes(REGISTER_LABEL) || issue.pull_request) return console.log('not a registration issue');
  if (labels.includes('ciss:certified')) return console.log('already certified');
  if (ev.action === 'labeled' && ev.label?.name !== APPROVE_LABEL) return console.log(`label ${ev.label?.name} ignored`);

  const regs: Registration[] = JSON.parse(readFileSync(FILE, 'utf8'));
  const taken = new Set([...ALGORITHMS.map((a) => a.slug), ...regs.map((r) => r.slug)]);
  const known = new Set(ALGORITHMS.map((a) => a.slug));
  const { draft, errors } = draftFromForm(parseIssueForm(issue.body ?? ''), taken);
  const login: string = issue.user.login;
  const res = Object.keys(errors).length ? null : await runChecks(draft, login, known, gh, (u, i) => fetch(u, i));
  const ok = !!res?.passed;
  await upsertComment(checksComment(errors as Record<string, string>, res, draft.slug));
  await setLabel(ok ? 'ciss:checks-passed' : 'ciss:checks-failed', ['ciss:checks-passed', 'ciss:checks-failed']);

  if (ev.action !== 'labeled') return;
  if (!ok) {
    await gh(`${iss}/labels/${encodeURIComponent(APPROVE_LABEL)}`, { method: 'DELETE' });
    return ghJson(`${iss}/comments`, 'POST', { body: 'The checks no longer pass, so the approval was withdrawn. Fix the items above and approve again.' });
  }

  execFileSync('git', ['pull', '--rebase', '--quiet'], { stdio: 'inherit' });
  const latest: Registration[] = JSON.parse(readFileSync(FILE, 'utf8'));
  if (latest.some((r) => r.slug === draft.slug || r.issue === issue.number)) return console.log('registered concurrently');
  const now = new Date().toISOString();
  const reg: Registration = {
    id: nextId(latest, new Date(now).getUTCFullYear()), slug: draft.slug, name: draft.name, field: draft.field, summary: draft.summary,
    authors: draft.authors, registrant: { login, id: issue.user.id }, issue: issue.number, registeredAt: issue.created_at, certifiedAt: now,
    ...(res!.code ? { code: res!.code } : {}), sources: res!.sources, parents: draft.parents, ...(draft.license ? { license: draft.license } : {}),
  };
  writeFileSync(FILE, `${JSON.stringify([...latest, reg], null, 1)}\n`);
  const git = (...a: string[]) => execFileSync('git', a, { stdio: 'inherit' });
  git('config', 'user.name', 'github-actions[bot]');
  git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com');
  git('add', FILE);
  git('commit', '-m', `Certify ${reg.id}: ${reg.name} (#${issue.number})`);
  git('push');

  const site = process.env.SITE_URL ?? `https://${REPO.split('/')[0].toLowerCase()}.github.io/${REPO.split('/')[1]}`;
  await ghJson(`${iss}/comments`, 'POST', { body: [
    `## CISS registration certificate ${reg.id}`, '',
    `- Algorithm: **${reg.name}** (\`${reg.slug}\`, ${reg.field})`,
    `- Registrant: @${login} (GitHub user id ${issue.user.id})`,
    `- Registered: ${reg.registeredAt} (this issue) · Certified: ${reg.certifiedAt}`,
    ...(reg.code ? [`- Code: ${reg.code.repo}@${reg.code.commit}${reg.code.path ? ` \`${reg.code.path}\`` : ''}${reg.code.sha256 ? ` sha256 \`${reg.code.sha256}\`` : ''}`] : []),
    ...reg.sources.map((s) => `- Source: ${s.url}${s.check ? ` (${s.check})` : ''}`), '',
    `Certificate page (after the next deploy): ${site}/en/registry/#${reg.id}`, '',
    `Badge: \`[![CISS registered](${site}/badge/registration/${reg.id}.svg)](${site}/en/registry/#${reg.id})\``,
  ].join('\n') });
  await setLabel('ciss:certified', []);
  await ghJson(iss, 'PATCH', { state: 'closed', state_reason: 'completed' });
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, 'certified=1\n');
}

await main();
