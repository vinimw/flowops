'use client';

import { Handle, Position } from 'reactflow';

export function OutputNode({ data }: { data: any }) {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
      <strong>Output</strong>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{data?.domain?.data?.format ?? 'text'}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}