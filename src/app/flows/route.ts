import { NextResponse } from "next/server";
import { flowRepo } from "@/data/flows/flow.fs.repository";
import type { Flow } from "@/domain/flow/types";
import { createId } from "@/shared/lib/id";
import { nowIso } from "@/shared/lib/time";

export async function GET() {
  const flows = await flowRepo.list();
  return NextResponse.json(flows);
}

export async function POST(req: Request) {
  const body = (await req.json()) as { name?: string };

  const name = (body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "NAME_REQUIRED" }, { status: 400 });
  }

  const now = nowIso();

  // template mínimo: Trigger + Output desconectados
  const flow: Flow = {
    id: createId("flow"),
    name,
    schemaVersion: 1,
    nodes: [
      {
        id: createId("node"),
        type: "trigger",
        position: { x: 80, y: 120 },
        data: { triggerType: "manual", description: "Start" },
      },
      {
        id: createId("node"),
        type: "output",
        position: { x: 480, y: 120 },
        data: { format: "text", storeAs: "result" },
      },
    ],
    edges: [],
    createdAt: now,
    updatedAt: now,
  };

  const created = await flowRepo.create(flow);
  return NextResponse.json(created, { status: 201 });
}
