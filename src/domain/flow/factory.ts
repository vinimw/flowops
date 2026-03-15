import type { DomainNode, NodeType, Position } from "./types";

export function createNode(
  type: NodeType,
  id: string,
  position: Position
): DomainNode {
  switch (type) {
    case "trigger":
      return {
        id,
        type: "trigger",
        position,
        data: { triggerType: "manual", description: "Start" },
      };
    case "agent":
      return {
        id,
        type: "agent",
        position,
        data: {
          agentName: "Agent",
          instruction: "",
          model: "mock",
          timeoutMs: 15000,
        },
      };
    case "condition":
      return {
        id,
        type: "condition",
        position,
        data: { expression: "", trueLabel: "true", falseLabel: "false" },
      };
    case "action":
      return {
        id,
        type: "action",
        position,
        data: { actionType: "http_request", config: {} },
      };
    case "output":
      return {
        id,
        type: "output",
        position,
        data: { format: "text", storeAs: "result" },
      };
  }
}
