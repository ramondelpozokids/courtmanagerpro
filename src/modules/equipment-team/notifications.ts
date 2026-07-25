import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import type { EquipmentNoticeType } from './types';

/** Push system alert visible in Dashboard / Alertas for utilería events. */
export function notifyEquipmentEvent(params: {
  teamId: string;
  type: 'utileria_aviso' | 'utileria_tarea' | 'utileria_nota' | 'utileria_informe';
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'critical';
  entityType?: string;
  entityId?: string | null;
}) {
  const severity =
    params.severity ||
    (params.type === 'utileria_aviso' ? 'warning' : 'info');

  db.alerts.unshift({
    id: `a_eq_${Date.now().toString(36)}`,
    team_id: params.teamId,
    type: params.type,
    severity,
    title: params.title,
    message: params.message,
    entity_type: params.entityType || 'equipment_team',
    entity_id: params.entityId || null,
    is_read: false,
    is_dismissed: false,
    read_by: null,
    read_at: null,
    auto_generated: true,
    metadata: {},
    created_at: new Date().toISOString(),
  });
}

export function noticeSeverity(type: EquipmentNoticeType): 'info' | 'warning' | 'critical' {
  if (type === 'urgente') return 'critical';
  if (type === 'importante') return 'warning';
  return 'info';
}
