import { FIELDS, type Field } from '@/data/types';
import { algorithmsPayload, json } from '@/lib/api';
import { registry } from '@/lib/registry';

export function GET(req: Request) {
  const r = registry();
  const field = new URL(req.url).searchParams.get('field') as Field | null;
  return json(algorithmsPayload(r, r.algorithms.filter((a) => !field || (FIELDS.includes(field) && a.field === field))));
}
