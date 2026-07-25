export type EquipmentNoticeType = 'urgente' | 'importante' | 'info';
export type EquipmentTaskPriority = 'baja' | 'normal' | 'alta' | 'urgente';
export type EquipmentTaskStatus = 'pendiente' | 'en_curso' | 'finalizada';

export interface EquipmentTeamMember {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_mobile: string | null;
  phone_landline: string | null;
  email: string | null;
  whatsapp: string | null;
  photo_url: string | null;
  joined_at: string | null;
  is_active: boolean;
  notes: string | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentNote {
  id: string;
  team_id: string;
  author_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentAttachment {
  name: string;
  url: string;
  mime?: string;
  size?: number;
}

export interface EquipmentReport {
  id: string;
  team_id: string;
  author_id: string | null;
  author_name: string;
  title: string;
  content: string;
  attachments: EquipmentAttachment[];
  created_at: string;
  updated_at: string;
}

export interface EquipmentTask {
  id: string;
  team_id: string;
  title: string;
  description: string;
  assignee_id: string | null;
  assignee_name: string | null;
  priority: EquipmentTaskPriority;
  status: EquipmentTaskStatus;
  due_date: string | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentNotice {
  id: string;
  team_id: string;
  notice_type: EquipmentNoticeType;
  title: string;
  description: string;
  author_name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface EquipmentHistoryEntry {
  id: string;
  team_id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: string | null;
  created_at: string;
}

export interface EquipmentTeamSummary {
  activeMembers: number;
  recentNotes: EquipmentNote[];
  urgentNotices: EquipmentNotice[];
  newReports: EquipmentReport[];
  pendingTasks: EquipmentTask[];
}

export function memberFullName(m: Pick<EquipmentTeamMember, 'first_name' | 'last_name'>): string {
  return `${m.first_name} ${m.last_name}`.trim();
}
