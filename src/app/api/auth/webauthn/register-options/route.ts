import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { findMockCredential } from '@/lib/auth-credentials';
import { getWebAuthnConfig, isBiometricUser } from '@/lib/webauthn-config';
import { getPasskeysForEmail, setChallenge } from '@/lib/webauthn-store';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    if (!isBiometricUser(normalized)) {
      return NextResponse.json({ error: 'Acceso biométrico solo para administradores autorizados' }, { status: 403 });
    }

    const cred = findMockCredential(normalized, password);
    if (!cred) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    const { rpName, rpID } = getWebAuthnConfig(request.headers.get('origin') || undefined);
    const existing = getPasskeysForEmail(normalized);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: normalized,
      userID: new TextEncoder().encode(normalized),
      userDisplayName: cred.full_name,
      attestationType: 'none',
      excludeCredentials: existing.map((p) => ({
        id: p.credentialID,
        transports: p.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'required',
        authenticatorAttachment: 'platform',
      },
    });

    setChallenge(`register:${normalized}`, options.challenge);

    return NextResponse.json(options);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error al generar opciones' }, { status: 500 });
  }
}
