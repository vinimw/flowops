'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCreateFlow } from '@/features/flows/hooks/useFlows';

export default function NewFlowPage() {
  const [name, setName] = useState('');
  const create = useCreateFlow();
  const router = useRouter();

  return (
    <main style={{ padding: 24 }}>
      <h1>Create Flow</h1>

      <div style={{ marginTop: 12, display: 'grid', gap: 10, maxWidth: 420 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Flow name"
          style={{ padding: 8 }}
        />
        <button
          onClick={async () => {
            const n = name.trim();
            if (!n) return alert('Name is required');
            const flow = await create.mutateAsync(n);
            router.push(`/flows/${flow.id}`);
          }}
          disabled={create.isPending}
        >
          Create
        </button>
      </div>
    </main>
  );
}