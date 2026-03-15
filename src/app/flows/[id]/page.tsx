'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useFlowById, useUpdateFlow } from '@/features/flows/hooks/useFlows';
import { validateFlow, hasBlockingErrors } from '@/domain/flow/validate';
import { FlowCanvas } from '@/features/editor/components/Canvas/FlowCanvas';
import { NodeInspector } from '@/features/editor/components/Inspector/NodeInspector';

export default function FlowEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: flow, isLoading, error } = useFlowById(id);
  const update = useUpdateFlow(id);

  const diagnostics = useMemo(() => (flow ? validateFlow(flow) : []), [flow]);
  const blocking = useMemo(() => hasBlockingErrors(diagnostics), [diagnostics]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(() => {
  if (!flow || !selectedNodeId) return null;
    return flow.nodes.find((n) => n.id === selectedNodeId) ?? null;
  }, [flow, selectedNodeId]);

  if (isLoading) return <main style={{ padding: 24 }}>Loading...</main>;
  if (error || !flow) return <main style={{ padding: 24 }}>Flow not found.</main>;

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>{flow.name}</h1>
          <div style={{ fontSize: 12, opacity: 0.7 }}>ID: {flow.id}</div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => update.mutate(flow)}
            disabled={update.isPending || blocking}
            title={blocking ? 'Fix validation errors before saving.' : 'Save'}
          >
            Save
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12 }}>
        <FlowCanvas
            nodes={flow.nodes}
            edges={flow.edges}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
        />
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