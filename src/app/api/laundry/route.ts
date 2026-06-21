import { NextResponse } from 'next/server';
import { db as memoryDb } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';
import { laundryRowToUi, laundryStatusToDb, laundryUiToDb } from '@/lib/laundry-mapper';
import type { LaundryBatch } from '@/domain/entities/LaundryBatch';

export async function GET() {
  if (!isServerProduction()) {
    return NextResponse.json(memoryDb.laundry);
  }

  const { supabase, user, response } = await requireApiUser();
  if (response || !user) return response!;
  const pg = supabase as any;

  const { data, error } = await pg
    .from('laundry_batches')
    .select('*')
    .eq('team_id', DEFAULT_TEAM_ID)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(laundryRowToUi));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isServerProduction()) {
      if (body.batchId && body.status) {
        const batch = memoryDb.laundry.find((b) => b.id === body.batchId);
        if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        batch.status = body.status;
        if (body.status === 'READY') {
          (batch as any).completedDate = new Date().toISOString().split('T')[0];
        }
        return NextResponse.json(batch);
      }

      const newBatch = {
        id: 'l_' + Math.random().toString(36).substr(2, 9),
        name: body.name,
        itemCount: body.itemCount || 0,
        status: 'PENDING' as const,
        receivedDate: new Date().toISOString().split('T')[0],
        responsible: body.responsible || 'Carlos (Utillero)',
      };
      memoryDb.laundry.push(newBatch);
      return NextResponse.json(newBatch, { status: 201 });
    }

    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;
    const pg = supabase as any;

    if (body.batchId && body.status) {
      const { data, error } = await pg
        .from('laundry_batches')
        .update({
          status: laundryStatusToDb(body.status as LaundryBatch['status']),
          returned_at: body.status === 'READY' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.batchId)
        .select()
        .single();

      if (error || !data) {
        return NextResponse.json({ error: error?.message || 'Batch not found' }, { status: 404 });
      }
      return NextResponse.json(laundryRowToUi(data));
    }

    const insert = laundryUiToDb(body, DEFAULT_TEAM_ID, user.id);
    const { data, error } = await pg.from('laundry_batches').insert(insert).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(laundryRowToUi(data), { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');
    if (!batchId) return NextResponse.json({ error: 'batchId required' }, { status: 400 });

    if (!isServerProduction()) {
      const index = memoryDb.laundry.findIndex((b) => b.id === batchId);
      if (index === -1) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
      memoryDb.laundry.splice(index, 1);
      return NextResponse.json({ success: true });
    }

    const { supabase, user, response } = await requireApiUser();
    if (response || !user) return response!;

    const { error } = await (supabase as any).from('laundry_batches').delete().eq('id', batchId);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
