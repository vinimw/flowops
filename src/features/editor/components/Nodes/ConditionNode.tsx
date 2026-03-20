'use client';

import { Handle, Position } from 'reactflow';

export function ConditionNode({ data }: { data: any }) {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
      <strong>Condition</strong>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{data?.domain?.data?.expression ?? ''}</div>

      <Handle type="target" position={Position.Left} />

      <Handle id="true" type="source" position={Position.Right} style={{ top: 18 }} />

      <Handle id="false" type="source" position={Position.Right} style={{ top: 44 }} />

      <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>
        <div>true →</div>
        <div>false →</div>
      </div>
    </div>
  );
}