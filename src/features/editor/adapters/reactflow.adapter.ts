import type { Edge as RFEdge, Node as RFNode } from 'reactflow';
import type { DomainEdge, DomainNode } from '@/domain/flow/types';

export type RFNodeData = {
  type: DomainNode['type'];
  label: string;
  domain: DomainNode;
};

export function domainNodesToRF(nodes: DomainNode[]): RFNode<RFNodeData>[] {
  return nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: {
      type: n.type,
      label: nodeLabel(n),
      domain: n,
    },
  }));
}

export function domainEdgesToRF(edges: DomainEdge[]): RFEdge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
  }));
}

function nodeLabel(n: DomainNode): string {
  switch (n.type) {
    case 'trigger':
      return `Trigger (${n.data.triggerType})`;
    case 'agent':
      return `Agent: ${n.data.agentName}`;
    case 'condition':
      return `Condition`;
    case 'action':
      return `Action: ${n.data.actionType}`;
    case 'output':
      return `Output (${n.data.format})`;
    default:
      return 'Node';
  }
}