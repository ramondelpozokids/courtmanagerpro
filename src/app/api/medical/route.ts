import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { isRealMadridTeamId } from '@/lib/club-team-ids';
import { medicalRowToUi, medicalUiToDb } from '@/lib/medical-mapper';

export async function GET(req: NextRequest) {
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);

  if (isServerProduction()) {
    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;

    if (!isRealMadridTeamId(teamId)) {
      const rows = (db.medical || []).filter(
        (m: any) => !m.team_id || m.team_id === 'team-acb-123' || m.team_id === teamId
      );
      return NextResponse.json(rows.map((m: any) => ({
        id: m.id,
        name: m.name,
        quantity: m.quantity,
        minQuantity: m.minQuantity,
        expiryDate: m.expiryDate,
        batchNumber: m.batchNumber,
        status: m.status,
        location: m.location,
        kit: m.kit,
        brand: m.brand,
        category: m.category,
        prescription_required: m.prescription_required,
      })));
    }

    const pg = supabase as any;
    const { data, error } = await pg
      .from('medical_items')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_active', true)
      .order('name');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json((data ?? []).map(medicalRowToUi));
  }

  const rows = (db.medical || []).filter(
    (m: any) => !m.team_id || m.team_id === 'team-acb-123' || m.team_id === teamId
  );
  return NextResponse.json(rows.map((m: any) => ({
    id: m.id,
    name: m.name,
    quantity: m.quantity,
    minQuantity: m.minQuantity,
    expiryDate: m.expiryDate,
    batchNumber: m.batchNumber,
    status: m.status,
    location: m.location,
    kit: m.kit,
    brand: m.brand,
    category: m.category,
    prescription_required: m.prescription_required,
  })));
}

export async function POST(request: NextRequest) {
  try {
    if (isServerProduction()) {
      const { user, response } = await requireApiUser();
      if (response || !user) return response!;
    }

    const body = await request.json();
    const teamId = resolveTeamId(
      body.team_id || request.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID
    );

    if (!isServerProduction() || !isRealMadridTeamId(teamId)) {
      if (body.itemId && typeof body.quantity === 'number') {
        const item = db.medical.find((m) => m.id === body.itemId) as any;
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        item.quantity = Math.max(0, body.quantity);
        if (item.quantity <= item.minQuantity) item.status = 'EXPIRING_SOON';
        else item.status = 'OK';
        return NextResponse.json(item);
      }

      const kit = body.kit || body.location || 'Armario Central';
      const locationHints: Record<string, string> = {
        'Botiquín Partido': 'Vestuario — Banquillo',
        'Botiquín Viaje': 'Almacén Logística',
        Fisioterapia: 'Botiquín Fisioterapia',
        'Vestuario Principal': 'Nevera Vestuario',
        'Armario Central': 'Armario Médico',
      };
      const newItem = {
        id: 'm_' + Math.random().toString(36).substr(2, 9),
        name: body.name,
        quantity: body.quantity || 0,
        minQuantity: body.minQuantity || 5,
        expiryDate: body.expiryDate || '2027-12-31',
        batchNumber: body.batchNumber || `B-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'OK' as const,
        kit,
        location: body.location || locationHints[kit] || kit,
        category: body.category || 'material_cura',
        brand: body.brand || '',
        is_active: true,
        team_id: teamId,
      } as any;
      db.medical.push(newItem);
      return NextResponse.json(newItem, { status: 201 });
    }

    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;
    const pg = supabase as any;

    if (body.itemId && typeof body.quantity === 'number') {
      const { data, error } = await pg
        .from('medical_items')
        .update({
          stock_total: Math.max(0, body.quantity),
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.itemId)
        .eq('team_id', teamId)
        .select()
        .single();

      if (error || !data) {
        return NextResponse.json({ error: error?.message || 'Item not found' }, { status: 404 });
      }
      return NextResponse.json(medicalRowToUi(data));
    }

    const insert = medicalUiToDb(body, teamId);
    const { data, error } = await pg.from('medical_items').insert(insert).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(medicalRowToUi(data), { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (isServerProduction()) {
      const { user, response } = await requireApiUser();
      if (response || !user) return response!;
    }

    const id = request.nextUrl.searchParams.get('id');
    const teamId = resolveTeamId(request.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    if (!isServerProduction() || !isRealMadridTeamId(teamId)) {
      const idx = db.medical.findIndex((m) => m.id === id);
      if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      db.medical.splice(idx, 1);
      return NextResponse.json({ success: true });
    }

    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;

    const { error } = await (supabase as any)
      .from('medical_items')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('team_id', teamId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
