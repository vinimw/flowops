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
import type { Connection } from 'reactflow';

import { TriggerNode } from '@/features/editor/components/Nodes/TriggerNode';
import { AgentNode } from '@/features/editor/components/Nodes/AgentNode';
import { ActionNode } from '@/features/editor/components/Nodes/ActionNode';
import { OutputNode } from '@/features/editor/components/Nodes/OutputNode';
import { ConditionNode } from '@/features/editor/components/Nodes/ConditionNode';

export function FlowCanvas({
  nodes,
  edges,
  onSelectNode,
  selectedNodeId,
  onMoveNode,
  onSelectEdge,
  selectedEdgeId,
  onDeleteEdge,
  onConnectEdge,
}: {
  nodes: DomainNode[];
  edges: DomainEdge[];
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
  onMoveNode?: (nodeId: string, position: { x: number; y: number }) => void;
  onSelectEdge?: (edgeId: string | null) => void;
  selectedEdgeId?: string | null;
  onDeleteEdge?: (edgeId: string) => void;
  onConnectEdge?: (source: string, target: string) => void;
}) {
  const [rfNodes, setRfNodes] = useState(() => domainNodesToRF(nodes));
  const [rfEdges, setRfEdges] = useState(() => domainEdgesToRF(edges));

  const nodeTypes = {
    trigger: TriggerNode,
    agent: AgentNode,
    action: ActionNode,
    output: OutputNode,
    condition: ConditionNode,
  };
  

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
        nodesConnectable
        elementsSelectable
        panOnDrag
        zoomOnScroll
        nodeTypes={nodeTypes}
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
        onEdgeClick={(_, edge) => onSelectEdge?.(edge.id)}
        onPaneClick={() => {
        if (isDraggingRef.current) return;
        onSelectNode?.(null);
        onSelectEdge?.(null);
        }}
        onConnect={(c: Connection) => {
          if (!c.source || !c.target) return;
          const label = c.sourceHandle === 'true' ? 'true' : c.sourceHandle === 'false' ? 'false' : undefined;
          onConnectEdge?.(c.source, c.target, label);
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}