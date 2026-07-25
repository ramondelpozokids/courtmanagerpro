import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { analyzeInventoryDocument } from '@/application/inventory/documentImport/analyze';
import type { ExistingInventoryRow } from '@/application/inventory/documentImport/diffEngine';
import { putInventoryPreview } from '@/application/inventory/documentImport/previewStore';

export const runtime = 'nodejs';

const ALLOWED = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export async function POST(req: NextRequest) {
  let userId: string | null = null;
  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
    userId = user.id;
  }

  const form = await req.formData();
  const file = form.get('file');
  const teamId = resolveTeamId((form.get('team_id') as string) || DEFAULT_TEAM_ID);

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Archivo requerido (PDF, DOC, DOCX)' }, { status: 400 });
  }

  const mime = file.type || 'application/octet-stream';
  const name = file.name || 'documento.pdf';
  const lower = name.toLowerCase();
  const okExt = lower.endsWith('.pdf') || lower.endsWith('.doc') || lower.endsWith('.docx');
  if (!okExt && !ALLOWED.has(mime)) {
    return NextResponse.json({ error: 'Formato no soportado. Usa PDF, DOC o DOCX.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > 20 * 1024 * 1024) {
    return NextResponse.json({ error: 'Archivo demasiado grande (máx. 20 MB)' }, { status: 400 });
  }

  let existing: ExistingInventoryRow[] = [];

  if (isServerProduction()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await (supabase as any)
      .from('inventory_items')
      .select('id, name, sku, size, stock_total, stock_available, category, brand, is_active')
      .eq('team_id', teamId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    existing = (data || []) as ExistingInventoryRow[];
  } else {
    existing = db.inventory.map((i: any) => ({
      id: String(i.id),
      name: String(i.name),
      sku: i.sku || null,
      size: i.size || null,
      stock_total: Number(i.stock_total ?? i.quantity ?? 0),
      stock_available: Number(i.stock_available ?? i.quantity ?? 0),
      category: String(i.category || 'otro'),
      brand: i.brand || null,
      is_active: i.is_active !== false,
    }));
  }

  try {
    const result = await analyzeInventoryDocument({
      buffer,
      filename: name,
      mimeType: mime,
      existingItems: existing,
    });

    const previewId = `prev-${Date.now().toString(16)}-${Math.random().toString(36).slice(2, 8)}`;
    putInventoryPreview(previewId, {
      preview: result.preview,
      teamId,
      userId,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      data: {
        previewId,
        ...result,
        message: `Se han encontrado: +${result.preview.summary.added} artículos nuevos, ${result.preview.summary.modified} modificados, ${result.preview.summary.removed} eliminados`,
      },
    });
  } catch (err) {
    console.error('[api/inventory/document/analyze]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al analizar documento' },
      { status: 500 }
    );
  }
}
