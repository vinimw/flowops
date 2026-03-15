import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Flow, DomainNode, Position } from '@/domain/flow/types';
import { validateFlow } from '@/domain/flow/validate';

type EditorState = {
  flow: Flow | null;
  selectedNodeId: string | null;
  dirty: boolean;

  diagnostics: ReturnType<typeof validateFlow>;

  setFlow: (flow: Flow) => void;
  selectNode: (id: string | null) => void;

  updateNodePosition: (nodeId: string, position: Position) => void;
  markSaved: () => void;
};

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    flow: null,
    selectedNodeId: null,
    dirty: false,
    diagnostics: [],

    setFlow: (flow) =>
      set({
        flow,
        dirty: false,
        selectedNodeId: null,
        diagnostics: validateFlow(flow),
      }),

    selectNode: (id) => set({ selectedNodeId: id }),

    updateNodePosition: (nodeId, position) => {
      const flow = get().flow;
      if (!flow) return;

      const nodes = flow.nodes.map((n) =>
        n.id === nodeId ? ({ ...n, position } as DomainNode) : n,
      );

      const next = { ...flow, nodes };
      set({
        flow: next,
        dirty: true,
        diagnostics: validateFlow(next),
      });
    },

    markSaved: () => set({ dirty: false }),
  })),
);