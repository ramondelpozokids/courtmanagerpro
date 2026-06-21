import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { getWebAuthnConfig, isBiometricUser } from '@/lib/webauthn-config';
import { getPasskeysForEmail, hasPasskey, setChallenge } from '@/lib/webauthn-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, origin: bodyOrigin } = body;
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (!isBiometricUser(normalized)) {
      return NextResponse.json({ error: 'Acceso biométrico no disponible para este usuario' }, { status: 403 });
    }

    if (!(await hasPasskey(normalized))) {
      return NextResponse.json(
        { error: 'Primero configura tu acceso biométrico con email y contraseña' },
        { status: 404 }
      );
    }

    const { rpID } = getWebAuthnConfig(
      bodyOrigin,
      request.headers.get('origin'),
      request.headers.get('referer')
    );

    const passkeys = await getPasskeysForEmail(normalized);
    const useDiscoverable = body.discoverable === true;

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: 'preferred',
      ...(useDiscoverable || passkeys.length === 0
        ? {}
        : {
            allowCredentials: passkeys.map((p) => ({
              id: p.credentialID,
              transports: p.transports,
            })),
          }),
    });

    await setChallenge(`login:${normalized}`, options.challenge);

    return NextResponse.json(options);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al generar opciones' }, { status: 500 });
  }
}
