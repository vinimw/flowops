'use client';

import { useEffect, useMemo, useRef } from 'react';
import ReactFlow, { Background, Controls, type ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';

import type { DomainEdge, DomainNode } from '@/domain/flow/types';
import { domainEdgesToRF, domainNodesToRF } from '@/features/editor/adapters/reactflow.adapter';

export function FlowCanvas({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId,
  onMoveNode,
}: {
  nodes: DomainNode[];
  edges: DomainEdge[];
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
  onMoveNode?: (nodeId: string, position: { x: number; y: number }) => void;
}) {
  const rfNodes = useMemo(() => {
    return domainNodesToRF(nodes).map((n) => ({
      ...n,
      selected: n.id === selectedNodeId,
    }));
  }, [nodes, selectedNodeId]);

  const rfEdges = useMemo(() => domainEdgesToRF(edges), [edges]);

  const rf = useRef<ReactFlowInstance | null>(null);
  const didFit = useRef(false);

  useEffect(() => {
    didFit.current = false;
  }, [nodes.length, edges.length]);

  return (
    <div style={{ height: 520, border: '1px solid #ddd', borderRadius: 8 }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        zoomOnScroll
        panOnDrag
        onInit={(instance) => {
          rf.current = instance;
          if (!didFit.current) {
            instance.fitView({ padding: 0.2 });
            didFit.current = true;
          }
        }}
        onNodeClick={(_, node) => onSelectNode?.(node.id)}
        onPaneClick={() => onSelectNode?.(null)}
        onNodeDragStop={(_, node) => onMoveNode?.(node.id, node.position)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}