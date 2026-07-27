-- Limpia actividad/solicitudes ajenas al ATM (p. ej. Luwawu-Cabarrot / ADI PERF POLO de RMB)
-- Team ATM: 00000000-0000-4000-8000-000acb423458

-- Solicitudes ATM cuyo jugador no pertenece al ATM
DELETE FROM request_comments
WHERE request_id IN (
  SELECT r.id
  FROM requests r
  LEFT JOIN players p ON p.id = r.player_id
  WHERE r.team_id = '00000000-0000-4000-8000-000acb423458'::uuid
    AND (
      (r.player_id IS NOT NULL AND (p.id IS NULL OR p.team_id IS DISTINCT FROM r.team_id))
      OR r.title ILIKE '%ADI PERF%'
      OR r.title ILIKE '%Luwawu%'
      OR r.title ILIKE '%Cabarrot%'
    )
);

DELETE FROM request_items
WHERE request_id IN (
  SELECT r.id
  FROM requests r
  LEFT JOIN players p ON p.id = r.player_id
  WHERE r.team_id = '00000000-0000-4000-8000-000acb423458'::uuid
    AND (
      (r.player_id IS NOT NULL AND (p.id IS NULL OR p.team_id IS DISTINCT FROM r.team_id))
      OR r.title ILIKE '%ADI PERF%'
      OR r.title ILIKE '%Luwawu%'
      OR r.title ILIKE '%Cabarrot%'
    )
);

DELETE FROM requests r
USING players p
WHERE r.player_id = p.id
  AND r.team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND p.team_id IS DISTINCT FROM r.team_id;

DELETE FROM requests
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND (
    title ILIKE '%ADI PERF%'
    OR title ILIKE '%Luwawu%'
    OR title ILIKE '%Cabarrot%'
  );

-- Alertas ATM que mencionan jugadores/material de RMB
DELETE FROM alerts
WHERE team_id = '00000000-0000-4000-8000-000acb423458'::uuid
  AND (
    message ILIKE '%Luwawu%'
    OR message ILIKE '%Cabarrot%'
    OR message ILIKE '%ADI PERF%'
    OR title ILIKE '%Luwawu%'
    OR title ILIKE '%Cabarrot%'
  );
