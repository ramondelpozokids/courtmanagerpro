import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import { searchEquipment } from '@/modules/equipment-team/store';
import { teamIdFrom, withEquipmentAuth } from '@/modules/equipment-team/server';

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);
  const q = req.nextUrl.searchParams.get('q') || '';

  if (!isServerProduction()) {
    return NextResponse.json({ data: searchEquipment(teamId, q) });
  }

  const { supabase, user, response } = await withEquipmentAuth(req);
  if (response || !user || !supabase) return response!;

  const query = q.trim();
  if (!query) {
    return NextResponse.json({
      data: { members: [], notes: [], reports: [], tasks: [], notices: [] },
    });
  }

  const pg = supabase as any;
  const like = `%${query}%`;

  const [members, notes, reports, tasks, notices] = await Promise.all([
    pg
      .from('equipment_team_members')
      .select('*')
      .eq('team_id', teamId)
      .or(`first_name.ilike.${like},last_name.ilike.${like},role.ilike.${like},email.ilike.${like}`),
    pg.from('equipment_notes').select('*').eq('team_id', teamId).ilike('content', like),
    pg
      .from('equipment_reports')
      .select('*')
      .eq('team_id', teamId)
      .or(`title.ilike.${like},content.ilike.${like}`),
    pg
      .from('equipment_tasks')
      .select('*')
      .eq('team_id', teamId)
      .or(`title.ilike.${like},description.ilike.${like}`),
    pg
      .from('equipment_notices')
      .select('*')
      .eq('team_id', teamId)
      .or(`title.ilike.${like},description.ilike.${like}`),
  ]);

  return NextResponse.json({
    data: {
      members: members.data ?? [],
      notes: notes.data ?? [],
      reports: reports.data ?? [],
      tasks: tasks.data ?? [],
      notices: notices.data ?? [],
    },
  });
}
