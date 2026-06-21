import { NextResponse } from 'next/server';
import { getBiometricStatus } from '@/lib/webauthn-store';

export async function GET() {
  const status = await getBiometricStatus();
  return NextResponse.json(status);
}
