-- ============================================================
-- Hotfix: cast severity/type en triggers de alertas
-- Ejecutar ANTES de reintentar 014_seed_rmf_production.sql
-- ============================================================

CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_available <= NEW.stock_min AND (OLD.stock_available > OLD.stock_min OR TG_OP = 'INSERT') THEN
    INSERT INTO alerts (team_id, type, severity, title, message, entity_type, entity_id)
    VALUES (
      NEW.team_id,
      'stock_bajo'::alert_type,
      (CASE WHEN NEW.stock_available = 0 THEN 'critical' ELSE 'warning' END)::alert_severity,
      'Stock bajo: ' || NEW.name,
      'Quedan ' || NEW.stock_available || ' unidades de ' || NEW.name || '. Mínimo establecido: ' || NEW.stock_min,
      'inventory_item',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_medical_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date IS NOT NULL AND NEW.expiry_date <= CURRENT_DATE + INTERVAL '30 days' AND NEW.expiry_date > CURRENT_DATE THEN
    INSERT INTO alerts (team_id, type, severity, title, message, entity_type, entity_id)
    VALUES (
      NEW.team_id,
      'caducidad_proxima'::alert_type,
      (CASE WHEN NEW.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical' ELSE 'warning' END)::alert_severity,
      'Caducidad próxima: ' || NEW.name,
      NEW.name || ' caduca el ' || to_char(NEW.expiry_date, 'DD/MM/YYYY'),
      'medical_item',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
