import { getDb } from '@/lib/db';
import { registry } from '@/lib/registry';

export const dynamic = 'force-dynamic';

/** 배포 플랫폼 헬스체크: 데이터 로드와 SQLite 쓰기 경로를 함께 확인. */
export function GET() {
  try {
    const db = getDb().prepare('SELECT 1 AS ok').get() as { ok: number };
    return Response.json({ ok: db.ok === 1, algorithms: registry().algorithms.length, time: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : 'unknown' }, { status: 503 });
  }
}
