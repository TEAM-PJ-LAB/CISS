import { NextResponse } from 'next/server';
import { CLAIM_STATUSES, createClaim, listClaims, validateClaim, type ClaimStatus } from '@/lib/claims';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { registry } from '@/lib/registry';

export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const status = p.get('status') as ClaimStatus | null;
  return NextResponse.json({
    claims: listClaims({
      target: p.get('target') ?? undefined,
      status: status && CLAIM_STATUSES.includes(status) ? status : undefined,
      limit: Number(p.get('limit')) || 100,
    }),
  });
}

export async function POST(req: Request) {
  const rl = rateLimit(`claim:${clientKey(req)}`, 5, 2);
  if (!rl.ok) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }
  const v = validateClaim(registry(), body);
  if (!v.ok) return NextResponse.json({ error: 'validation_failed', fields: v.errors }, { status: 422 });
  return NextResponse.json({ claim: createClaim(v.value) }, { status: 201 });
}
