import { expect, it } from "vitest";
import type { Flow } from "./types";
import { validateFlow } from "./validate";

function baseFlow(overrides?: Partial<Flow>): Flow {
  const now = new Date().toISOString();
  return {
    id: "flow_1",
    name: "Test Flow",
    schemaVersion: 1,
    nodes: [],
    edges: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

it("returns error when there is no trigger", () => {
  const flow = baseFlow({
    nodes: [
      {
        id: "o1",
        type: "output",
        position: { x: 0, y: 0 },
        data: { format: "text", storeAs: "result" },
      },
    ],
  });

  const diags = validateFlow(flow);
  expect(
    diags.some((d) => d.code === "NO_TRIGGER" && d.severity === "error")
  ).toBe(true);
});

it("returns error when there is no output", () => {
  const flow = baseFlow({
    nodes: [
      {
        id: "t1",
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { triggerType: "manual", description: "start" },
      },
    ],
  });

  const diags = validateFlow(flow);
  expect(
    diags.some((d) => d.code === "NO_OUTPUT" && d.severity === "error")
  ).toBe(true);
});

it("returns error when an edge references a missing node", () => {
  const flow = baseFlow({
    nodes: [
      {
        id: "t1",
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { triggerType: "manual" },
      },
      {
        id: "o1",
        type: "output",
        position: { x: 100, y: 0 },
        data: { format: "text", storeAs: "result" },
      },
    ],
    edges: [{ id: "e1", source: "t1", target: "MISSING" }],
  });

  const diags = validateFlow(flow);
  expect(
    diags.some(
      (d) => d.code === "EDGE_INVALID_ENDPOINT" && d.severity === "error"
    )
  ).toBe(true);
});

it("returns error when there is a cycle", () => {
  const flow = baseFlow({
    nodes: [
      {
        id: "t1",
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { triggerType: "manual" },
      },
      {
        id: "a1",
        type: "agent",
        position: { x: 100, y: 0 },
        data: { agentName: "Agent", instruction: "Do", model: "mock" },
      },
      {
        id: "o1",
        type: "output",
        position: { x: 200, y: 0 },
        data: { format: "text", storeAs: "result" },
      },
    ],
    edges: [
      { id: "e1", source: "t1", target: "a1" },
      { id: "e2", source: "a1", target: "t1" },
    ],
  });

  const diags = validateFlow(flow);
  expect(
    diags.some((d) => d.code === "CYCLE_DETECTED" && d.severity === "error")
  ).toBe(true);
});

it("returns error when condition node has no outgoing edges", () => {
  const flow = baseFlow({
    nodes: [
      {
        id: "t1",
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { triggerType: "manual" },
      },
      {
        id: "c1",
        type: "condition",
        position: { x: 100, y: 0 },
        data: { expression: "true" },
      },
      {
        id: "o1",
        type: "output",
        position: { x: 200, y: 0 },
        data: { format: "text", storeAs: "result" },
      },
    ],
    edges: [{ id: "e1", source: "t1", target: "c1" }],
  });

  const diags = validateFlow(flow);
  expect(
    diags.some(
      (d) => d.code === "CONDITION_NO_OUTPUT" && d.severity === "error"
    )
  ).toBe(true);
});
