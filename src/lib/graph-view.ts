/** 계보 지도 기본 화면(관련 관계 숨김)에서 빠지는 알고리즘 수. 'related'는 파생이 아니므로 연결로 세지 않는다. */
export const unlinkedCount = (nodes: { slug: string }[], edges: { from: string; to: string; status: string }[]) => {
  const linked = new Set(edges.filter((e) => e.status !== 'related').flatMap((e) => [e.from, e.to]));
  return nodes.filter((n) => !linked.has(n.slug)).length;
};

/** 계보 지도 화면에 그릴 노드·엣지. 분야를 고르면 그 분야 노드와 이웃을 남기고, 이웃은 흐리게(dim) 표시한다. */
export const graphView = <N extends { slug: string; field: string }, E extends { from: string; to: string; status: string }>(
  nodes: N[], edges: E[], field: string | null, related: boolean,
) => {
  const es = edges.filter((e) => related || e.status !== 'related');
  if (!field) {
    const used = new Set(es.flatMap((e) => [e.from, e.to]));
    return { nodes: nodes.filter((n) => used.has(n.slug)), edges: es, dim: [] as string[] };
  }
  const core = new Set(nodes.filter((n) => n.field === field).map((n) => n.slug));
  const sub = es.filter((e) => core.has(e.from) || core.has(e.to));
  const keep = new Set([...core, ...sub.flatMap((e) => [e.from, e.to])]);
  return { nodes: nodes.filter((n) => keep.has(n.slug)), edges: sub, dim: [...keep].filter((s) => !core.has(s)) };
};
