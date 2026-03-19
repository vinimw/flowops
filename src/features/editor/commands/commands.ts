import type { Command } from "./command-stack";
import type {
  Flow,
  DomainEdge,
  DomainNode,
  Position,
} from "@/domain/flow/types";

export function addNodeCommand(node: DomainNode): Command {
  return {
    name: "ADD_NODE",
    do: (flow) => ({ ...flow, nodes: [...flow.nodes, node] }),
    undo: (flow) => ({
      ...flow,
      nodes: flow.nodes.filter((n) => n.id !== node.id),
      edges: flow.edges.filter(
        (e) => e.source !== node.id && e.target !== node.id
      ),
    }),
  };
}

export function moveNodeCommand(
  nodeId: string,
  from: Position,
  to: Position
): Command {
  return {
    name: "MOVE_NODE",
    do: (flow) => ({
      ...flow,
      nodes: flow.nodes.map((n) =>
        n.id === nodeId ? { ...n, position: to } : n
      ),
    }),
    undo: (flow) => ({
      ...flow,
      nodes: flow.nodes.map((n) =>
        n.id === nodeId ? { ...n, position: from } : n
      ),
    }),
  };
}

export function addEdgeCommand(edge: DomainEdge): Command {
  return {
    name: "ADD_EDGE",
    do: (flow) => ({ ...flow, edges: [...flow.edges, edge] }),
    undo: (flow) => ({
      ...flow,
      edges: flow.edges.filter((e) => e.id !== edge.id),
    }),
  };
}

export function deleteEdgeCommand(edge: DomainEdge): Command {
  return {
    name: "DELETE_EDGE",
    do: (flow) => ({
      ...flow,
      edges: flow.edges.filter((e) => e.id !== edge.id),
    }),
    undo: (flow) => ({ ...flow, edges: [...flow.edges, edge] }),
  };
}

export function deleteNodeCommand(
  node: DomainNode,
  attachedEdges: DomainEdge[]
): Command {
  return {
    name: "DELETE_NODE",
    do: (flow) => ({
      ...flow,
      nodes: flow.nodes.filter((n) => n.id !== node.id),
      edges: flow.edges.filter(
        (e) => e.source !== node.id && e.target !== node.id
      ),
    }),
    undo: (flow) => ({
      ...flow,
      nodes: [...flow.nodes, node],
      edges: [...flow.edges, ...attachedEdges],
    }),
  };
}

export function updateNodeDataCommand(
  nodeId: string,
  prevData: Record<string, unknown>,
  nextData: Record<string, unknown>
): Command {
  return {
    name: "UPDATE_NODE_DATA",
    do: (flow) => ({
      ...flow,
      nodes: flow.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: nextData } : n
      ),
    }),
    undo: (flow) => ({
      ...flow,
      nodes: flow.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: prevData } : n
      ),
    }),
  };
}
