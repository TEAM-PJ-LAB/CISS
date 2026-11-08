import { describe, expect, it } from 'vitest';
import { graphView, unlinkedCount } from '@/lib/graph-view';
import { registry } from '@/lib/registry';

const r = registry();

describe('graph lede count', () => {
  it('ignores related edges, which are not derivations', () => {
    const nodes = [{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }, { slug: 'd' }];
    const edges = [{ from: 'a', to: 'b', status: 'verified' }, { from: 'c', to: 'd', status: 'related' }];
    expect(unlinkedCount(nodes, edges)).toBe(2);
  });

  it('matches the nodes the default map view hides (all fields, related edges off)', () => {
    const view = graphView(r.algorithms, r.derivations, null, false);
    expect(unlinkedCount(r.algorithms, r.derivations)).toBe(r.algorithms.length - view.nodes.length);
    expect(view.edges.length).toBe(r.stats().derivations);
  });
});
