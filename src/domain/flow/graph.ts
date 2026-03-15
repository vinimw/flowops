import type { DomainEdge, DomainNode } from "./types";

export function buildAdjacency(nodes: DomainNode[], edges: DomainEdge[]) {
  const nodeIds = new Set(nodes.map((n) => n.id));

  const out = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const id of nodeIds) {
    out.set(id, []);
    inDegree.set(id, 0);
  }

  for (const e of edges) {
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) continue;
    out.get(e.source)!.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  }

  return { out, inDegree, nodeIds };
}

export function topoSort(nodes: DomainNode[], edges: DomainEdge[]): string[] {
  const { out, inDegree, nodeIds } = buildAdjacency(nodes, edges);

  const queue: string[] = [];
  for (const id of nodeIds) {
    if ((inDegree.get(id) ?? 0) === 0) queue.push(id);
  }

  const result: string[] = [];
  const inDeg = new Map(inDegree);

  while (queue.length) {
    const id = queue.shift()!;
    result.push(id);

    for (const to of out.get(id) ?? []) {
      inDeg.set(to, (inDeg.get(to) ?? 0) - 1);
      if ((inDeg.get(to) ?? 0) === 0) queue.push(to);
    }
  }

  return result;
}

export function detectCycle(nodes: DomainNode[], edges: DomainEdge[]): boolean {
  const sorted = topoSort(nodes, edges);
  return sorted.length !== nodes.length;
}
