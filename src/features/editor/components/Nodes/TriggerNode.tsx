'use client';

import { Handle, Position } from 'reactflow';

export function TriggerNode({ data }: { data: any }) {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
      <strong>Trigger</strong>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{data?.domain?.data?.triggerType ?? 'manual'}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}