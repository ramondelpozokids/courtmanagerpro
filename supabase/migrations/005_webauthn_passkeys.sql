-- Passkeys WebAuthn (Face ID / huella) — persistencia en producción
CREATE TABLE IF NOT EXISTS webauthn_passkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  credential_id TEXT NOT NULL UNIQUE,
  credential_public_key TEXT NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  transports TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webauthn_passkeys_email ON webauthn_passkeys (email);

ALTER TABLE webauthn_passkeys ENABLE ROW LEVEL SECURITY;

-- Solo el service role (API routes) accede; sin políticas para anon/authenticated.
