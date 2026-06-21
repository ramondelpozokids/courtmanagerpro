import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';
import { isServerProduction, requireApiUser } from '@/lib/supabase-route-auth';
import { DEFAULT_TEAM_ID } from '@/lib/team-constants';

export async function GET(req: NextRequest) {
  if (!isServerProduction()) {
    return NextResponse.json({ data: db.coachingStaff });
  }

  const { supabase, user, response } = await requireApiUser();
  if (response || !user) return response!;

  const teamId = req.nextUrl.searchParams.get('team_id') || DEFAULT_TEAM_ID;
  const { data, error } = await (supabase as any)
    .from('coaching_staff')
    .select('*')
    .eq('team_id', teamId)
    .eq('is_active', true)
    .order('full_name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!isServerProduction()) {
    const member = {
      id: body.id || `c_${Math.random().toString(36).slice(2, 9)}`,
      full_name: body.full_name,
      role: body.role,
      email: body.email || `${String(body.full_name).toLowerCase().replace(/\s/g, '')}@club.local`,
      nationality: body.nationality || 'España',
      shirt_size: body.shirt_size || 'L',
      shorts_size: body.shorts_size || 'L',
      shoe_size: body.shoe_size ?? 43,
      photo_url: body.photo_url || null,
    };
    db.coachingStaff.push(member);
    return NextResponse.json({ data: member }, { status: 201 });
  }

  const { supabase, user, response } = await requireApiUser();
  if (response || !user) return response!;

  const teamId = body.team_id || DEFAULT_TEAM_ID;
  const { data, error } = await (supabase as any)
    .from('coaching_staff')
    .insert({
      team_id: teamId,
      full_name: body.full_name,
      role: body.role,
      email: body.email,
      nationality: body.nationality || 'España',
      shirt_size: body.shirt_size || 'L',
      shorts_size: body.shorts_size || 'L',
      shoe_size: body.shoe_size ?? 43,
      jacket_size: body.jacket_size,
      sock_size: body.sock_size,
      photo_url: body.photo_url,
      sizing_metadata: body.sizing_metadata || {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
