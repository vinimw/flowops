import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { flowsApi } from '../services/flows.api';
import { flowsKeys } from '../services/flows.keys';
import type { Flow } from '@/domain/flow/types';

export function useFlowsList() {
  return useQuery({
    queryKey: flowsKeys.list(),
    queryFn: flowsApi.list,
  });
}

export function useFlowById(id: string) {
  return useQuery({
    queryKey: flowsKeys.byId(id),
    queryFn: () => flowsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => flowsApi.create(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: flowsKeys.list() }),
  });
}

export function useUpdateFlow(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (flow: Flow) => flowsApi.update(id, flow),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: flowsKeys.list() });
      qc.invalidateQueries({ queryKey: flowsKeys.byId(id) });
    },
  });
}

export function useDeleteFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => flowsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: flowsKeys.list() }),
  });
}