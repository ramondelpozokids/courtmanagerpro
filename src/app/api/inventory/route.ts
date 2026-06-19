import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get('team_id');
  const category = searchParams.get('category');
  const lowStock = searchParams.get('low_stock') === 'true';
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('page_size') || '20');

  // If no team_id is supplied, fallback to dummy Tenerife ID
  const activeTeamId = resolveTeamId(teamId);

  let query = supabase
    .from('inventory_items')
    .select('*', { count: 'exact' })
    .eq('team_id', activeTeamId)
    .eq('is_active', true)
    .order('name')
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (category) query = query.eq('category', category);
  if (search) query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`);
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

// Support POST creation too for inventory items (restoring full REST compatibility)
export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({ ...body, team_id: DEFAULT_TEAM_ID })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
