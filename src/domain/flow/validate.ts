import type { Diagnostic, DomainEdge, Flow } from './types';
import { detectCycle } from './graph';

function indexNodes(flow: Flow) {
  const map = new Map(flow.nodes.map((n) => [n.id, n]));
  return map;
}

function outgoingEdges(edges: DomainEdge[], nodeId: string) {
  return edges.filter((e) => e.source === nodeId);
}

export function validateFlow(flow: Flow): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const nodeById = indexNodes(flow);

  const triggers = flow.nodes.filter((n) => n.type === 'trigger');
  const outputs = flow.nodes.filter((n) => n.type === 'output');

  if (triggers.length === 0) {
    diagnostics.push({
      code: 'NO_TRIGGER',
      severity: 'error',
      message: 'Flow must have exactly 1 Trigger node, but none was found.',
    });
  } else if (triggers.length > 1) {
    diagnostics.push({
      code: 'MULTIPLE_TRIGGERS',
      severity: 'error',
      message: 'Flow must have exactly 1 Trigger node, but multiple were found.',
    });
  }

  if (outputs.length === 0) {
    diagnostics.push({
      code: 'NO_OUTPUT',
      severity: 'error',
      message: 'Flow must have at least 1 Output node.',
    });
  }

  for (const e of flow.edges) {
    const sourceOk = nodeById.has(e.source);
    const targetOk = nodeById.has(e.target);
    if (!sourceOk || !targetOk) {
      diagnostics.push({
        code: 'EDGE_INVALID_ENDPOINT',
        severity: 'error',
        message: 'Edge references a missing source or target node.',
        edgeId: e.id,
      });
    }
  }

  if (flow.nodes.length > 0 && detectCycle(flow.nodes, flow.edges)) {
    diagnostics.push({
      code: 'CYCLE_DETECTED',
      severity: 'error',
      message: 'Cycles are not allowed in MVP runs.',
    });
  }

  for (const node of flow.nodes) {
    if (node.type !== 'condition') continue;

    const outs = outgoingEdges(flow.edges, node.id);

    if (outs.length === 0) {
      diagnostics.push({
        code: 'CONDITION_NO_OUTPUT',
        severity: 'error',
        message: 'Condition node must have at least one outgoing edge.',
        nodeId: node.id,
      });
      continue;
    }

    const labels = new Set(
      outs.map((e) => (e.label ?? '').trim().toLowerCase()).filter(Boolean),
    );

    const hasTrue = labels.has('true');
    const hasFalse = labels.has('false');

    if (!(hasTrue && hasFalse)) {
      diagnostics.push({
        code: 'CONDITION_MISSING_BRANCH',
        severity: 'warn',
        message: 'Condition node should have both "true" and "false" labeled branches.',
        nodeId: node.id,
      });
    }
  }

  return diagnostics;
}

export function hasBlockingErrors(diagnostics: Diagnostic[]): boolean {
  return diagnostics.some((d) => d.severity === 'error');
}