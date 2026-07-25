import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import type {
  EquipmentHistoryEntry,
  EquipmentNote,
  EquipmentNotice,
  EquipmentReport,
  EquipmentTask,
  EquipmentTeamMember,
  EquipmentTeamSummary,
} from './types';
import { memberFullName } from './types';

declare global {
  // eslint-disable-next-line no-var
  var __cmEquipmentTeamStore: EquipmentTeamStore | undefined;
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(16)}_${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export interface EquipmentTeamStore {
  members: EquipmentTeamMember[];
  notes: EquipmentNote[];
  reports: EquipmentReport[];
  tasks: EquipmentTask[];
  notices: EquipmentNotice[];
  history: EquipmentHistoryEntry[];
}

function seedStore(): EquipmentTeamStore {
  const teamId = DEFAULT_TEAM_ID;
  const carlosId = 'eq_m_carlos';
  const pedroId = 'eq_m_pedro';
  const juanId = 'eq_m_juan';
  const t = nowIso();

  const members: EquipmentTeamMember[] = [
    {
      id: carlosId,
      team_id: teamId,
      first_name: 'Carlos',
      last_name: 'Rodríguez Kobe',
      role: 'Jefe de Utillería',
      phone_mobile: '+34 600 111 222',
      phone_landline: '+34 915 000 001',
      email: 'charlie-r-k@hotmail.com',
      whatsapp: '34600111222',
      photo_url: null,
      joined_at: '2018-09-01',
      is_active: true,
      notes: 'Responsable principal del material del primer equipo.',
      last_seen_at: t,
      created_at: t,
      updated_at: t,
    },
    {
      id: pedroId,
      team_id: teamId,
      first_name: 'Pedro',
      last_name: 'Gómez',
      role: 'Utillero',
      phone_mobile: '+34 600 333 444',
      phone_landline: null,
      email: 'pedro.gomez@realmadrid.com',
      whatsapp: '34600333444',
      photo_url: null,
      joined_at: '2021-07-15',
      is_active: true,
      notes: null,
      last_seen_at: t,
      created_at: t,
      updated_at: t,
    },
    {
      id: juanId,
      team_id: teamId,
      first_name: 'Juan',
      last_name: 'Pérez',
      role: 'Utillero asistente',
      phone_mobile: '+34 600 555 666',
      phone_landline: null,
      email: 'juan.perez@realmadrid.com',
      whatsapp: '34600555666',
      photo_url: null,
      joined_at: '2023-01-10',
      is_active: true,
      notes: null,
      last_seen_at: null,
      created_at: t,
      updated_at: t,
    },
  ];

  return {
    members,
    notes: [
      {
        id: uid('note'),
        team_id: teamId,
        author_id: carlosId,
        author_name: 'Carlos Rodríguez Kobe',
        content: 'Hay que preparar las equipaciones negras para el próximo partido.',
        created_at: t,
        updated_at: t,
      },
      {
        id: uid('note'),
        team_id: teamId,
        author_id: pedroId,
        author_name: 'Pedro Gómez',
        content: 'El material médico ya está en el autobús.',
        created_at: t,
        updated_at: t,
      },
    ],
    reports: [],
    tasks: [
      {
        id: uid('task'),
        team_id: teamId,
        title: 'Revisar stock de balones',
        description: 'Faltan dos balones para el entrenamiento de mañana.',
        assignee_id: pedroId,
        assignee_name: 'Pedro Gómez',
        priority: 'alta',
        status: 'pendiente',
        due_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        created_by_name: 'Carlos Rodríguez Kobe',
        created_at: t,
        updated_at: t,
      },
    ],
    notices: [
      {
        id: uid('notice'),
        team_id: teamId,
        notice_type: 'importante',
        title: 'Salida anticipada al pabellón',
        description: 'Concentración de utillería 90 minutos antes del tip-off.',
        author_name: 'Carlos Rodríguez Kobe',
        is_active: true,
        created_at: t,
      },
    ],
    history: [
      {
        id: uid('hist'),
        team_id: teamId,
        actor_name: 'Carlos Rodríguez Kobe',
        action: 'creó una nota',
        entity_type: 'note',
        entity_id: null,
        details: 'Muro de notas iniciado',
        created_at: t,
      },
    ],
  };
}

export function getEquipmentStore(): EquipmentTeamStore {
  if (!globalThis.__cmEquipmentTeamStore) {
    globalThis.__cmEquipmentTeamStore = seedStore();
  }
  return globalThis.__cmEquipmentTeamStore;
}

export function pushHistory(
  teamId: string,
  actor_name: string,
  action: string,
  entity_type: string,
  entity_id: string | null,
  details?: string | null
) {
  const store = getEquipmentStore();
  store.history.unshift({
    id: uid('hist'),
    team_id: teamId,
    actor_name,
    action,
    entity_type,
    entity_id,
    details: details || null,
    created_at: nowIso(),
  });
}

export function getSummary(teamId: string): EquipmentTeamSummary {
  const s = getEquipmentStore();
  return {
    activeMembers: s.members.filter((m) => m.team_id === teamId && m.is_active).length,
    recentNotes: s.notes.filter((n) => n.team_id === teamId).slice(0, 5),
    urgentNotices: s.notices.filter(
      (n) => n.team_id === teamId && n.is_active && n.notice_type === 'urgente'
    ),
    newReports: s.reports.filter((r) => r.team_id === teamId).slice(0, 5),
    pendingTasks: s.tasks.filter(
      (t) => t.team_id === teamId && t.status !== 'finalizada'
    ),
  };
}

export function searchEquipment(teamId: string, q: string) {
  const query = q.trim().toLowerCase();
  const s = getEquipmentStore();
  if (!query) {
    return { members: [], notes: [], reports: [], tasks: [], notices: [] };
  }
  return {
    members: s.members.filter(
      (m) =>
        m.team_id === teamId &&
        (`${m.first_name} ${m.last_name} ${m.role} ${m.email || ''}`.toLowerCase().includes(query))
    ),
    notes: s.notes.filter(
      (n) => n.team_id === teamId && n.content.toLowerCase().includes(query)
    ),
    reports: s.reports.filter(
      (r) =>
        r.team_id === teamId &&
        `${r.title} ${r.content}`.toLowerCase().includes(query)
    ),
    tasks: s.tasks.filter(
      (t) =>
        t.team_id === teamId &&
        `${t.title} ${t.description}`.toLowerCase().includes(query)
    ),
    notices: s.notices.filter(
      (n) =>
        n.team_id === teamId &&
        `${n.title} ${n.description}`.toLowerCase().includes(query)
    ),
  };
}

export { memberFullName, uid, nowIso };
