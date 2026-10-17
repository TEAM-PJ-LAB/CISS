import { FIELDS, type Field } from '@/data/types';
import { apiAlgorithm, json } from '@/lib/api';
import { registry } from '@/lib/registry';

export function GET(req: Request) {
  const r = registry();
  const field = new URL(req.url).searchParams.get('field') as Field | null;
  const list = r.algorithms.filter((a) => !field || (FIELDS.includes(field) && a.field === field));
  return json({ count: list.length, algorithms: list.map((a) => apiAlgorithm(r, a)) });
}
