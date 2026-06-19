import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { MOCK_CREDENTIALS } from '@/lib/auth-credentials';
import { getWebAuthnConfig, isBiometricUser } from '@/lib/webauthn-config';
import {
  consumeChallenge,
  getPasskeyByCredentialId,
  updatePasskeyCounter,
} from '@/lib/webauthn-store';

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

    const expectedChallenge = consumeChallenge(`login:${normalized}`);
    if (!expectedChallenge) {
      return NextResponse.json({ error: 'Sesión expirada. Vuelve a intentarlo.' }, { status: 400 });
    }

    const passkey = getPasskeyByCredentialId(response.id);
    if (!passkey || passkey.email !== normalized) {
      return NextResponse.json({ error: 'Credencial biométrica no reconocida' }, { status: 401 });
    }

    const { origin, rpID } = getWebAuthnConfig(request.headers.get('origin') || undefined);

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
      credential: {
        id: passkey.credentialID,
        publicKey: new Uint8Array(passkey.credentialPublicKey),
        counter: passkey.counter,
        transports: passkey.transports,
      },
    });

    if (!verification.verified) {
      return NextResponse.json({ error: 'Autenticación biométrica fallida' }, { status: 401 });
    }

    updatePasskeyCounter(passkey.credentialID, verification.authenticationInfo.newCounter);

    const userCred = MOCK_CREDENTIALS.find((c) => c.email.toLowerCase() === normalized);
    if (!userCred) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      role: userCred.role,
      email: userCred.email,
      full_name: userCred.full_name,
      avatar_url: userCred.avatar_url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en autenticación biométrica' }, { status: 500 });
  }
}
