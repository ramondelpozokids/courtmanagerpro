import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID, resolveTeamId } from '@/lib/team-constants';
import { isRealMadridTeamId } from '@/lib/club-team-ids';

function uiStatusToDb(status: string): string {
  if (status === 'READY') return 'en_curso';
  if (status === 'COMPLETED') return 'completado';
  return 'planificado';
}

function dbStatusToUi(status: string): 'PLANNING' | 'READY' | 'COMPLETED' {
  if (status === 'en_curso') return 'READY';
  if (status === 'completado') return 'COMPLETED';
  return 'PLANNING';
}

function rowToUiTrip(row: any, items: any[] = []) {
  return {
    id: row.id,
    destination: row.destination,
    opponent: row.opponent || '',
    departureDate: String(row.departure_date || '').slice(0, 10),
    returnDate: String(row.return_date || '').slice(0, 10),
    status: dbStatusToUi(row.status),
    notes: row.notes || undefined,
    packingList: items.map((pi) => ({
      id: pi.id,
      itemName: pi.item_name,
      category: (pi.notes as string) || 'General',
      quantityRequired: pi.quantity || 1,
      quantityPacked: pi.quantity_packed || 0,
      isPacked: Boolean(pi.is_packed),
    })),
  };
}

async function loadTripWithItems(pg: any, tripId: string) {
  const { data: trip, error } = await pg.from('trips').select('*').eq('id', tripId).single();
  if (error || !trip) return null;
  const { data: items } = await pg
    .from('trip_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true });
  return rowToUiTrip(trip, items || []);
}

export async function GET(req: NextRequest) {
  const teamId = resolveTeamId(req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);

  if (!isServerProduction() || !isRealMadridTeamId(teamId)) {
    return NextResponse.json(db.trips);
  }

  const { supabase, user, response } = await requireApiUser();
  if (response || !user) return response!;
  const pg = supabase as any;

  const { data: trips, error } = await pg
    .from('trips')
    .select('*')
    .eq('team_id', teamId)
    .order('departure_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (trips || []).map((t: any) => t.id);
  let itemsByTrip: Record<string, any[]> = {};
  if (ids.length) {
    const { data: items } = await pg.from('trip_items').select('*').in('trip_id', ids);
    for (const it of items || []) {
      if (!itemsByTrip[it.trip_id]) itemsByTrip[it.trip_id] = [];
      itemsByTrip[it.trip_id].push(it);
    }
  }

  return NextResponse.json((trips || []).map((t: any) => rowToUiTrip(t, itemsByTrip[t.id] || [])));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const teamId = resolveTeamId(body.team_id || request.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID);

    if (!isServerProduction() || !isRealMadridTeamId(teamId)) {
      // ——— Demo InMemory (FCB/VBC / mock) ———
      if (body.tripId && body.action === 'addItem') {
        const trip = db.trips.find((t) => t.id === body.tripId) as any;
        if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
        const newItem = {
          id: 'pi_' + Math.random().toString(36).substr(2, 9),
          itemName: body.itemName,
          category: body.category || 'General',
          quantityRequired: body.quantityRequired || 1,
          quantityPacked: 0,
          isPacked: false,
        };
        trip.packingList.push(newItem);
        trip.status = 'PLANNING';
        return NextResponse.json(trip);
      }
      if (body.tripId && body.action === 'removeItem' && body.itemId) {
        const trip = db.trips.find((t) => t.id === body.tripId) as any;
        if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
        trip.packingList = trip.packingList.filter((pi: any) => pi.id !== body.itemId);
        const allPacked =
          trip.packingList.length > 0 && trip.packingList.every((pi: any) => pi.isPacked);
        trip.status = allPacked ? 'READY' : 'PLANNING';
        return NextResponse.json(trip);
      }
      if (body.tripId && body.itemId && typeof body.isPacked !== 'undefined') {
        const trip = db.trips.find((t) => t.id === body.tripId) as any;
        if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
        const packItem = trip.packingList.find((pi: any) => pi.id === body.itemId);
        if (packItem) {
          packItem.isPacked = body.isPacked;
          packItem.quantityPacked = body.isPacked ? packItem.quantityRequired : 0;
        }
        trip.status = trip.packingList.every((pi: any) => pi.isPacked) ? 'READY' : 'PLANNING';
        return NextResponse.json(trip);
      }
      const newTrip = {
        id: 't_' + Math.random().toString(36).substr(2, 9),
        destination: body.destination,
        opponent: body.opponent,
        departureDate: body.departureDate,
        returnDate: body.returnDate,
        status: 'PLANNING' as const,
        packingList: body.packingList || [],
        notes: body.notes,
      } as any;
      db.trips.push(newTrip);
      return NextResponse.json(newTrip, { status: 201 });
    }

    // ——— Real Madrid Supabase ———
    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;
    const pg = supabase as any;

    if (body.tripId && body.action === 'addItem') {
      const { error } = await pg.from('trip_items').insert({
        trip_id: body.tripId,
        item_name: body.itemName,
        quantity: body.quantityRequired || 1,
        quantity_packed: 0,
        is_packed: false,
        notes: body.category || 'General',
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      await pg.from('trips').update({ status: 'planificado', updated_at: new Date().toISOString() }).eq('id', body.tripId);
      const ui = await loadTripWithItems(pg, body.tripId);
      return NextResponse.json(ui);
    }

    if (body.tripId && body.action === 'removeItem' && body.itemId) {
      await pg.from('trip_items').delete().eq('id', body.itemId).eq('trip_id', body.tripId);
      const ui = await loadTripWithItems(pg, body.tripId);
      if (!ui) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      const allPacked = ui.packingList.length > 0 && ui.packingList.every((pi: any) => pi.isPacked);
      await pg
        .from('trips')
        .update({ status: allPacked ? 'en_curso' : 'planificado', updated_at: new Date().toISOString() })
        .eq('id', body.tripId);
      return NextResponse.json(await loadTripWithItems(pg, body.tripId));
    }

    if (body.tripId && body.itemId && typeof body.isPacked !== 'undefined') {
      const { data: item } = await pg.from('trip_items').select('*').eq('id', body.itemId).single();
      await pg
        .from('trip_items')
        .update({
          is_packed: body.isPacked,
          quantity_packed: body.isPacked ? item?.quantity || 1 : 0,
        })
        .eq('id', body.itemId);
      const ui = await loadTripWithItems(pg, body.tripId);
      if (!ui) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      const allPacked = ui.packingList.every((pi: any) => pi.isPacked);
      await pg
        .from('trips')
        .update({ status: allPacked ? 'en_curso' : 'planificado', updated_at: new Date().toISOString() })
        .eq('id', body.tripId);
      return NextResponse.json(await loadTripWithItems(pg, body.tripId));
    }

    const name = body.name || `Viaje ${body.destination || ''}`.trim();
    const { data: trip, error } = await pg
      .from('trips')
      .insert({
        team_id: teamId,
        name,
        // Enum DB: liga_acb | copa_del_rey | eurocup | euroleague | amistoso | pretemporada
        trip_type: body.trip_type || 'amistoso',
        status: 'planificado',
        destination: body.destination,
        opponent: body.opponent || null,
        departure_date: body.departureDate || body.departure_date,
        return_date: body.returnDate || body.return_date,
        created_by: user.id,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const packing = body.packingList || [];
    if (packing.length) {
      await pg.from('trip_items').insert(
        packing.map((pi: any) => ({
          trip_id: trip.id,
          item_name: pi.itemName || pi.item_name || 'Material',
          quantity: pi.quantityRequired || pi.quantity || 1,
          quantity_packed: pi.quantityPacked || 0,
          is_packed: Boolean(pi.isPacked),
          notes: pi.category || 'General',
        }))
      );
    }

    return NextResponse.json(await loadTripWithItems(pg, trip.id), { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
