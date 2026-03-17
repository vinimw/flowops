'use client';

import { useEffect, useMemo, useState } from 'react';
import { useEditorStore } from '@/features/editor/store/editor.store';
import { useParams } from 'next/navigation';
import { useFlowById, useUpdateFlow } from '@/features/flows/hooks/useFlows';
import { validateFlow, hasBlockingErrors } from '@/domain/flow/validate';
import { FlowCanvas } from '@/features/editor/components/Canvas/FlowCanvas';
import { NodeInspector } from '@/features/editor/components/Inspector/NodeInspector';
import { EditorToolbar } from '@/features/editor/components/Toolbar/EditorToolbar';


export default function FlowEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  
  
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const deleteNode = useEditorStore((s) => s.deleteNode);
  const deleteEdge = useEditorStore((s) => s.deleteEdge);
  
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  const addEdge = useEditorStore((s) => s.addEdge);
  
  const { data: flow, isLoading, error } = useFlowById(id);
  const update = useUpdateFlow(id);
  
  const updateNodePosition = useEditorStore((s) => s.updateNodePosition);
  
  const addNode = useEditorStore((s) => s.addNode);
  const editorFlow = useEditorStore((s) => s.flow);
  const selectNode = useEditorStore((s) => s.selectNode);
  const dirty = useEditorStore((s) => s.dirty);
  const diagnostics = useEditorStore((s) => s.diagnostics);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const blocking = useMemo(() => hasBlockingErrors(diagnostics), [diagnostics]);
  
  const setFlow = useEditorStore((s) => s.setFlow);

  useEffect(() => {
  if (!flow) return;
  if (!editorFlow || editorFlow.id !== flow.id) {
    setFlow(flow);
  }
}, [flow, editorFlow, setFlow]);

useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    const isMod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();

    const el = e.target as HTMLElement | null;
    const tag = el?.tagName?.toLowerCase();
    const isTyping =
      tag === 'input' || tag === 'textarea' || (el as HTMLElement | null)?.isContentEditable;

    if (isMod && !isTyping && key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
      return;
    }

    if (isMod && !isTyping && key === 'y') {
      e.preventDefault();
      redo();
      return;
    }

    if (key === 'escape') {
      selectNode(null);
      setSelectedEdgeId(null);
      return;
    }

    if (!isTyping && (key === 'backspace' || key === 'delete')) {
      if (selectedNodeId) {
        deleteNode(selectedNodeId);
        return;
      }

      if (selectedEdgeId) {
        deleteEdge(selectedEdgeId);
        setSelectedEdgeId(null);
      }
    }
  }

  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, [undo, redo, selectedNodeId, selectedEdgeId, deleteNode, deleteEdge, selectNode]);

  const selectedNode = useMemo(() => {
    if (!editorFlow || !selectedNodeId) return null;
    return editorFlow.nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [editorFlow, selectedNodeId]);

  if (isLoading) return <main style={{ padding: 24 }}>Loading...</main>;
  if (error || !flow) return <main style={{ padding: 24 }}>Flow not found.</main>;

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>{editorFlow?.name ?? flow.name}</h1>
          <div style={{ fontSize: 12, opacity: 0.7 }}>ID: {editorFlow?.id ?? flow.id}</div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => editorFlow && update.mutate(editorFlow, { onSuccess: () => useEditorStore.getState().markSaved() })}
            disabled={update.isPending || !dirty}
          >
            Save
          </button>
        </div>
      </header>
      {editorFlow && (
        <EditorToolbar onAdd={addNode} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12 }}>
        {editorFlow && (
          <FlowCanvas
            nodes={editorFlow.nodes}
            edges={editorFlow.edges}
            selectedNodeId={selectedNodeId}
            onSelectNode={selectNode}
            onMoveNode={(nodeId, pos) => updateNodePosition(nodeId, pos)}
            selectedEdgeId={selectedEdgeId}
            onSelectEdge={setSelectedEdgeId}
            onConnectEdge={(source, target) => addEdge(source, target)}
          />
        )}
        <NodeInspector node={selectedNode} />
      </div>

      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Diagnostics</h2>
        {diagnostics.length === 0 && <p>No issues found.</p>}
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {diagnostics.map((d, idx) => (
            <li key={idx} style={{ color: d.severity === 'error' ? 'crimson' : '#a15c00' }}>
              <strong>{d.severity.toUpperCase()}</strong> — {d.code}: {d.message}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Editor (next step)</h2>
        <p>Next: mount React Flow canvas + inspector + toolbar.</p>
      </section>
    </main>
  );
}