import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/infrastructure/supabase/server';
import { isServerProduction, isCronAuthorized } from '@/lib/supabase-route-auth';
import { authenticate, authorize } from '@/lib/security/auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { CLUB_TEAM_IDS } from '@/lib/club-team-ids';
import { runRosterSync } from '@/application/roster-sync/runSync';
import type { SyncTrigger } from '@/types';
import { canModifyProject } from '@/lib/permissions';

export const runtime = 'nodejs';

async function resolveTrigger(req: NextRequest, body: Record<string, unknown>): Promise<SyncTrigger> {
  const q = req.nextUrl.searchParams.get('trigger');
  if (q === 'startup' || q === 'cron' || q === 'manual') return q;
  if (body.trigger === 'startup' || body.trigger === 'cron' || body.trigger === 'manual') {
    return body.trigger;
  }
  return 'manual';
}

/**
 * Sync de plantilla oficial → siempre con service role en producción.
 * Tras autorizar al superadmin, hace falta admin client: RLS no trata
 * role=superadmin como user_is_admin(), y el JWT de sesión no puede
 * insertar/actualizar jugadores de forma fiable.
 */
function productionSyncClient() {
  return createSupabaseAdminClient();
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
    const authCtx = await authenticate();
    if (authCtx.response || !authCtx.user) return authCtx.response!;
    // Force/manual sync de plantilla oficial: solo superadmin (Ramón).
    if (force || trigger === 'manual') {
      const authorized = await authorize(authCtx);
      const email = authorized.access.email;
      const role = authorized.profileRow?.role || authorized.access.role;
      if (!canModifyProject(role, email)) {
        return NextResponse.json(
          { error: 'Solo el superadmin puede sincronizar la plantilla oficial del programa.' },
          { status: 403 }
        );
      }
    }
  }

  const supabase = isServerProduction() ? productionSyncClient() : null;

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
          errorMessage: err instanceof Error ? err.message : 'Error de sincronización',
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
  const explicitTeam = req.nextUrl.searchParams.get('team_id');

  if (trigger === 'cron' && isServerProduction()) {
    if (!isCronAuthorized(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (trigger !== 'cron' && isServerProduction()) {
    const authCtx = await authenticate();
    if (authCtx.response || !authCtx.user) return authCtx.response!;
    if (force || trigger === 'manual') {
      const authorized = await authorize(authCtx);
      const email = authorized.access.email;
      const role = authorized.profileRow?.role || authorized.access.role;
      if (!canModifyProject(role, email)) {
        return NextResponse.json(
          { error: 'Solo el superadmin puede sincronizar la plantilla oficial del programa.' },
          { status: 403 }
        );
      }
    }
  }

  const supabase = isServerProduction() ? productionSyncClient() : null;
  const syncTrigger: SyncTrigger =
    trigger === 'startup' ? 'startup' : trigger === 'manual' ? 'manual' : 'cron';

  try {
    // Cron sin team_id → RMB + RMF + ATM (igual que calendario)
    const teamIds = explicitTeam
      ? [resolveTeamId(explicitTeam)]
      : syncTrigger === 'cron'
        ? [CLUB_TEAM_IDS.rmb, CLUB_TEAM_IDS.rmf, CLUB_TEAM_IDS.atm]
        : [DEFAULT_TEAM_ID];

    const results = [];
    for (const teamId of teamIds) {
      results.push(
        await runRosterSync({
          supabase: supabase as any,
          options: {
            teamId,
            trigger: syncTrigger,
            force: force || syncTrigger === 'cron',
          },
          downloadPhotos: isServerProduction(),
        })
      );
    }

    return NextResponse.json({
      data: results.length === 1 ? results[0] : { teams: results },
    });
  } catch (err) {
    console.error('[api/roster/sync GET]', err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Error',
        data: {
          status: 'error',
          errorMessage: err instanceof Error ? err.message : 'Error',
        },
      },
      { status: 200 }
    );
  }
}
