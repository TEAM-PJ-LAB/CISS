'use client';

import dagre from '@dagrejs/dagre';
import {
  Background, Controls, Handle, MarkerType, Position, ReactFlow,
  type Edge, type Node, type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRouter } from 'next/navigation';
import { memo, useMemo, type CSSProperties } from 'react';
import { useI18n } from '@/i18n/client';

export interface GNode { slug: string; name: string; field: string; year: string }
export interface GEdge { id: string; from: string; to: string; label: string; status: 'verified' | 'estimated' | 'related' }

type Data = GNode & { focus: boolean; dim: boolean } & Record<string, unknown>;

const W = 184;
const H = 54;

const AlgoNode = memo(function AlgoNode({ data }: NodeProps<Node<Data>>) {
  return (
    <div className={`gnode${data.focus ? ' focus' : ''}${data.dim ? ' dim' : ''}`} style={{ '--fc': `var(--f-${data.field})` } as CSSProperties} title={`${data.name} (${data.year})`}>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <b>{data.name}</b>
      <span>{data.year}</span>
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </div>
  );
});
const nodeTypes = { algo: AlgoNode };

const STROKE: Record<GEdge['status'], CSSProperties> = {
  verified: { stroke: 'var(--verified)', strokeWidth: 1.8 },
  estimated: { stroke: 'var(--estimated)', strokeWidth: 1.6, strokeDasharray: '6 4' },
  related: { stroke: 'var(--related)', strokeWidth: 1.4, strokeDasharray: '1.5 4' },
};

function layoutComponent(nodes: GNode[], edges: GEdge[]) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'TB', nodesep: 26, ranksep: 64, marginx: 0, marginy: 0 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const n of nodes) g.setNode(n.slug, { width: W, height: H });
  for (const e of edges) if (e.status !== 'related') g.setEdge(e.from, e.to);
  dagre.layout(g);
  const pos = new Map(nodes.map((n) => { const p = g.node(n.slug); return [n.slug, { x: p.x - W / 2, y: p.y - H / 2 }]; }));
  const xs = [...pos.values()];
  const minX = Math.min(...xs.map((p) => p.x)), minY = Math.min(...xs.map((p) => p.y));
  for (const p of pos.values()) { p.x -= minX; p.y -= minY; }
  return { pos, w: Math.max(...xs.map((p) => p.x)) + W, h: Math.max(...xs.map((p) => p.y)) + H };
}

/** 약연결 요소별로 dagre 배치 후, 큰 요소부터 화면비(≈16:10)에 맞춰 줄 단위로 쌓는다. */
export function layout(nodes: GNode[], edges: GEdge[], aspect = 1.6) {
  const parent = new Map(nodes.map((n) => [n.slug, n.slug]));
  const find = (x: string): string => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x)!)), parent.get(x)!));
  for (const e of edges) if (e.status !== 'related' && parent.has(e.from) && parent.has(e.to)) parent.set(find(e.from), find(e.to));
  const groups = new Map<string, GNode[]>();
  for (const n of nodes) groups.set(find(n.slug), [...(groups.get(find(n.slug)) ?? []), n]);
  const comps = [...groups.values()].map((ns) => {
    const set = new Set(ns.map((n) => n.slug));
    return layoutComponent(ns, edges.filter((e) => set.has(e.from) && set.has(e.to)));
  }).sort((a, b) => b.w * b.h - a.w * a.h);
  if (comps.length === 1) return comps[0].pos;
  const GAP = 72;
  const area = comps.reduce((s, c) => s + (c.w + GAP) * (c.h + GAP), 0);
  const maxW = Math.max(Math.sqrt(area * aspect), ...comps.map((c) => c.w));
  const out = new Map<string, { x: number; y: number }>();
  let x = 0, y = 0, rowH = 0;
  for (const c of comps) {
    if (x > 0 && x + c.w > maxW) { x = 0; y += rowH + GAP; rowH = 0; }
    for (const [k, p] of c.pos) out.set(k, { x: p.x + x, y: p.y + y });
    x += c.w + GAP;
    rowH = Math.max(rowH, c.h);
  }
  return out;
}

export default function LineageGraph({ nodes, edges, focus, dim, labels = true, height = 520, controls = true, className = '' }: {
  nodes: GNode[]; edges: GEdge[]; focus?: string; dim?: string[]; labels?: boolean; height?: number; controls?: boolean; className?: string;
}) {
  const router = useRouter();
  const { t, href } = useI18n();
  const { rfNodes, rfEdges } = useMemo(() => {
    const pos = layout(nodes, edges);
    const dimmed = new Set(dim);
    return {
      rfNodes: nodes.map<Node<Data>>((n) => ({
        id: n.slug, type: 'algo', position: pos.get(n.slug)!, draggable: false,
        data: { ...n, focus: n.slug === focus, dim: dimmed.has(n.slug) },
      })),
      rfEdges: edges.map<Edge>((e) => ({
        id: e.id, source: e.from, target: e.to, style: STROKE[e.status],
        label: labels && e.status !== 'related' ? e.label : undefined,
        markerEnd: e.status === 'related' ? undefined : { type: MarkerType.ArrowClosed, width: 16, height: 16, color: STROKE[e.status].stroke as string },
      })),
    };
  }, [nodes, edges, focus, dim, labels]);

  if (!nodes.length) return <p className="muted">{t('graph.empty')}</p>;

  return (
    <div className={`graph ${className}`} style={{ '--h': `${height}px` } as CSSProperties} role="figure" aria-label={t('graph.aria', { n: nodes.length, m: edges.length })}>
      <ReactFlow
        nodes={rfNodes} edges={rfEdges} nodeTypes={nodeTypes}
        fitView fitViewOptions={{ padding: 0.12, maxZoom: 1.1 }} minZoom={0.15} maxZoom={2}
        nodesConnectable={false} elementsSelectable={false} proOptions={{ hideAttribution: true }}
        onNodeClick={(_, n) => n.id !== focus && router.push(href(`/algorithms/${n.id}`))}
      >
        <Background gap={24} size={1} color="var(--rule)" />
        {controls && <Controls showInteractive={false} position="bottom-right" />}
      </ReactFlow>
    </div>
  );
}
