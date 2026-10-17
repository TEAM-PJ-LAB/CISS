import { timingSafeEqual } from 'node:crypto';
import { getDb } from './db';
import type { Registry } from './registry';

export const CLAIM_KINDS = ['claim', 'dispute'] as const;
export const CLAIM_STATUSES = ['pending', 'accepted', 'rejected'] as const;
export type ClaimKind = (typeof CLAIM_KINDS)[number];
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export interface ClaimInput {
  kind: ClaimKind;
  target: string; // algorithm:<slug> | derivation:<from>><to> | author:<slug>
  name: string;
  contact?: string;
  statement: string;
  evidence: string[]; // https URL 1~5개
}

/** 공개 응답 — contact는 절대 포함하지 않음 (PRD §8 개인정보). */
export interface PublicClaim {
  id: number;
  kind: ClaimKind;
  target: string;
  name: string;
  statement: string;
  evidence: string[];
  status: ClaimStatus;
  resolution: string | null;
  createdAt: string;
  updatedAt: string | null;
}

const LIMIT = { name: 80, contact: 200, statement: [20, 4000], evidence: 5, url: 500, resolution: 2000 } as const;

export function targetExists(r: Registry, target: string) {
  const [type, ...rest] = target.split(':');
  const id = rest.join(':');
  if (type === 'algorithm') return r.algo.has(id);
  if (type === 'author') return r.author.has(id);
  if (type === 'derivation') return r.derivations.some((e) => e.id === id);
  return false;
}

export function targetLabel(r: Registry, target: string) {
  const [type, ...rest] = target.split(':');
  const id = rest.join(':');
  if (type === 'algorithm') return { href: `/algorithms/${id}`, text: r.algo.get(id)?.name ?? id };
  if (type === 'author') return { href: `/authors/${id}`, text: r.author.get(id)?.name ?? id };
  const [from, to] = id.split('>');
  return { href: `/algorithms/${to}#parents`, text: `${r.algo.get(from)?.name ?? from} → ${r.algo.get(to)?.name ?? to}` };
}

const isUrl = (s: string) => {
  try { const u = new URL(s); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; }
};

export function validateClaim(r: Registry, raw: unknown): { ok: true; value: ClaimInput } | { ok: false; errors: Record<string, string> } {
  const x = (raw ?? {}) as Record<string, unknown>;
  const str = (k: string) => (typeof x[k] === 'string' ? (x[k] as string).trim() : '');
  const errors: Record<string, string> = {};
  const kind = str('kind') as ClaimKind;
  const target = str('target');
  const name = str('name');
  const contact = str('contact');
  const statement = str('statement');
  const evidence = (Array.isArray(x.evidence) ? x.evidence : str('evidence').split(/\s+/))
    .map((e) => String(e).trim()).filter(Boolean);

  if (!CLAIM_KINDS.includes(kind)) errors.kind = 'kind must be claim or dispute';
  if (!targetExists(r, target)) errors.target = 'target must reference an existing algorithm, author or derivation';
  if (!name || name.length > LIMIT.name) errors.name = `name is required (max ${LIMIT.name} chars)`;
  if (contact.length > LIMIT.contact) errors.contact = `contact max ${LIMIT.contact} chars`;
  if (statement.length < LIMIT.statement[0] || statement.length > LIMIT.statement[1]) errors.statement = `statement must be ${LIMIT.statement[0]}-${LIMIT.statement[1]} chars`;
  if (!evidence.length || evidence.length > LIMIT.evidence || evidence.some((e) => !isUrl(e) || e.length > LIMIT.url)) {
    errors.evidence = `evidence must be 1-${LIMIT.evidence} http(s) URLs`;
  }
  return Object.keys(errors).length ? { ok: false, errors }
    : { ok: true, value: { kind, target, name, statement, evidence, ...(contact && { contact }) } };
}

type Row = Record<string, string | number | null>;

const toPublic = (row: Row): PublicClaim => ({
  id: Number(row.id), kind: row.kind as ClaimKind, target: String(row.target), name: String(row.name),
  statement: String(row.statement), evidence: JSON.parse(String(row.evidence)), status: row.status as ClaimStatus,
  resolution: (row.resolution as string) ?? null, createdAt: String(row.created_at), updatedAt: (row.updated_at as string) ?? null,
});

const COLS = 'id, kind, target, name, statement, evidence, status, resolution, created_at, updated_at';

export function createClaim(c: ClaimInput): PublicClaim {
  const row = getDb().prepare(
    `INSERT INTO claims (kind, target, name, contact, statement, evidence) VALUES (?, ?, ?, ?, ?, ?) RETURNING ${COLS}`,
  ).get(c.kind, c.target, c.name, c.contact ?? null, c.statement, JSON.stringify(c.evidence)) as Row;
  return toPublic(row);
}

export function listClaims({ target, status, limit = 100 }: { target?: string; status?: ClaimStatus; limit?: number } = {}): PublicClaim[] {
  const where: string[] = [];
  const args: string[] = [];
  if (target) { where.push('target = ?'); args.push(target); }
  if (status) { where.push('status = ?'); args.push(status); }
  return (getDb().prepare(
    `SELECT ${COLS} FROM claims ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC LIMIT ${Math.min(Math.max(limit, 1), 500)}`,
  ).all(...args) as Row[]).map(toPublic);
}

export function claimCounts() {
  const rows = getDb().prepare('SELECT status, COUNT(*) AS n FROM claims GROUP BY status').all() as { status: ClaimStatus; n: number }[];
  return Object.fromEntries(CLAIM_STATUSES.map((s) => [s, rows.find((x) => x.status === s)?.n ?? 0])) as Record<ClaimStatus, number>;
}

export function reviewClaim(id: number, status: Exclude<ClaimStatus, 'pending'>, resolution: string): PublicClaim | null {
  const row = getDb().prepare(
    `UPDATE claims SET status = ?, resolution = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now') WHERE id = ? RETURNING ${COLS}`,
  ).get(status, resolution.slice(0, LIMIT.resolution), id) as Row | undefined;
  return row ? toPublic(row) : null;
}

/** 관리자 토큰 상수 시간 비교. 토큰 미설정 시 검수 기능 비활성. */
export function isAdmin(header: string | null, token = process.env.CISS_ADMIN_TOKEN) {
  if (!token || !header?.startsWith('Bearer ')) return false;
  const a = Buffer.from(header.slice(7));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
