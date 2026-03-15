'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useDeleteFlow, useFlowsList } from '@/features/flows/hooks/useFlows';

export default function FlowsPage() {
  const { data, isLoading, error } = useFlowsList();
  const del = useDeleteFlow();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return data ?? [];
    return (data ?? []).filter((f) => f.name.toLowerCase().includes(query));
  }, [data, q]);

  return (
    <main style={{ padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <h1>Flows</h1>
        <Link href="/flows/new">Create</Link>
      </header>

      <div style={{ marginTop: 16 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name..."
          style={{ padding: 8, width: 320 }}
        />
      </div>

      <section style={{ marginTop: 16 }}>
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'crimson' }}>Failed to load flows.</p>}

        {!isLoading && filtered.length === 0 && <p>No flows yet.</p>}

        <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
          {filtered.map((flow) => (
            <li
              key={flow.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <strong>{flow.name}</strong>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Updated: {flow.updatedAt}</div>
                {flow.lastRun && (
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    Last run: {flow.lastRun.status}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Link href={`/flows/${flow.id}`}>Open</Link>

                <button
                  onClick={() => {
                    const json = JSON.stringify(flow, null, 2);
                    navigator.clipboard.writeText(json);
                    alert('Flow JSON copied to clipboard.');
                  }}
                >
                  Export JSON
                </button>

                <button
                  onClick={() => del.mutate(flow.id)}
                  disabled={del.isPending}
                  style={{ color: 'crimson' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}