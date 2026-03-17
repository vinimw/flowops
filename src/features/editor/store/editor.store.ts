import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Flow, Position, NodeType, DomainEdge } from "@/domain/flow/types";
import { validateFlow } from "@/domain/flow/validate";
import { createId } from "@/shared/lib/id";
import { createNode } from "@/domain/flow/factory";
import { CommandStack } from "@/features/editor/commands/command-stack";
import type { Command } from "@/features/editor/commands/command-stack";
import {
  addNodeCommand,
  addEdgeCommand,
  deleteNodeCommand,
  deleteEdgeCommand,
  moveNodeCommand,
  updateNodeDataCommand,
} from "@/features/editor/commands/commands";

type EditorState = {
  flow: Flow | null;
  selectedNodeId: string | null;
  dirty: boolean;
  addNode: (type: NodeType) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  addEdge: (source: string, target: string, label?: string) => void;
  commandStack: CommandStack;
  dispatch: (cmd: Command) => void;
  undo: () => void;
  redo: () => void;
  updateNodeData: (nodeId: string, nextData: Record<string, unknown>) => void;

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
    commandStack: new CommandStack(),

    setFlow: (flow) => {
      const stack = get().commandStack;
      stack.reset();
      set({
        flow,
        dirty: false,
        selectedNodeId: null,
        diagnostics: validateFlow(flow),
      });
    },

    updateNodeData: (nodeId, nextData) => {
      const flow = get().flow;
      if (!flow) return;

      const node = flow.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const prevData = node.data;
      if (prevData === nextData) return;

      get().dispatch(updateNodeDataCommand(nodeId, prevData, nextData));
    },

    selectNode: (id) => set({ selectedNodeId: id }),

    dispatch: (cmd) => {
      const flow = get().flow;
      if (!flow) return;

      const stack = get().commandStack;
      const next = stack.apply(flow, cmd);

      set({
        flow: next,
        dirty: true,
        diagnostics: validateFlow(next),
      });
    },

    undo: () => {
      const flow = get().flow;
      if (!flow) return;

      const stack = get().commandStack;
      const next = stack.undo(flow);

      set({
        flow: next,
        dirty: true,
        diagnostics: validateFlow(next),
      });
    },

    redo: () => {
      const flow = get().flow;
      if (!flow) return;

      const stack = get().commandStack;
      const next = stack.redo(flow);

      set({
        flow: next,
        dirty: true,
        diagnostics: validateFlow(next),
      });
    },

    addNode: (type) => {
      const flow = get().flow;
      if (!flow) return;

      const count = flow.nodes.length;
      const position = { x: 80 + count * 40, y: 120 + count * 30 };

      const nodeId = createId("node");
      const node = createNode(type, nodeId, position);

      get().dispatch(addNodeCommand(node));
      set({ selectedNodeId: nodeId });
    },

    updateNodePosition: (nodeId, to) => {
      const flow = get().flow;
      if (!flow) return;

      const node = flow.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const from = node.position;
      if (from.x === to.x && from.y === to.y) return;

      get().dispatch(moveNodeCommand(nodeId, from, to));
    },

    deleteNode: (nodeId) => {
      const flow = get().flow;
      if (!flow) return;

      const node = flow.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const attachedEdges = flow.edges.filter(
        (e) => e.source === nodeId || e.target === nodeId
      );

      get().dispatch(deleteNodeCommand(node, attachedEdges));

      if (get().selectedNodeId === nodeId) {
        set({ selectedNodeId: null });
      }
    },

    deleteEdge: (edgeId) => {
      const flow = get().flow;
      if (!flow) return;

      const edge = flow.edges.find((e) => e.id === edgeId);
      if (!edge) return;

      get().dispatch(deleteEdgeCommand(edge));
    },

    addEdge: (source, target, label) => {
      const flow = get().flow;
      if (!flow) return;

      const nodeIds = new Set(flow.nodes.map((n) => n.id));
      if (!nodeIds.has(source) || !nodeIds.has(target)) return;

      const dup = flow.edges.some(
        (e) =>
          e.source === source &&
          e.target === target &&
          (e.label ?? "") === (label ?? "")
      );
      if (dup) return;

      const edge: DomainEdge = {
        id: createId("edge"),
        source,
        target,
        label,
      };

      get().dispatch(addEdgeCommand(edge));
    },

    markSaved: () => set({ dirty: false }),
  }))
);
