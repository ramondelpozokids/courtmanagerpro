import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { isProductionApp } from '@/lib/app-mode';
import { getWebAuthnConfig, isBiometricUser } from '@/lib/webauthn-config';
import {
  consumeChallenge,
  getPasskeyByCredentialId,
  updatePasskeyCounter,
} from '@/lib/webauthn-store';
import { createSupabaseSessionForEmail } from '@/lib/webauthn-password-verify';
import { getBiometricLoginUser } from '@/lib/webauthn-user';

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

    const passkey = await getPasskeyByCredentialId(response.id);
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

    await updatePasskeyCounter(passkey.credentialID, verification.authenticationInfo.newCounter);

    const user = await getBiometricLoginUser(normalized);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const payload: Record<string, string | undefined> = {
      role: user.role,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
    };

    if (isProductionApp()) {
      const session = await createSupabaseSessionForEmail(normalized);
      if (!session) {
        return NextResponse.json({ error: 'No se pudo iniciar sesión' }, { status: 500 });
      }
      payload.access_token = session.access_token;
      payload.refresh_token = session.refresh_token;
    }

    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error en autenticación biométrica' }, { status: 500 });
  }
}
