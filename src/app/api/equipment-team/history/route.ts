import { NextRequest, NextResponse } from 'next/server';
import { isServerProduction } from '@/lib/supabase-route-auth';
import { getEquipmentStore } from '@/modules/equipment-team/store';
import { teamIdFrom, withEquipmentAuth } from '@/modules/equipment-team/server';

export async function GET(req: NextRequest) {
  const teamId = teamIdFrom(req);
  const entityId = req.nextUrl.searchParams.get('entity_id');
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 100), 200);

  if (!isServerProduction()) {
    let history = getEquipmentStore()
      .history.filter((h) => h.team_id === teamId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (entityId) {
      history = history.filter((h) => h.entity_id === entityId);
    }
    return NextResponse.json({ data: history.slice(0, limit) });
  }

  const { supabase, user, response } = await withEquipmentAuth();
  if (response || !user || !supabase) return response!;

  let query = (supabase as any)
    .from('equipment_history')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (entityId) query = query.eq('entity_id', entityId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}
