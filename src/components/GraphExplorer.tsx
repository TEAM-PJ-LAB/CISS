'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { FIELDS, type Field } from '@/data/types';
import { useI18n } from '@/i18n/client';
import LineageGraph, { type GEdge, type GNode } from './LineageGraph';

export default function GraphExplorer({ nodes, edges }: { nodes: GNode[]; edges: GEdge[] }) {
  const { t } = useI18n();
  const [field, setField] = useState<Field | null>(null);
  const [related, setRelated] = useState(false);

  const view = useMemo(() => {
    const es = edges.filter((e) => related || e.status !== 'related');
    if (!field) {
      const used = new Set(es.flatMap((e) => [e.from, e.to]));
      return { nodes: nodes.filter((n) => used.has(n.slug)), edges: es, dim: [] as string[] };
    }
    const core = new Set(nodes.filter((n) => n.field === field).map((n) => n.slug));
    const sub = es.filter((e) => core.has(e.from) || core.has(e.to));
    const keep = new Set([...core, ...sub.flatMap((e) => [e.from, e.to])]);
    return { nodes: nodes.filter((n) => keep.has(n.slug)), edges: sub, dim: [...keep].filter((s) => !core.has(s)) };
  }, [nodes, edges, field, related]);

  return (
    <>
      <div className="explorer-bar">
        <div className="filters" role="group" aria-label={t('algorithms.fieldFilter')}>
          <button type="button" aria-pressed={!field} onClick={() => setField(null)}>{t('common.all')}</button>
          {FIELDS.map((f) => (
            <button key={f} type="button" aria-pressed={f === field} onClick={() => setField(f)} style={{ '--fc': `var(--f-${f})` } as CSSProperties}>
              <i className="fdot" aria-hidden />{t(`field.${f}`)}
            </button>
          ))}
        </div>
        <label className="check"><input type="checkbox" checked={related} onChange={(e) => setRelated(e.target.checked)} />{t('graph.showRelated')}</label>
      </div>
      <p className="small muted" aria-live="polite">{t('graph.count', { n: view.nodes.length, m: view.edges.length })}</p>
      <div className="frame tall">
        <LineageGraph key={`${field}-${related}`} nodes={view.nodes} edges={view.edges} dim={view.dim} labels={view.nodes.length <= 40} height={760} />
      </div>
    </>
  );
}
