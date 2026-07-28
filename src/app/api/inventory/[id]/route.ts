import { NextResponse } from "next/server";
import { inventoryRepository, updateStockUseCase } from "@/lib/di";
import { isServerProduction, requireProductionApiUser } from "@/lib/supabase-route-auth";
import { isDemoMode } from "@/lib/app-mode";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/infrastructure/supabase/server";
import { supabaseServiceRoleKey } from "@/infrastructure/supabase/env";

async function logStockMovement(item: {
  id: string;
  name?: string;
  team_id?: string;
  stock_available?: number;
}, qtyDelta: number, actorName?: string | null) {
  if (isDemoMode() || !isServerProduction()) return;
  try {
    const hasService =
      Boolean(supabaseServiceRoleKey) &&
      supabaseServiceRoleKey.length > 40 &&
      !supabaseServiceRoleKey.includes("dummy");
    const client = hasService ? createSupabaseAdminClient() : await createSupabaseServerClient();
    await (client as any).from("stock_movements").insert({
      team_id: item.team_id,
      item_id: item.id,
      item_name: item.name || "Material",
      qty_delta: qtyDelta,
      stock_after: item.stock_available ?? null,
      reason: "ajuste",
      actor_name: actorName || null,
    });
  } catch {
    // Tabla aún no migrada o RLS: no bloquear el ajuste de stock
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireProductionApiUser();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const item = await inventoryRepository.getById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireProductionApiUser();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action && typeof body.qtyChange === "number") {
      const before = await inventoryRepository.getById(id);
      const updated = await updateStockUseCase.execute(id, body.qtyChange, body.action);
      const delta =
        typeof updated?.stock_available === "number" && typeof before?.stock_available === "number"
          ? updated.stock_available - before.stock_available
          : body.action === "REDUCE"
            ? -Math.abs(body.qtyChange)
            : body.action === "ADD"
              ? Math.abs(body.qtyChange)
              : 0;
      if (delta !== 0) {
        void logStockMovement(
          updated as any,
          delta,
          typeof body.actor_name === "string" ? body.actor_name : null
        );
      }
      return NextResponse.json(updated);
    }

    const updated = await inventoryRepository.update(id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireProductionApiUser();
  if (auth.response) return auth.response;

  try {
    const { id } = await params;
    const success = await inventoryRepository.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
