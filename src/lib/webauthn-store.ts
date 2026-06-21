import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';
import { createClient } from '@supabase/supabase-js';
import { BIOMETRIC_USERS } from '@/lib/webauthn-config';
import { isProductionApp } from '@/lib/app-mode';
import { supabaseUrl, supabaseServiceRoleKey } from '@/infrastructure/supabase/env';

export interface StoredPasskey {
  email: string;
  credentialID: string;
  credentialPublicKey: Uint8Array;
  counter: number;
  transports?: AuthenticatorTransportFuture[];
}

/** Almacén en memoria de passkeys — solo modo demo. */
const passkeys: StoredPasskey[] = [];

/** Challenges temporales para verificación WebAuthn (expiran en 5 min). */
const challenges = new Map<string, { challenge: string; expires: number }>();

function getAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function rowToPasskey(row: {
  email: string;
  credential_id: string;
  credential_public_key: string;
  counter: number;
  transports: string[] | null;
}): StoredPasskey {
  return {
    email: row.email,
    credentialID: row.credential_id,
    credentialPublicKey: Uint8Array.from(Buffer.from(row.credential_public_key, 'base64')),
    counter: Number(row.counter),
    transports: (row.transports || undefined) as AuthenticatorTransportFuture[] | undefined,
  };
}

export function setChallenge(key: string, challenge: string): void {
  challenges.set(key, { challenge, expires: Date.now() + 5 * 60 * 1000 });
}

export function consumeChallenge(key: string): string | undefined {
  const entry = challenges.get(key);
  challenges.delete(key);
  if (!entry || entry.expires < Date.now()) return undefined;
  return entry.challenge;
}

export async function getPasskeysForEmail(email: string): Promise<StoredPasskey[]> {
  const normalized = email.trim().toLowerCase();

  if (!isProductionApp()) {
    return passkeys.filter((p) => p.email === normalized);
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from('webauthn_passkeys')
    .select('email, credential_id, credential_public_key, counter, transports')
    .eq('email', normalized);

  return (data || []).map(rowToPasskey);
}

export async function hasPasskey(email: string): Promise<boolean> {
  const list = await getPasskeysForEmail(email);
  return list.length > 0;
}

export async function getPasskeyByCredentialId(credentialID: string): Promise<StoredPasskey | undefined> {
  if (!isProductionApp()) {
    return passkeys.find((p) => p.credentialID === credentialID);
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from('webauthn_passkeys')
    .select('email, credential_id, credential_public_key, counter, transports')
    .eq('credential_id', credentialID)
    .maybeSingle();

  return data ? rowToPasskey(data) : undefined;
}

export async function savePasskey(passkey: StoredPasskey): Promise<void> {
  const normalized = passkey.email.trim().toLowerCase();

  if (!isProductionApp()) {
    const existing = passkeys.findIndex((p) => p.credentialID === passkey.credentialID);
    const entry = { ...passkey, email: normalized };
    if (existing >= 0) {
      passkeys[existing] = entry;
    } else {
      passkeys.push(entry);
    }
    return;
  }

  const admin = getAdminClient();
  const payload = {
    email: normalized,
    credential_id: passkey.credentialID,
    credential_public_key: Buffer.from(passkey.credentialPublicKey).toString('base64'),
    counter: passkey.counter,
    transports: passkey.transports || [],
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from('webauthn_passkeys')
    .upsert(payload, { onConflict: 'credential_id' });

  if (error) throw new Error(error.message);
}

export async function updatePasskeyCounter(credentialID: string, counter: number): Promise<void> {
  if (!isProductionApp()) {
    const passkey = passkeys.find((p) => p.credentialID === credentialID);
    if (passkey) passkey.counter = counter;
    return;
  }

  const admin = getAdminClient();
  await admin
    .from('webauthn_passkeys')
    .update({ counter, updated_at: new Date().toISOString() })
    .eq('credential_id', credentialID);
}

/** Estado de passkeys registradas (para UI). */
export async function getBiometricStatus(): Promise<Record<string, boolean>> {
  const status: Record<string, boolean> = {};

  if (!isProductionApp()) {
    for (const email of BIOMETRIC_USERS) {
      status[email] = passkeys.some((p) => p.email === email);
    }
    return status;
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from('webauthn_passkeys')
    .select('email')
    .in('email', [...BIOMETRIC_USERS]);

  const registered = new Set((data || []).map((r) => r.email.toLowerCase()));
  for (const email of BIOMETRIC_USERS) {
    status[email] = registered.has(email);
  }
  return status;
}
