import type { Flow } from "@/domain/flow/types";

export interface FlowRepository {
  list(): Promise<Flow[]>;
  getById(id: string): Promise<Flow | null>;
  create(flow: Flow): Promise<Flow>;
  update(id: string, flow: Flow): Promise<Flow>;
  delete(id: string): Promise<void>;
  duplicate(id: string, newFlow: Flow): Promise<Flow>;
}
