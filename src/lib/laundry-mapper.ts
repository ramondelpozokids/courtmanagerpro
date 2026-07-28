import type { LaundryBatch } from '@/domain/entities/LaundryBatch';

const UI_TO_DB: Record<LaundryBatch['status'], string> = {
  PENDING: 'sucio',
  WASHING: 'en_lavado',
  DRYING: 'en_lavado',
  READY: 'entregado',
};

const DB_TO_UI: Record<string, LaundryBatch['status']> = {
  sucio: 'PENDING',
  en_lavado: 'WASHING',
  limpio: 'DRYING',
  entregado: 'READY',
};

function parseLaundryMeta(row: Record<string, unknown>): Record<string, unknown> {
  if (row.metadata && typeof row.metadata === 'object') {
    return row.metadata as Record<string, unknown>;
  }
  const notes = String(row.notes || '');
  if (notes.startsWith('{')) {
    try {
      return JSON.parse(notes) as Record<string, unknown>;
    } catch {
      /* ignore */
    }
  }
  return {};
}

export function laundryRowToUi(row: Record<string, unknown>): LaundryBatch {
  const meta = parseLaundryMeta(row);
  const status = DB_TO_UI[String(row.status)] || 'PENDING';
  const flowRaw = String(meta.flow || '');
  return {
    id: String(row.id),
    name: String(row.name),
    itemCount: Number(meta.itemCount ?? meta.item_count ?? 0),
    status,
    receivedDate: String(row.created_at ?? '').slice(0, 10),
    completedDate: row.returned_at ? String(row.returned_at).slice(0, 10) : undefined,
    responsible: String(meta.responsible ?? 'Utilería'),
    kitType: typeof meta.kitType === 'string' ? meta.kitType : undefined,
    flow: flowRaw === 'salida' || flowRaw === 'entrada' ? flowRaw : undefined,
  };
}

export function laundryUiToDb(
  batch: Partial<LaundryBatch> & { name: string; kitType?: string; flow?: string },
  teamId: string,
  userId: string
) {
  const meta = {
    itemCount: batch.itemCount ?? 0,
    responsible: batch.responsible ?? 'Utilería',
    ...(batch.kitType ? { kitType: batch.kitType } : {}),
    ...(batch.flow ? { flow: batch.flow } : {}),
  };
  const initialStatus =
    batch.status
      ? UI_TO_DB[batch.status]
      : batch.flow === 'salida'
        ? 'entregado'
        : 'sucio';
  return {
    team_id: teamId,
    name: batch.name,
    created_by: userId,
    status: initialStatus,
    returned_at: batch.flow === 'salida' || batch.status === 'READY' ? new Date().toISOString() : null,
    notes: JSON.stringify(meta),
    metadata: meta,
  };
}

export function laundryStatusToDb(status: LaundryBatch['status']): string {
  return UI_TO_DB[status];
}
