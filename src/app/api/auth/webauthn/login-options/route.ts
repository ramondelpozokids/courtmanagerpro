import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { getWebAuthnConfig, isBiometricUser } from '@/lib/webauthn-config';
import { getPasskeysForEmail, hasPasskey, setChallenge } from '@/lib/webauthn-store';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (!isBiometricUser(normalized)) {
      return NextResponse.json({ error: 'Acceso biométrico no disponible para este usuario' }, { status: 403 });
    }

    if (!hasPasskey(normalized)) {
      return NextResponse.json(
        { error: 'Primero configura tu acceso biométrico con email y contraseña' },
        { status: 404 }
      );
    }

    const passkeys = getPasskeysForEmail(normalized);
    const { rpID } = getWebAuthnConfig(request.headers.get('origin') || undefined);

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: passkeys.map((p) => ({
        id: p.credentialID,
        transports: p.transports,
      })),
      userVerification: 'required',
    });

    setChallenge(`login:${normalized}`, options.challenge);

    return NextResponse.json(options);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al generar opciones' }, { status: 500 });
  }
}
