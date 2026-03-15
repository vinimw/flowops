import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Flow, DomainNode, Position } from "@/domain/flow/types";
import { validateFlow } from "@/domain/flow/validate";
import type { NodeType } from "@/domain/flow/types";
import { createId } from "@/shared/lib/id";
import { createNode } from "@/domain/flow/factory";

type EditorState = {
  flow: Flow | null;
  selectedNodeId: string | null;
  dirty: boolean;
  addNode: (type: NodeType) => void;

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

    addNode: (type) => {
      const flow = get().flow;
      if (!flow) return;

      const count = flow.nodes.length;
      const position = { x: 80 + count * 40, y: 120 + count * 30 };

      const nodeId = createId("node");
      const node = createNode(type, nodeId, position);

      const next = { ...flow, nodes: [...flow.nodes, node] };

      set({
        flow: next,
        dirty: true,
        selectedNodeId: nodeId,
        diagnostics: validateFlow(next),
      });
    },

    updateNodePosition: (nodeId, position) => {
      const flow = get().flow;
      if (!flow) return;

      const nodes = flow.nodes.map((n) =>
        n.id === nodeId ? ({ ...n, position } as DomainNode) : n
      );

      const next = { ...flow, nodes };
      set({
        flow: next,
        dirty: true,
        diagnostics: validateFlow(next),
      });
    },

    markSaved: () => set({ dirty: false }),
  }))
);
