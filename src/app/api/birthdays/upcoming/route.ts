import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import {
  getBirthdayDashboardData,
  getDemoBirthdayNotifications,
} from '@/application/birthday-alerts/runJob';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);

  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction() ? await createSupabaseServerClient() : null;

  try {
    const data = await getBirthdayDashboardData({
      supabase: supabase as any,
      teamId,
    });

    let history = getDemoBirthdayNotifications(teamId, 20);
    if (supabase && isServerProduction()) {
      const { data: rows } = await (supabase as any)
        .from('birthday_notifications')
        .select('*')
        .eq('team_id', teamId)
        .order('sent_at', { ascending: false })
        .limit(20);
      history = rows || [];
    }

    return NextResponse.json({
      data: {
        ...data,
        history,
      },
    });
  } catch (err) {
    console.error('[api/birthdays/upcoming]', err);
    return NextResponse.json({
      data: {
        upcoming: [],
        tomorrow: [],
        history: [],
        error: err instanceof Error ? err.message : String(err),
      },
    });
  }
}
