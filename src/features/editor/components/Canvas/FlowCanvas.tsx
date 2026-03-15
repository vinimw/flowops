'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  type EdgeChange,
  type NodeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import type { DomainEdge, DomainNode } from '@/domain/flow/types';
import { domainEdgesToRF, domainNodesToRF } from '@/features/editor/adapters/reactflow.adapter';

export function FlowCanvas({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId,
  onMoveNode,
  onSelectEdge,
  selectedEdgeId,
  onDeleteEdge,
}: {
  nodes: DomainNode[];
  edges: DomainEdge[];
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
  onMoveNode?: (nodeId: string, position: { x: number; y: number }) => void;
  onSelectEdge?: (edgeId: string | null) => void;
  selectedEdgeId?: string | null;
  onDeleteEdge?: (edgeId: string) => void;
}) {
  const [rfNodes, setRfNodes] = useState(() => domainNodesToRF(nodes));
  const [rfEdges, setRfEdges] = useState(() => domainEdgesToRF(edges));

  useEffect(() => {
    setRfNodes(domainNodesToRF(nodes));
  }, [nodes]);

  useEffect(() => {
    setRfEdges(domainEdgesToRF(edges));
  }, [edges]);


  const selectedId = selectedNodeId ?? null;
  const rfNodesWithSelection = useMemo(() => {
    return rfNodes.map((n) => ({ ...n, selected: n.id === selectedId }));
  }, [rfNodes, selectedId]);

  const rfEdgesWithSelection = useMemo(() => {
  const id = selectedEdgeId ?? null;
    return rfEdges.map((e) => ({ ...e, selected: e.id === id }));
  }, [rfEdges, selectedEdgeId]);

  const isDraggingRef = useRef(false);

  return (
    <div style={{ height: 520, border: '1px solid #ddd', borderRadius: 8 }}>
      <ReactFlow
        nodes={rfNodesWithSelection}
        edges={rfEdgesWithSelection}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        panOnDrag
        zoomOnScroll
        onNodesChange={(changes: NodeChange[]) => {
          setRfNodes((prev) => applyNodeChanges(changes, prev));
        }}
        onEdgesChange={(changes: EdgeChange[]) => {
          setRfEdges((prev) => applyEdgeChanges(changes, prev));
        }}
        onNodeClick={(_, node) => onSelectNode?.(node.id)}
        onNodeDragStart={(_, node) => {
          isDraggingRef.current = true;
          onSelectNode?.(node.id);
        }}
        onNodeDragStop={(_, node) => {
          onMoveNode?.(node.id, node.position);
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 0);
        }}
        onPaneClick={() => {
          if (isDraggingRef.current) return;
          onSelectNode?.(null);
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}