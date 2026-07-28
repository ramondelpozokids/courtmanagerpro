-- ATM staff: perfiles oficiales → plantilla atleticodemadrid.com
-- Sin columna "source" (no existe en coaching_staff de producción).
-- IDs canónicos 8008 (Simeone + 4 staff).

UPDATE coaching_staff
SET
  notes = jsonb_set(
    CASE
      WHEN notes IS NULL OR btrim(notes) = '' THEN '{}'::jsonb
      WHEN left(btrim(notes), 1) = '{' THEN notes::jsonb
      ELSE jsonb_build_object('legacy_notes', notes)
    END,
    '{profile_url}',
    to_jsonb('https://www.atleticodemadrid.com/equipos/atletico-de-madrid-2025-2026'::text),
    true
  )::text,
  updated_at = NOW()
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND is_active = true
  AND id IN (
    '00000000-0000-4000-8008-000000000001'::uuid,
    '00000000-0000-4000-8008-000000000002'::uuid,
    '00000000-0000-4000-8008-000000000003'::uuid,
    '00000000-0000-4000-8008-000000000004'::uuid,
    '00000000-0000-4000-8008-000000000005'::uuid
  );
