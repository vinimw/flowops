'use client';

import type { NodeType } from '@/domain/flow/types';

export function EditorToolbar({ onAdd }: { onAdd: (type: NodeType) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button onClick={() => onAdd('trigger')}>+ Trigger</button>
      <button onClick={() => onAdd('agent')}>+ Agent</button>
      <button onClick={() => onAdd('condition')}>+ Condition</button>
      <button onClick={() => onAdd('action')}>+ Action</button>
      <button onClick={() => onAdd('output')}>+ Output</button>
    </div>
  );
}