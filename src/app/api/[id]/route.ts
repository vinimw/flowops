import { NextResponse } from "next/server";
import { flowRepo } from "@/data/flows/flow.fs.repository";
import type { Flow } from "@/domain/flow/types";
import { nowIso } from "@/shared/lib/time";

export async function GET(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const flow = await flowRepo.getById(id);

  if (!flow) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json(flow);
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = (await req.json()) as Flow;

  const updated: Flow = {
    ...body,
    id,
    updatedAt: nowIso(),
  };

  try {
    const saved = await flowRepo.update(id, updated);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  await flowRepo.delete(id);
  return NextResponse.json({ ok: true });
}
