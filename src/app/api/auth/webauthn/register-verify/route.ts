import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { isBiometricUser, getWebAuthnConfig } from '@/lib/webauthn-config';
import { savePasskey, consumeChallenge } from '@/lib/webauthn-store';

export async function POST(request: Request) {
  try {
    const { email, response } = await request.json();
    if (!email || !response) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (!isBiometricUser(normalized)) {
      return NextResponse.json({ error: 'Usuario no autorizado' }, { status: 403 });
    }

    const expectedChallenge = consumeChallenge(`register:${normalized}`);
    if (!expectedChallenge) {
      return NextResponse.json({ error: 'Sesión de registro expirada. Vuelve a intentarlo.' }, { status: 400 });
    }

    const { origin, rpID } = getWebAuthnConfig(request.headers.get('origin') || undefined);

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'No se pudo verificar la huella o Face ID' }, { status: 400 });
    }

    const { credential, credentialDeviceType } = verification.registrationInfo;

    savePasskey({
      email: normalized,
      credentialID: credential.id,
      credentialPublicKey: credential.publicKey,
      counter: credential.counter,
      transports: credential.transports,
    });

    return NextResponse.json({
      success: true,
      deviceType: credentialDeviceType,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en registro biométrico' }, { status: 500 });
  }
}
