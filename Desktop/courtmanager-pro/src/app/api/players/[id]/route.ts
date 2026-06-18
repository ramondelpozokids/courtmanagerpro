import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      assignments:item_assignments(
        *,
        item:inventory_items(id, name, category, image_url)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json(data); // Returns single object
}

export async function PUT(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from('players')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;
  const supabase = (await createSupabaseServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('players')
    .update({ is_active: false })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
