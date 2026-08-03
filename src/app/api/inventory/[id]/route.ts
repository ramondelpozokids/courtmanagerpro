import { NextResponse } from "next/server";
import { inventoryRepository, updateStockUseCase } from "@/lib/di";
import { isServerProduction, requireProductionApiUser } from "@/lib/supabase-route-auth";
import { isDemoMode } from "@/lib/app-mode";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/infrastructure/supabase/server";
import { supabaseServiceRoleKey } from "@/infrastructure/supabase/env";
import { assertUserBelongsToTeam } from "@/lib/security/assert-team-access";

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

async function assertItemTeamAccess(
  auth: Awaited<ReturnType<typeof requireProductionApiUser>>,
  item: { team_id?: string } | null | undefined
) {
  if (!auth.user || !auth.supabase || !item?.team_id) return null;
  const access = await assertUserBelongsToTeam(
    auth.supabase as any,
    auth.user.id,
    item.team_id
  );
  return access.ok ? null : access.response;
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
    const denied = await assertItemTeamAccess(auth, item as { team_id?: string });
    if (denied) return denied;
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
    const before = await inventoryRepository.getById(id);
    const denied = await assertItemTeamAccess(auth, before as { team_id?: string } | null);
    if (denied) return denied;

    if (body.action && typeof body.qtyChange === "number") {
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
    const existing = await inventoryRepository.getById(id);
    const denied = await assertItemTeamAccess(auth, existing as { team_id?: string } | null);
    if (denied) return denied;

    const success = await inventoryRepository.delete(id);
    if (!success) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
