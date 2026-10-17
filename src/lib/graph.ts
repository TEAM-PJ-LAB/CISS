import type { GEdge, GNode } from '@/components/LineageGraph';
import type { Algorithm, Derivation } from '@/data/types';
import { formatYear } from '@/i18n';
import type { Ctx } from './ctx';

export const toGraph = (x: Ctx, nodes: Algorithm[], edges: Derivation[]): { nodes: GNode[]; edges: GEdge[] } => ({
  nodes: nodes.map((a) => ({ slug: a.slug, name: a.name, field: a.field, year: formatYear(x.t, x.r.yearOf(a.slug)) })),
  edges: edges.map((e) => ({ id: e.id, from: e.from, to: e.to, status: e.status, label: x.t(`type.${e.type}`) })),
});
