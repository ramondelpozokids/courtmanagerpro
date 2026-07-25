import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { runCalendarSync } from '@/application/calendar-sync/runSync';
import type { SyncTrigger } from '@/types';

export const runtime = 'nodejs';

function isCronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return Boolean(req.headers.get('x-vercel-cron'));
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}` || Boolean(req.headers.get('x-vercel-cron'));
}

async function resolveTrigger(req: NextRequest, body: Record<string, unknown>): Promise<SyncTrigger> {
  const q = req.nextUrl.searchParams.get('trigger');
  if (q === 'startup' || q === 'cron' || q === 'manual') return q;
  if (body.trigger === 'startup' || body.trigger === 'cron' || body.trigger === 'manual') {
    return body.trigger;
  }
  return 'manual';
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const trigger = await resolveTrigger(req, body);
  const force = Boolean(body.force) || req.nextUrl.searchParams.get('force') === '1';
  const teamId = resolveTeamId(
    (body.team_id as string) || req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID
  );

  if (trigger === 'cron') {
    if (!isCronAuthorized(req) && isServerProduction()) {
      return NextResponse.json({ error: 'Unauthorized cron' }, { status: 401 });
    }
  } else if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction()
    ? trigger === 'cron'
      ? createSupabaseAdminClient()
      : await createSupabaseServerClient()
    : null;

  try {
    const result = await runCalendarSync({
      supabase: supabase as any,
      options: { teamId, trigger, force },
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('[api/calendar/sync]', err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Error de sincronización',
        data: { status: 'error' },
      },
      { status: 200 }
    );
  }
}

export async function GET(req: NextRequest) {
  const trigger = (req.nextUrl.searchParams.get('trigger') || 'cron') as SyncTrigger;
  const force = req.nextUrl.searchParams.get('force') === '1';
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);

  if (trigger === 'cron') {
    if (!isCronAuthorized(req) && isServerProduction()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction() ? createSupabaseAdminClient() : null;

  try {
    const result = await runCalendarSync({
      supabase: supabase as any,
      options: {
        teamId,
        trigger: trigger === 'startup' ? 'startup' : trigger === 'manual' ? 'manual' : 'cron',
        force,
      },
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('[api/calendar/sync GET]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error', data: { status: 'error' } },
      { status: 200 }
    );
  }
}
