import { NextResponse } from 'next/server';
import { isAdmin, reviewClaim } from '@/lib/claims';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.CISS_ADMIN_TOKEN) return NextResponse.json({ error: 'review_disabled' }, { status: 503 });
  if (!isAdmin(req.headers.get('authorization'))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = Number((await params).id);
  const body = (await req.json().catch(() => ({}))) as { status?: string; resolution?: string };
  if (!Number.isInteger(id) || (body.status !== 'accepted' && body.status !== 'rejected') || !body.resolution?.trim()) {
    return NextResponse.json({ error: 'status (accepted|rejected) and resolution are required' }, { status: 422 });
  }
  const claim = reviewClaim(id, body.status, body.resolution.trim());
  return claim ? NextResponse.json({ claim }) : NextResponse.json({ error: 'not_found' }, { status: 404 });
}
