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

export function laundryRowToUi(row: Record<string, unknown>): LaundryBatch {
  const meta = (row.metadata as Record<string, unknown>) || {};
  const status = DB_TO_UI[String(row.status)] || 'PENDING';
  return {
    id: String(row.id),
    name: String(row.name),
    itemCount: Number(meta.itemCount ?? meta.item_count ?? 0),
    status,
    receivedDate: String(row.created_at ?? '').slice(0, 10),
    completedDate: row.returned_at ? String(row.returned_at).slice(0, 10) : undefined,
    responsible: String(meta.responsible ?? 'Utilería'),
  };
}

export function laundryUiToDb(
  batch: Partial<LaundryBatch> & { name: string },
  teamId: string,
  userId: string
) {
  return {
    team_id: teamId,
    name: batch.name,
    created_by: userId,
    status: batch.status ? UI_TO_DB[batch.status] : 'sucio',
    returned_at: batch.status === 'READY' ? new Date().toISOString() : null,
    metadata: {
      itemCount: batch.itemCount ?? 0,
      responsible: batch.responsible ?? 'Utilería',
    },
  };
}

export function laundryStatusToDb(status: LaundryBatch['status']): string {
  return UI_TO_DB[status];
}
