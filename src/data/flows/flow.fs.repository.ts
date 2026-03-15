// src/data/flows/flow.fs.repository.ts
import fs from "node:fs/promises";
import path from "node:path";
import type { Flow } from "@/domain/flow/types";
import type { FlowRepository } from "./flow.repository";

const DATA_FILE = path.join(process.cwd(), "data", "flows.json");

async function readAll(): Promise<Flow[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Flow[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(flows: Flow[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(flows, null, 2), "utf-8");
}

export class FsFlowRepository implements FlowRepository {
  async list(): Promise<Flow[]> {
    const flows = await readAll();
    // ordena por updatedAt desc
    return flows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getById(id: string): Promise<Flow | null> {
    const flows = await readAll();
    return flows.find((f) => f.id === id) ?? null;
  }

  async create(flow: Flow): Promise<Flow> {
    const flows = await readAll();
    flows.push(flow);
    await writeAll(flows);
    return flow;
  }

  async update(id: string, flow: Flow): Promise<Flow> {
    const flows = await readAll();
    const idx = flows.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error("FLOW_NOT_FOUND");
    flows[idx] = flow;
    await writeAll(flows);
    return flow;
  }

  async delete(id: string): Promise<void> {
    const flows = await readAll();
    const next = flows.filter((f) => f.id !== id);
    await writeAll(next);
  }

  async duplicate(id: string, newFlow: Flow): Promise<Flow> {
    const existing = await this.getById(id);
    if (!existing) throw new Error("FLOW_NOT_FOUND");
    const flows = await readAll();
    flows.push(newFlow);
    await writeAll(flows);
    return newFlow;
  }
}

export const flowRepo = new FsFlowRepository();
