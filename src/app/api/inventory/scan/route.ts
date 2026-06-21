import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { findDemoGarmentByCode } from '@/lib/garment-units-seed';
import { parseScannedValue, isGarmentQrCode } from '@/lib/qr-codes';

function isDemoEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  return !url || url.includes('your-project') || url.includes('dummy-project');
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('code');
  if (!raw) return NextResponse.json({ error: 'Código requerido' }, { status: 400 });

  const code = parseScannedValue(raw);

  if (isDemoEnv()) {
    const garment = findDemoGarmentByCode(code);
    if (garment) return NextResponse.json({ kind: 'garment', data: garment });
    return NextResponse.json({ error: 'Prenda no encontrada' }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (isGarmentQrCode(code)) {
    const { data, error } = await supabase
      .from('garment_units')
      .select('*')
      .eq('qr_code', code)
      .maybeSingle();
    if (data) return NextResponse.json({ kind: 'garment', data });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const field = /^\d{8,14}$/.test(code) ? 'barcode' : 'qr_code';
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq(field, code)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Ítem no encontrado' }, { status: 404 });

  return NextResponse.json({ kind: 'inventory', data });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const raw = body.code as string | undefined;
  if (!raw) return NextResponse.json({ error: 'Código requerido' }, { status: 400 });

  const code = parseScannedValue(raw);
  const type = body.type as string | undefined;

  if (isDemoEnv()) {
    const garment = findDemoGarmentByCode(code);
    if (garment) return NextResponse.json({ kind: 'garment', data: garment });
    return NextResponse.json({ error: 'Prenda no encontrada' }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (isGarmentQrCode(code) || type === 'garment') {
    const { data } = await supabase
      .from('garment_units')
      .select('*')
      .eq('qr_code', code)
      .maybeSingle();
    if (data) return NextResponse.json({ kind: 'garment', data });
  }

  const field = type === 'barcode' || /^\d{8,14}$/.test(code) ? 'barcode' : 'qr_code';
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq(field, code)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Ítem no encontrado' }, { status: 404 });

  return NextResponse.json({ kind: 'inventory', data });
}
