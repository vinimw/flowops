'use client';

import { Handle, Position } from 'reactflow';

export function ActionNode({ data }: { data: any }) {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
      <strong>Action</strong>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{data?.domain?.data?.actionType ?? 'http_request'}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}