import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { createInventoryItemSchema } from '@/lib/validators';
import { assertUserBelongsToTeam } from '@/lib/security/assert-team-access';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('team_id');
  const category = searchParams.get('category');
  const lowStock = searchParams.get('low_stock') === 'true';
  const search = searchParams.get('search');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('page_size') || '20', 10) || 20));

  const activeTeamId = resolveTeamId(teamId);
  const access = await assertUserBelongsToTeam(supabase as any, user.id, activeTeamId);
  if (!access.ok) return access.response;

  let query = supabase
    .from('inventory_items')
    .select('*', { count: 'exact' })
    .eq('team_id', activeTeamId)
    .eq('is_active', true)
    .order('name')
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (category) query = query.eq('category', category as any);
  if (search) {
    const safe = search.replace(/[%_,]/g, '').slice(0, 80);
    if (safe) {
      query = query.or(`name.ilike.%${safe}%,sku.ilike.%${safe}%,barcode.ilike.%${safe}%`);
    }
  }
  if (lowStock) query = query.filter('stock_available', 'lte', 'stock_min');

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data,
    count,
    page,
    page_size: pageSize,
    total_pages: Math.ceil((count || 0) / pageSize),
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const teamId = resolveTeamId(body.team_id || DEFAULT_TEAM_ID);
  const access = await assertUserBelongsToTeam(supabase as any, user.id, teamId);
  if (!access.ok) return access.response;

  const parsed = createInventoryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await (supabase as any)
    .from('inventory_items')
    .insert({ ...parsed.data, team_id: teamId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
