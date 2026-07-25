import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { runBirthdayEmailJob } from '@/application/birthday-alerts/runJob';

export const runtime = 'nodejs';

function isCronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (req.headers.get('x-vercel-cron')) return true;
  if (!secret) return !isServerProduction();
  return req.headers.get('authorization') === `Bearer ${secret}`;
}

/** Cron horario: solo envía cuando en Madrid son las 08:00. */
export async function GET(req: NextRequest) {
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);
  const force = req.nextUrl.searchParams.get('force') === '1';

  if (!force && !isCronAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (force && isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction() ? createSupabaseAdminClient() : null;

  try {
    const result = await runBirthdayEmailJob({
      supabase: supabase as any,
      teamId,
      force,
      ignoreHourGate: force,
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('[api/birthdays/send]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error', data: { sent: false } },
      { status: 200 }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const teamId = resolveTeamId((body.team_id as string) || DEFAULT_TEAM_ID);
  const force = Boolean(body.force);

  if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction()
    ? await createSupabaseServerClient()
    : null;

  const result = await runBirthdayEmailJob({
    supabase: supabase as any,
    teamId,
    force,
    ignoreHourGate: true,
  });

  return NextResponse.json({ data: result });
}
