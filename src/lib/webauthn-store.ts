import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';
import { createClient } from '@supabase/supabase-js';
import { BIOMETRIC_USERS } from '@/lib/webauthn-config';
import { isProductionApp } from '@/lib/app-mode';
import { supabaseUrl, supabaseServiceRoleKey } from '@/infrastructure/supabase/env';
import { credentialIdsMatch, normalizeCredentialId } from '@/lib/webauthn-credential-id';

export interface StoredPasskey {
  email: string;
  credentialID: string;
  credentialPublicKey: Uint8Array;
  counter: number;
  transports?: AuthenticatorTransportFuture[];
}

/** Almacén en memoria de passkeys — solo modo demo. */
const passkeys: StoredPasskey[] = [];

/** Challenges en memoria — solo modo demo. */
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
    credentialID: normalizeCredentialId(row.credential_id),
    credentialPublicKey: Uint8Array.from(Buffer.from(row.credential_public_key, 'base64')),
    counter: Number(row.counter),
    transports: (row.transports || undefined) as AuthenticatorTransportFuture[] | undefined,
  };
}

function webauthnDbError(error: { message: string }, table: string): Error {
  if (error.message.includes(table) || error.message.includes('does not exist')) {
    return new Error(`Falta la tabla ${table} en Supabase. Ejecuta las migraciones 005 y 007 en el SQL Editor.`);
  }
  return new Error(error.message);
}

export async function setChallenge(key: string, challenge: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  if (!isProductionApp()) {
    challenges.set(key, { challenge, expires: Date.now() + 5 * 60 * 1000 });
    return;
  }

  const admin = getAdminClient();
  const { error } = await admin.from('webauthn_challenges').upsert(
    { challenge_key: key, challenge, expires_at: expiresAt },
    { onConflict: 'challenge_key' }
  );
  if (error) throw webauthnDbError(error, 'webauthn_challenges');
}

export async function consumeChallenge(key: string): Promise<string | undefined> {
  if (!isProductionApp()) {
    const entry = challenges.get(key);
    challenges.delete(key);
    if (!entry || entry.expires < Date.now()) return undefined;
    return entry.challenge;
  }

  const admin = getAdminClient();
  const { data, error } = await admin
    .from('webauthn_challenges')
    .select('challenge, expires_at')
    .eq('challenge_key', key)
    .maybeSingle();

  if (error || !data) return undefined;

  await admin.from('webauthn_challenges').delete().eq('challenge_key', key);

  if (new Date(data.expires_at).getTime() < Date.now()) return undefined;
  return data.challenge;
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
  const normalizedId = normalizeCredentialId(credentialID);

  if (!isProductionApp()) {
    return passkeys.find((p) => credentialIdsMatch(p.credentialID, normalizedId));
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from('webauthn_passkeys')
    .select('email, credential_id, credential_public_key, counter, transports');

  const match = (data || []).find((row) => credentialIdsMatch(row.credential_id, normalizedId));
  return match ? rowToPasskey(match) : undefined;
}

export async function savePasskey(passkey: StoredPasskey): Promise<void> {
  const normalized = passkey.email.trim().toLowerCase();
  const credentialID = normalizeCredentialId(passkey.credentialID);

  if (!isProductionApp()) {
    const existing = passkeys.findIndex((p) => credentialIdsMatch(p.credentialID, credentialID));
    const entry = { ...passkey, email: normalized, credentialID };
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
    credential_id: credentialID,
    credential_public_key: Buffer.from(passkey.credentialPublicKey).toString('base64'),
    counter: passkey.counter,
    transports: passkey.transports || [],
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from('webauthn_passkeys')
    .upsert(payload, { onConflict: 'credential_id' });

  if (error) throw webauthnDbError(error, 'webauthn_passkeys');
}

export async function updatePasskeyCounter(credentialID: string, counter: number): Promise<void> {
  const normalizedId = normalizeCredentialId(credentialID);

  if (!isProductionApp()) {
    const passkey = passkeys.find((p) => credentialIdsMatch(p.credentialID, normalizedId));
    if (passkey) passkey.counter = counter;
    return;
  }

  const admin = getAdminClient();
  const { data } = await admin
    .from('webauthn_passkeys')
    .select('credential_id')
    .eq('credential_id', normalizedId)
    .maybeSingle();

  const idToUpdate = data?.credential_id
    || (await admin.from('webauthn_passkeys').select('credential_id')).data
      ?.find((row) => credentialIdsMatch(row.credential_id, normalizedId))?.credential_id;

  if (!idToUpdate) return;

  await admin
    .from('webauthn_passkeys')
    .update({ counter, updated_at: new Date().toISOString() })
    .eq('credential_id', idToUpdate);
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
