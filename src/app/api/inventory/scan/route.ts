import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { code, type } = await req.json();
  if (!code) return NextResponse.json({ error: 'Código requerido' }, { status: 400 });

  const field = type === 'barcode' ? 'barcode' : 'qr_code';

  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq(field, code)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Ítem no encontrado' }, { status: 404 });

  return NextResponse.json(data);
}
