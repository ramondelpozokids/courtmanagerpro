import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import {
  getEquipmentStore,
  getSummary,
} from '@/modules/equipment-team/store';
import { teamIdFrom, withEquipmentAuth } from '@/modules/equipment-team/server';

function demoPayload(teamId: string) {
  const store = getEquipmentStore();
  return {
    summary: getSummary(teamId),
    members: store.members.filter((m) => m.team_id === teamId),
    notes: store.notes.filter((n) => n.team_id === teamId),
    reports: store.reports.filter((r) => r.team_id === teamId),
    tasks: store.tasks.filter((t) => t.team_id === teamId),
    notices: store.notices.filter((n) => n.team_id === teamId),
    history: store.history.filter((h) => h.team_id === teamId).slice(0, 50),
  };
}

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);

  if (!isServerProduction()) {
    return NextResponse.json({ data: demoPayload(teamId) });
  }

  const { supabase, user, response } = await withEquipmentAuth(req);
  if (response || !user || !supabase) return response!;
  const pg = supabase as any;

  try {
    const [members, notes, reports, tasks, notices, history] = await Promise.all([
      pg.from('equipment_team_members').select('*').eq('team_id', teamId).order('last_name'),
      pg.from('equipment_notes').select('*').eq('team_id', teamId).order('created_at', { ascending: false }).limit(50),
      pg.from('equipment_reports').select('*').eq('team_id', teamId).order('created_at', { ascending: false }).limit(50),
      pg.from('equipment_tasks').select('*').eq('team_id', teamId).order('created_at', { ascending: false }),
      pg.from('equipment_notices').select('*').eq('team_id', teamId).order('created_at', { ascending: false }).limit(50),
      pg.from('equipment_history').select('*').eq('team_id', teamId).order('created_at', { ascending: false }).limit(50),
    ]);

    const tableMissing = [members, notes, reports, tasks, notices, history].some(
      (r) => r.error && /does not exist|schema cache/i.test(String(r.error.message || ''))
    );
    if (tableMissing) {
      return NextResponse.json({ data: demoPayload(teamId), meta: { fallback: 'demo' } });
    }

    const m = members.data ?? [];
    const n = notes.data ?? [];
    const r = reports.data ?? [];
    const t = tasks.data ?? [];
    const no = notices.data ?? [];

    return NextResponse.json({
      data: {
        summary: {
          activeMembers: m.filter((x: { is_active: boolean }) => x.is_active).length,
          recentNotes: n.slice(0, 5),
          urgentNotices: no.filter(
            (x: { is_active: boolean; notice_type: string }) =>
              x.is_active && x.notice_type === 'urgente'
          ),
          newReports: r.slice(0, 5),
          pendingTasks: t.filter((x: { status: string }) => x.status !== 'finalizada'),
        },
        members: m,
        notes: n,
        reports: r,
        tasks: t,
        notices: no,
        history: history.data ?? [],
      },
    });
  } catch {
    return NextResponse.json({ data: demoPayload(teamId), meta: { fallback: 'demo' } });
  }
}
