'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DomainNode } from '@/domain/flow/types';

type Data = Record<string, unknown>;

function safeJsonParse(value: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function NodeInspector({
  node,
  onChange,
}: {
  node: DomainNode | null;
  onChange: (nodeId: string, nextData: Data) => void;
}) {
  if (!node) {
    return (
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <strong>No node selected</strong>
      </div>
    );
  }

  const data = (node.data ?? {}) as Data;

  // ---- Local buffers for "commit onBlur" fields ----
  const [instructionDraft, setInstructionDraft] = useState(String(data.instruction ?? ''));
  const [configDraft, setConfigDraft] = useState(JSON.stringify(data.config ?? {}, null, 2));
  const [configError, setConfigError] = useState<string | null>(null);

  // When selection changes, refresh drafts
  useEffect(() => {
    setInstructionDraft(String((node.data as any)?.instruction ?? ''));
    setConfigDraft(JSON.stringify((node.data as any)?.config ?? {}, null, 2));
    setConfigError(null);
  }, [node.id]);

  // helpers
  const update = (patch: Partial<Data>) => onChange(node.id, { ...data, ...patch });

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Inspector</h3>
      <div style={{ fontSize: 12, opacity: 0.7 }}>ID: {node.id}</div>
      <div style={{ marginTop: 6 }}>
        <strong>Type:</strong> {node.type}
      </div>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {/* Trigger */}
        {node.type === 'trigger' && (
          <>
            <label style={{ display: 'grid', gap: 6 }}>
              Description
              <input
                value={String(data.description ?? '')}
                onChange={(e) => update({ description: e.target.value })}
                style={{ padding: 8, width: '100%' }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Trigger type (MVP)
              <select
                value={String(data.triggerType ?? 'manual')}
                onChange={(e) => update({ triggerType: e.target.value })}
                style={{ padding: 8, width: '100%' }}
              >
                <option value="manual">manual</option>
                <option value="webhook" disabled>
                  webhook (post-MVP)
                </option>
              </select>
            </label>
          </>
        )}

        {/* Agent */}
        {node.type === 'agent' && (
          <>
            <label style={{ display: 'grid', gap: 6 }}>
              Agent name
              <input
                value={String(data.agentName ?? '')}
                onChange={(e) => update({ agentName: e.target.value })}
                style={{ padding: 8, width: '100%' }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Model (MVP)
              <select
                value={String(data.model ?? 'mock')}
                onChange={(e) => update({ model: e.target.value })}
                style={{ padding: 8, width: '100%' }}
              >
                <option value="mock">mock</option>
              </select>
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Timeout (ms)
              <input
                type="number"
                value={Number(data.timeoutMs ?? 15000)}
                onChange={(e) => update({ timeoutMs: Number(e.target.value) })}
                style={{ padding: 8, width: '100%' }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Instruction (commit on blur)
              <textarea
                value={instructionDraft}
                onChange={(e) => setInstructionDraft(e.target.value)}
                onBlur={() => update({ instruction: instructionDraft })}
                rows={6}
                style={{ padding: 8, width: '100%' }}
              />
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Tip: changes are saved when you leave the field.
              </div>
            </label>
          </>
        )}

        {/* Condition */}
        {node.type === 'condition' && (
          <>
            <label style={{ display: 'grid', gap: 6 }}>
              Expression
              <input
                value={String(data.expression ?? '')}
                onChange={(e) => update({ expression: e.target.value })}
                style={{ padding: 8, width: '100%' }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                True label
                <input
                  value={String(data.trueLabel ?? 'true')}
                  onChange={(e) => update({ trueLabel: e.target.value })}
                  style={{ padding: 8, width: '100%' }}
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                False label
                <input
                  value={String(data.falseLabel ?? 'false')}
                  onChange={(e) => update({ falseLabel: e.target.value })}
                  style={{ padding: 8, width: '100%' }}
                />
              </label>
            </div>
          </>
        )}

        {/* Action */}
        {node.type === 'action' && (
          <>
            <label style={{ display: 'grid', gap: 6 }}>
              Action type
              <select
                value={String(data.actionType ?? 'http_request')}
                onChange={(e) => update({ actionType: e.target.value })}
                style={{ padding: 8, width: '100%' }}
              >
                <option value="http_request">http_request</option>
                <option value="transform">transform</option>
                <option value="notify">notify</option>
              </select>
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Config (JSON, commit on blur)
              <textarea
                value={configDraft}
                onChange={(e) => {
                  setConfigDraft(e.target.value);
                  setConfigError(null);
                }}
                onBlur={() => {
                  const parsed = safeJsonParse(configDraft);
                  if (!parsed.ok) {
                    setConfigError(parsed.error);
                    return;
                  }
                  update({ config: parsed.value as any });
                }}
                rows={8}
                style={{ padding: 8, width: '100%', fontFamily: 'ui-monospace, SFMono-Regular' }}
              />
              {configError && <div style={{ color: 'crimson' }}>Invalid JSON: {configError}</div>}
            </label>
          </>
        )}

        {/* Output */}
        {node.type === 'output' && (
          <>
            <label style={{ display: 'grid', gap: 6 }}>
              Format
              <select
                value={String(data.format ?? 'text')}
                onChange={(e) => update({ format: e.target.value })}
                style={{ padding: 8, width: '100%' }}
              >
                <option value="text">text</option>
                <option value="json">json</option>
              </select>
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              Store as
              <input
                value={String(data.storeAs ?? '')}
                onChange={(e) => update({ storeAs: e.target.value })}
                style={{ padding: 8, width: '100%' }}
              />
            </label>
          </>
        )}
      </div>

      <details style={{ marginTop: 12 }}>
        <summary style={{ cursor: 'pointer' }}>Raw data</summary>
        <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
          {JSON.stringify(node.data, null, 2)}
        </pre>
      </details>
    </div>
  );
}