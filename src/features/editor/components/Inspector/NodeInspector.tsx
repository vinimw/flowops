'use client';

import { useMemo } from 'react';
import type { DomainNode } from '@/domain/flow/types';

export function NodeInspector({
  node,
  onChange,
}: {
  node: DomainNode | null;
  onChange: (nodeId: string, nextData: Record<string, unknown>) => void;
}) {
  if (!node) {
    return (
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <strong>No node selected</strong>
      </div>
    );
  }

  const data = node.data as Record<string, unknown>;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Inspector</h3>
      <div style={{ fontSize: 12, opacity: 0.7 }}>ID: {node.id}</div>
      <div style={{ marginTop: 8 }}>
        <strong>Type:</strong> {node.type}
      </div>

      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {node.type === 'agent' && (
          <>
            <label>
              Agent name
              <input
                value={String(data.agentName ?? '')}
                onChange={(e) =>
                  onChange(node.id, { ...data, agentName: e.target.value })
                }
                style={{ width: '100%', padding: 8 }}
              />
            </label>

            <label>
              Instruction
              <textarea
                value={String(data.instruction ?? '')}
                onChange={(e) =>
                  onChange(node.id, { ...data, instruction: e.target.value })
                }
                rows={6}
                style={{ width: '100%', padding: 8 }}
              />
            </label>

            <label>
              Timeout (ms)
              <input
                type="number"
                value={Number(data.timeoutMs ?? 15000)}
                onChange={(e) =>
                  onChange(node.id, { ...data, timeoutMs: Number(e.target.value) })
                }
                style={{ width: '100%', padding: 8 }}
              />
            </label>
          </>
        )}

        {node.type === 'trigger' && (
          <label>
            Description
            <input
              value={String(data.description ?? '')}
              onChange={(e) =>
                onChange(node.id, { ...data, description: e.target.value })
              }
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        )}

        {node.type === 'condition' && (
          <label>
            Expression
            <input
              value={String(data.expression ?? '')}
              onChange={(e) =>
                onChange(node.id, { ...data, expression: e.target.value })
              }
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        )}

        {node.type === 'output' && (
          <label>
            Store as
            <input
              value={String(data.storeAs ?? '')}
              onChange={(e) =>
                onChange(node.id, { ...data, storeAs: e.target.value })
              }
              style={{ width: '100%', padding: 8 }}
            />
          </label>
        )}
      </div>
    </div>
  );
}