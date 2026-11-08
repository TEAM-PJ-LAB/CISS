/**
 * 알고리즘 등록·인증 (GitHub 계정 기반).
 *  1. 등록자가 GitHub 이슈 폼(.github/ISSUE_TEMPLATE/register-algorithm.yml)으로 신청한다 — GitHub 로그인이 곧 신원이다.
 *  2. registry-bot(scripts/registry-bot.mts)이 출처·코드·저장소 권한을 자동 검사해 결과를 댓글로 남긴다.
 *  3. 관리자가 `ciss:approved` 라벨을 붙이면 봇이 인증 번호를 매겨 src/data/registrations.json에 기록한다.
 * 인증서는 "누가, 언제, 어떤 코드·근거로 등록했는가"를 기록할 뿐 독창성이나 특허성을 판정하지 않는다.
 */
import DATA from '@/data/registrations.json';
import { DERIVATION_TYPES, FIELDS, type DerivationType, type Field } from '@/data/types';

export interface RegistrationSource { url: string; title?: string; check?: string }
export interface Registration {
  id: string; // CISS-YYYY-NNNN
  slug: string;
  name: string;
  field: Field;
  summary: string;
  authors: string[]; // 등록자가 신고한 설계자 이름
  registrant: { login: string; id: number };
  issue: number;
  registeredAt: string; // 신청 이슈 생성 시각 (ISO 8601)
  certifiedAt: string;
  code?: { repo: string; commit: string; path?: string; sha256?: string };
  sources: RegistrationSource[];
  parents: { slug: string; type: DerivationType; note?: string }[];
  license?: string;
}

export const REGISTRATIONS = DATA as Registration[];
export const REGISTER_LABEL = 'ciss:register';
export const APPROVE_LABEL = 'ciss:approved';
export const TEMPLATE = 'register-algorithm.yml';

/** 이슈 폼 필드 id → 본문에 찍히는 제목(라벨). 순서·문구는 이슈 폼과 같아야 한다. */
export const FORM = {
  name: 'Algorithm name',
  slug: 'Short id (slug)',
  field: 'Field',
  summary: 'Summary',
  authors: 'Designers',
  sources: 'Papers and documents',
  code: 'Reference implementation',
  parents: 'Derived from',
  license: 'License',
  consent: 'Declaration',
} as const;
export type FormKey = keyof typeof FORM;

const ID_RE = /^CISS-(\d{4})-(\d{4})$/;
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const LIMITS = { name: 120, summary: [40, 2000], authors: 10, sources: 10, parents: 10 } as const;

export const slugify = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');

/** GitHub 이슈 폼 본문(`### 라벨\n\n값`)을 필드별 값으로 나눈다. 빈 칸은 `_No response_`로 찍힌다. */
export function parseIssueForm(body: string): Partial<Record<FormKey, string>> {
  const out: Partial<Record<FormKey, string>> = {};
  const byLabel = new Map(Object.entries(FORM).map(([k, v]) => [v.toLowerCase(), k as FormKey]));
  for (const part of body.replace(/\r\n/g, '\n').split(/^###\s+/m).slice(1)) {
    const nl = part.indexOf('\n');
    const head = (nl < 0 ? part : part.slice(0, nl)).trim().toLowerCase();
    const key = byLabel.get(head);
    if (!key) continue;
    const v = (nl < 0 ? '' : part.slice(nl + 1)).trim();
    out[key] = v === '_No response_' ? '' : v;
  }
  return out;
}

const lines = (s = '') => s.split('\n').map((x) => x.replace(/^\s*[-*]\s+/, '').trim()).filter(Boolean);

/** 근거 한 줄 → 정규화한 URL. DOI·arXiv 표기는 해석 가능한 URL로 바꾼다. */
export function normalizeSource(raw: string): string | null {
  const s = raw.trim().replace(/[),.;]+$/, '');
  const doi = s.match(/^(?:doi:\s*|https?:\/\/(?:dx\.)?doi\.org\/)(10\.\d{4,9}\/\S+)$/i);
  if (doi) return `https://doi.org/${doi[1]}`;
  const ax = s.match(/^(?:arxiv:\s*|https?:\/\/arxiv\.org\/(?:abs|pdf)\/)(\d{4}\.\d{4,5})(?:v\d+)?(?:\.pdf)?$/i);
  if (ax) return `https://arxiv.org/abs/${ax[1]}`;
  if (/^10\.\d{4,9}\/\S+$/.test(s)) return `https://doi.org/${s}`;
  try { const u = new URL(s); return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null; } catch { return null; }
}

/** github.com URL → 저장소·참조·경로. `blob/<ref>/<path>`, `tree/<ref>`, 저장소 루트를 받는다. */
export function parseGitHubCode(raw: string): { repo: string; ref?: string; path?: string } | null {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return null; }
  if (u.hostname !== 'github.com') return null;
  const [owner, name, kind, ref, ...rest] = u.pathname.replace(/^\/|\/$/g, '').split('/');
  if (!owner || !name || !/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(name)) return null;
  const repo = `${owner}/${name.replace(/\.git$/, '')}`;
  if (!kind) return { repo };
  if ((kind === 'blob' || kind === 'tree') && ref) return { repo, ref, ...(kind === 'blob' && rest.length ? { path: rest.join('/') } : {}) };
  return null;
}

export interface Draft {
  name: string; slug: string; field: Field; summary: string; authors: string[];
  sources: string[]; code?: { repo: string; ref?: string; path?: string }; parents: { slug: string; type: DerivationType; note?: string }[];
  license?: string; consent: boolean;
}

/** `slug`, `slug: type: 설명`, `slug (type) 설명`. type을 생략하면 variant. slug는 소문자만 받는다. */
export function parseParent(line: string): { slug: string; type: DerivationType; note?: string } | null {
  const m = line.trim().match(/^([a-z0-9]+(?:-[a-z0-9]+)*)(?:\s*[:(]\s*(.*))?$/);
  if (!m) return null;
  const rest = m[2] ?? '';
  const t = rest.match(/^(variant|optimization|generalization|composition|port)\b\s*\)?\s*:?\s*(.*)$/i);
  const note = (t ? t[2] : rest).trim();
  return { slug: m[1], type: (t ? t[1].toLowerCase() : 'variant') as DerivationType, ...(note ? { note: note.slice(0, 300) } : {}) };
}

/** 이슈 폼 값 → 신청서. 형식 오류는 errors에 모은다(키별). 존재 여부 같은 외부 확인은 봇이 한다. */
export function draftFromForm(f: Partial<Record<FormKey, string>>, taken: Set<string>): { draft: Draft; errors: Partial<Record<FormKey, string>> } {
  const errors: Partial<Record<FormKey, string>> = {};
  const name = (f.name ?? '').trim();
  if (!name || name.length > LIMITS.name) errors.name = `required, ≤ ${LIMITS.name} chars`;
  const slug = (f.slug?.trim() || slugify(name)).toLowerCase();
  if (!SLUG_RE.test(slug)) errors.slug = 'lowercase letters, digits and single hyphens';
  else if (taken.has(slug)) errors.slug = `"${slug}" is already used; choose another slug`;
  const field = (f.field ?? '').trim().toLowerCase() as Field;
  if (!FIELDS.includes(field)) errors.field = `one of: ${FIELDS.join(', ')}`;
  const summary = (f.summary ?? '').trim();
  if (summary.length < LIMITS.summary[0] || summary.length > LIMITS.summary[1]) errors.summary = `${LIMITS.summary[0]}–${LIMITS.summary[1]} chars`;
  const authors = lines(f.authors).map((x) => x.slice(0, 100));
  if (!authors.length || authors.length > LIMITS.authors) errors.authors = `1–${LIMITS.authors} names, one per line`;
  const rawSources = lines(f.sources);
  const sources = rawSources.map(normalizeSource);
  if (sources.some((x) => !x)) errors.sources = `not a URL, DOI or arXiv id: ${rawSources.filter((_, i) => !sources[i]).join(', ')}`;
  else if (sources.length > LIMITS.sources) errors.sources = `≤ ${LIMITS.sources} entries`;
  const codeRaw = (f.code ?? '').trim();
  const code = codeRaw ? parseGitHubCode(codeRaw) : undefined;
  if (codeRaw && !code) errors.code = 'a github.com repository, tree or blob URL';
  if (!codeRaw && !sources.length) errors.sources = 'give at least one paper/document or a reference implementation';
  const rawParents = lines(f.parents);
  const parents = rawParents.map(parseParent);
  if (parents.some((p) => !p)) errors.parents = 'one per line: `slug: type: note` (type = variant | optimization | generalization | composition | port)';
  else if (parents.length > LIMITS.parents) errors.parents = `≤ ${LIMITS.parents} entries`;
  const consent = /\[x\]/i.test(f.consent ?? '');
  if (!consent) errors.consent = 'tick the declaration';
  return {
    draft: {
      name, slug, field, summary, authors, sources: sources.filter((x): x is string => !!x).filter((x, i, a) => a.indexOf(x) === i),
      ...(code ? { code } : {}), parents: parents.filter((p): p is NonNullable<typeof p> => !!p), ...(f.license?.trim() ? { license: f.license.trim().slice(0, 60) } : {}), consent,
    },
    errors,
  };
}

/** 같은 해의 다음 인증 번호. */
export function nextId(existing: Pick<Registration, 'id'>[], year: number): string {
  const n = Math.max(0, ...existing.map((r) => r.id.match(ID_RE)).filter((m) => m && Number(m[1]) === year).map((m) => Number(m![2])));
  return `CISS-${year}-${String(n + 1).padStart(4, '0')}`;
}

export const isRegistrationId = (s: string) => ID_RE.test(s);
export const DERIVATION_TYPE_SET = new Set<string>(DERIVATION_TYPES);

/** 이슈 폼 미리 채우기 URL (필드 id = 쿼리 키). 본문 한도 안에서만 쓴다. */
export function issueFormUrl(repo: string, values: Partial<Record<Exclude<FormKey, 'consent'>, string>>): string {
  const q = new URLSearchParams({ template: TEMPLATE, title: `[Register] ${values.name ?? ''}`.trim() });
  for (const [k, v] of Object.entries(values)) if (v) q.set(k, v);
  return `https://github.com/${repo}/issues/new?${q}`;
}
