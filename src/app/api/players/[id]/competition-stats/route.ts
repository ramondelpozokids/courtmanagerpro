import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { canModifyProject } from '@/lib/permissions';

import type { CompetitionId, PlayerCompetitionMap } from '@/lib/player-competitions';

const VALID_COMPETITIONS: CompetitionId[] = [
  'liga_endesa',
  'euroliga',
  'supercopa_endesa',
  'copa_del_rey',
];

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role ?? null;
  const email = profile?.email ?? user.email ?? null;
  if (!canModifyProject(role, email)) {
    return NextResponse.json(
      { error: 'Solo el superadmin puede modificar estadísticas del proyecto' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const competition = body.competition as CompetitionId;
  if (!VALID_COMPETITIONS.includes(competition)) {
    return NextResponse.json({ error: 'Competición no válida' }, { status: 400 });
  }

  const { data: player, error: fetchError } = await supabase
    .from('players')
    .select('metadata')
    .eq('id', id)
    .single();

  if (fetchError || !player) {
    return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
  }

  const metadata = (player.metadata || {}) as Record<string, unknown>;
  const competitionStats = (metadata.competition_stats || {}) as PlayerCompetitionMap;
  const existing = competitionStats[competition];

  competitionStats[competition] = {
    stats: {
      ...body.stats,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    },
    games: body.games ?? existing?.games ?? [],
  };

  const { data, error } = await supabase
    .from('players')
    .update({ metadata: { ...metadata, competition_stats: competitionStats } })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
