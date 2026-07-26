import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { isServerProduction, requireApiUser, isCronAuthorized } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { runRosterSync } from '@/application/roster-sync/runSync';
import type { SyncTrigger } from '@/types';

export const runtime = 'nodejs';

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
    if (!isCronAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized cron' }, { status: 401 });
    }
  } else if (isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction()
    ? (trigger === 'cron' ? createSupabaseAdminClient() : await createSupabaseServerClient())
    : null;

  try {
    const result = await runRosterSync({
      supabase: supabase as any,
      options: { teamId, trigger, force },
      downloadPhotos: isServerProduction(),
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('[api/roster/sync]', err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Error de sincronización',
        data: {
          status: 'error',
          // Never block the app — client should keep last roster
        },
      },
      { status: 200 }
    );
  }
}

/** Vercel Cron / manual GET */
export async function GET(req: NextRequest) {
  const trigger = (req.nextUrl.searchParams.get('trigger') || 'cron') as SyncTrigger;
  const force = req.nextUrl.searchParams.get('force') === '1';
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);

  if (trigger === 'cron' && isServerProduction()) {
    if (!isCronAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (trigger !== 'cron' && isServerProduction()) {
    const { user, response } = await requireApiUser();
    if (response || !user) return response!;
  }

  const supabase = isServerProduction() ? createSupabaseAdminClient() : null;

  try {
    const result = await runRosterSync({
      supabase: supabase as any,
      options: { teamId, trigger: trigger === 'startup' ? 'startup' : trigger === 'manual' ? 'manual' : 'cron', force },
      downloadPhotos: isServerProduction(),
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('[api/roster/sync GET]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error', data: { status: 'error' } },
      { status: 200 }
    );
  }
}
