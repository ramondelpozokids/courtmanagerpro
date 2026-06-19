export {
  fetchBiometricStatus,
  registerPasskey,
  loginWithPasskey,
  isWebAuthnSupported,
} from '@/lib/passkey-client';

export type { PasskeyLoginResult } from '@/lib/passkey-client';
