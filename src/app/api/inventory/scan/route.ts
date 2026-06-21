import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/infrastructure/supabase/server';
import { findDemoGarmentByCode } from '@/lib/garment-units-seed';
import { parseScannedValue, isGarmentQrCode, normalizeScanCode } from '@/lib/qr-codes';
import { isDemoMode } from '@/lib/app-mode';

async function findProductionGarment(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, code: string) {
  const normalized = normalizeScanCode(code).toUpperCase();
  const db = supabase as any;

  const { data: byQr } = await db.from('garment_units').select('*').eq('qr_code', code).maybeSingle();
  if (byQr) return byQr;

  const { data: byBarcode } = await db.from('garment_units').select('*').eq('barcode', normalized).maybeSingle();
  if (byBarcode) return byBarcode;

  const { data: allGarments } = await db.from('garment_units').select('*').limit(500);
  if (allGarments) {
    const match = (allGarments as Record<string, unknown>[]).find((g) => {
      const aliases = (g.scan_aliases as string[] | null) ?? [];
      const codes = [g.qr_code, g.barcode, g.product_ref, ...aliases]
        .filter(Boolean)
        .map((c) => normalizeScanCode(String(c)).toUpperCase());
      return codes.some((c) => c === normalized || normalized.includes(c) || c.includes(normalized));
    });
    if (match) return match;
  }

  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('code');
  if (!raw) return NextResponse.json({ error: 'Código requerido' }, { status: 400 });

  const code = parseScannedValue(raw);

  if (isDemoMode()) {
    const garment = findDemoGarmentByCode(code);
    if (garment) return NextResponse.json({ kind: 'garment', data: garment });
    return NextResponse.json({ error: 'Prenda no encontrada' }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const garment = await findProductionGarment(supabase, code);
  if (garment) return NextResponse.json({ kind: 'garment', data: garment });

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

  if (isDemoMode()) {
    const garment = findDemoGarmentByCode(code);
    if (garment) return NextResponse.json({ kind: 'garment', data: garment });
    return NextResponse.json({ error: 'Prenda no encontrada' }, { status: 404 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (isGarmentQrCode(code) || type === 'garment') {
    const garment = await findProductionGarment(supabase, code);
    if (garment) return NextResponse.json({ kind: 'garment', data: garment });
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
