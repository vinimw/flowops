'use client';

import type { DomainNode } from '@/domain/flow/types';

export function NodeInspector({ node }: { node: DomainNode | null }) {
  if (!node) {
    return (
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <strong>No node selected</strong>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Node</h3>
      <div style={{ fontSize: 12, opacity: 0.7 }}>ID: {node.id}</div>
      <div style={{ marginTop: 8 }}>
        <strong>Type:</strong> {node.type}
      </div>
      <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(node.data, null, 2)}
      </pre>
    </div>
  );
}