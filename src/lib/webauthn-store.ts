import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';

export interface StoredPasskey {
  email: string;
  credentialID: string;
  credentialPublicKey: Uint8Array;
  counter: number;
  transports?: AuthenticatorTransportFuture[];
}

/** Almacén en memoria de passkeys — migrar a BD en producción. */
const passkeys: StoredPasskey[] = [];

/** Challenges temporales para verificación WebAuthn (expiran en 5 min). */
const challenges = new Map<string, { challenge: string; expires: number }>();

export function setChallenge(key: string, challenge: string): void {
  challenges.set(key, { challenge, expires: Date.now() + 5 * 60 * 1000 });
}

export function consumeChallenge(key: string): string | undefined {
  const entry = challenges.get(key);
  challenges.delete(key);
  if (!entry || entry.expires < Date.now()) return undefined;
  return entry.challenge;
}

export function getPasskeysForEmail(email: string): StoredPasskey[] {
  const normalized = email.trim().toLowerCase();
  return passkeys.filter((p) => p.email === normalized);
}

export function hasPasskey(email: string): boolean {
  return getPasskeysForEmail(email).length > 0;
}

export function getPasskeyByCredentialId(credentialID: string): StoredPasskey | undefined {
  return passkeys.find((p) => p.credentialID === credentialID);
}

export function savePasskey(passkey: StoredPasskey): void {
  const normalized = passkey.email.trim().toLowerCase();
  const existing = passkeys.findIndex((p) => p.credentialID === passkey.credentialID);
  const entry = { ...passkey, email: normalized };
  if (existing >= 0) {
    passkeys[existing] = entry;
  } else {
    passkeys.push(entry);
  }
}

export function updatePasskeyCounter(credentialID: string, counter: number): void {
  const passkey = passkeys.find((p) => p.credentialID === credentialID);
  if (passkey) passkey.counter = counter;
}

/** Estado de passkeys registradas (para UI). */
export function getBiometricStatus(): Record<string, boolean> {
  const status: Record<string, boolean> = {};
  for (const email of ['ramon.delpozo@realmadrid.com', 'charlie-r-k@hotmail.com']) {
    status[email] = hasPasskey(email);
  }
  return status;
}
