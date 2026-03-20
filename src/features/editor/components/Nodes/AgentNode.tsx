'use client';

import { Handle, Position } from 'reactflow';

export function AgentNode({ data }: { data: any }) {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
      <strong>Agent</strong>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{data?.domain?.data?.agentName ?? 'Agent'}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}