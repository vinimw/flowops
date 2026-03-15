'use client';

import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

import type { DomainEdge, DomainNode } from '@/domain/flow/types';
import { domainEdgesToRF, domainNodesToRF } from '@/features/editor/adapters/reactflow.adapter';

export function FlowCanvas({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId,
}: {
  nodes: DomainNode[];
  edges: DomainEdge[];
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
}) {
  const rfNodes = domainNodesToRF(nodes).map((n) => ({
    ...n,
    selected: n.id === selectedNodeId,
  }));

  const rfEdges = domainEdgesToRF(edges);

  return (
    <div style={{ height: 520, border: '1px solid #ddd', borderRadius: 8 }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        onNodeClick={(_, node) => onSelectNode?.(node.id)}
        onPaneClick={() => onSelectNode?.(null)}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}