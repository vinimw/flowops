import type { Flow } from '@/domain/flow/types';

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error ?? `HTTP_${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const flowsApi = {
  list: () => http<Flow[]>('/api/flows'),
  getById: (id: string) => http<Flow>(`/api/flows/${id}`),
  create: (name: string) => http<Flow>('/api/flows', { method: 'POST', body: JSON.stringify({ name }) }),
  update: (id: string, flow: Flow) =>
    http<Flow>(`/api/flows/${id}`, { method: 'PUT', body: JSON.stringify(flow) }),
  remove: (id: string) => http<{ ok: true }>(`/api/flows/${id}`, { method: 'DELETE' }),
};