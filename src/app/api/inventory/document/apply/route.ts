import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import {
  deleteInventoryPreview,
  takeInventoryPreview,
} from '@/application/inventory/documentImport/previewStore';
import { applyInventoryDiff } from '@/application/inventory/documentImport/applyDiff';
import type { InventoryDiffPreview } from '@/application/inventory/documentImport/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let userId: string | null = null;
  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
    userId = user.id;
  }

  const body = await req.json().catch(() => ({}));
  const previewId = body.previewId as string | undefined;
  const action = (body.action as string) || 'accept';

  if (!previewId) {
    return NextResponse.json({ error: 'previewId requerido' }, { status: 400 });
  }

  const stored = takeInventoryPreview(previewId);
  if (!stored) {
    return NextResponse.json(
      { error: 'Vista previa expirada o no encontrada. Vuelve a subir el documento.' },
      { status: 404 }
    );
  }

  if (action === 'cancel') {
    deleteInventoryPreview(previewId);
    return NextResponse.json({ data: { cancelled: true } });
  }

  // Allow client to send adjusted preview
  const preview = (body.preview as InventoryDiffPreview) || stored.preview;

  try {
    const supabase = isServerProduction() ? await createSupabaseServerClient() : null;
    const result = await applyInventoryDiff({
      supabase: supabase as any,
      teamId: stored.teamId,
      userId: userId || stored.userId,
      preview,
      demo: !isServerProduction(),
    });
    deleteInventoryPreview(previewId);
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('[api/inventory/document/apply]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al aplicar cambios' },
      { status: 500 }
    );
  }
}
