import { NextResponse } from 'next/server';
import { db } from '@/infrastructure/supabase/repositories/InMemoryDB';

export async function GET() {
  return NextResponse.json({ data: db.coachingStaff });
}
