import { NextResponse } from 'next/server';
import { getBiometricStatus } from '@/lib/webauthn-store';

export async function GET() {
  return NextResponse.json(getBiometricStatus());
}
