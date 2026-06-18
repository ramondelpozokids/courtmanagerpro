-- ============================================================
-- CourtManager Pro — Esquema SQL Completo
-- Supabase PostgreSQL 15
-- Migración 001: Esquema inicial
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- búsqueda de texto
CREATE EXTENSION IF NOT EXISTS "unaccent"; -- búsqueda sin tildes

-- ============================================================
-- TIPOS ENUM
-- ============================================================
CREATE TYPE user_role AS ENUM (
  'admin',
  'equipment_manager',
  'assistant',
  'player',
  'medical',
  'coach'
);

CREATE TYPE player_position AS ENUM (
  'base',
  'escolta',
  'alero',
  'ala_pivot',
  'pivot'
);

CREATE TYPE item_category AS ENUM (
  'camiseta_juego',
  'camiseta_entrenamiento',
  'pantalon_juego',
  'pantalon_entrenamiento',
  'zapatillas',
  'calcetines',
  'ropa_interior',
  'chaqueta',
  'chandal',
  'accesorios',
  'equipamiento_cancha',
  'electronica',
  'medico',
  'higiene',
  'otro'
);

CREATE TYPE item_condition AS ENUM (
  'nuevo',
  'excelente',
  'bueno',
  'regular',
  'deteriorado',
  'baja'
);

CREATE TYPE request_status AS ENUM (
  'pendiente',
  'aprobada',
  'rechazada',
  'en_proceso',
  'completada',
  'cancelada'
);

CREATE TYPE request_priority AS ENUM (
  'urgente',
  'alta',
  'normal',
  'baja'
);

CREATE TYPE trip_type AS ENUM (
  'liga_acb',
  'copa_del_rey',
  'eurocup',
  'euroleague',
  'amistoso',
  'pretemporada'
);

CREATE TYPE trip_status AS ENUM (
  'planificado',
  'en_preparacion',
  'en_curso',
  'completado',
  'cancelado'
);

CREATE TYPE laundry_status AS ENUM (
  'sucio',
  'en_lavado',
  'limpio',
  'entregado'
);

CREATE TYPE alert_type AS ENUM (
  'stock_bajo',
  'caducidad_proxima',
  'solicitud_pendiente',
  'item_deteriorado',
  'viaje_proximo',
  'lavanderia_pendiente',
  'asignacion_vencida'
);

CREATE TYPE alert_severity AS ENUM (
  'info',
  'warning',
  'critical'
);

-- ============================================================
-- TABLA: profiles (extiende auth.users de Supabase)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'assistant',
  phone TEXT,
  department TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: teams
-- ============================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL, -- "MAN", "BAR"
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1a1a2e',
  secondary_color TEXT DEFAULT '#e94560',
  season TEXT NOT NULL, -- "2024-25"
  league TEXT NOT NULL DEFAULT 'ACB',
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: players
-- ============================================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  dorsal INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  position player_position NOT NULL,
  nationality TEXT,
  birth_date DATE,
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  -- Tallas de equipación
  shirt_size TEXT, -- XS, S, M, L, XL, XXL, XXXL
  shorts_size TEXT,
  shoe_size NUMERIC(4,1), -- 42.5
  jacket_size TEXT,
  underwear_size TEXT,
  sock_size TEXT,
  suit_size TEXT,
  hat_size TEXT,
  -- Datos adicionales
  jersey_name TEXT, -- Nombre en camiseta
  contract_end DATE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, dorsal)
);

-- ============================================================
-- TABLA: inventory_items
-- ============================================================
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category item_category NOT NULL,
  brand TEXT,
  model TEXT,
  sku TEXT, -- SKU interno
  barcode TEXT, -- EAN-13 o similar
  qr_code TEXT UNIQUE, -- UUID del QR
  -- Stock
  stock_total INTEGER NOT NULL DEFAULT 0,
  stock_available INTEGER NOT NULL DEFAULT 0,
  stock_assigned INTEGER NOT NULL DEFAULT 0,
  stock_min INTEGER NOT NULL DEFAULT 1, -- umbral alerta
  stock_max INTEGER,
  -- Características
  condition item_condition NOT NULL DEFAULT 'nuevo',
  size TEXT,
  color TEXT,
  unit_cost NUMERIC(10,2),
  currency TEXT DEFAULT 'EUR',
  -- Ubicación
  location TEXT, -- "Almacén A, Estantería 3"
  location_detail TEXT,
  -- Imágenes
  image_url TEXT,
  images JSONB DEFAULT '[]', -- array de URLs
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: item_assignments (ítem asignado a jugador)
-- ============================================================
CREATE TABLE item_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES profiles(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  returned_at TIMESTAMPTZ,
  expected_return DATE,
  condition_out item_condition,
  condition_in item_condition,
  notes TEXT,
  is_returned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: requests (solicitudes de material)
-- ============================================================
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES profiles(id),
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority request_priority NOT NULL DEFAULT 'normal',
  status request_status NOT NULL DEFAULT 'pendiente',
  category item_category,
  quantity INTEGER DEFAULT 1,
  size TEXT,
  estimated_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  -- Workflow
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  due_date DATE,
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: request_items (ítems de una solicitud)
-- ============================================================
CREATE TABLE request_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL, -- snapshot por si el ítem se elimina
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  notes TEXT,
  fulfilled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: request_comments
-- ============================================================
CREATE TABLE request_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false, -- solo staff
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: trips (viajes del equipo)
-- ============================================================
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trip_type trip_type NOT NULL,
  status trip_status NOT NULL DEFAULT 'planificado',
  destination TEXT NOT NULL,
  opponent TEXT,
  departure_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ NOT NULL,
  departure_from TEXT,
  accommodation TEXT,
  transport_type TEXT, -- "vuelo", "autobús", "tren"
  flight_number TEXT,
  hotel_name TEXT,
  hotel_address TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: trip_players (jugadores en el viaje)
-- ============================================================
CREATE TABLE trip_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  included BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(trip_id, player_id)
);

-- ============================================================
-- TABLA: trip_items (equipamiento para el viaje)
-- ============================================================
CREATE TABLE trip_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  quantity_packed INTEGER DEFAULT 0,
  quantity_returned INTEGER DEFAULT 0,
  is_packed BOOLEAN NOT NULL DEFAULT false,
  is_returned BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: laundry_batches (lotes de lavandería)
-- ============================================================
CREATE TABLE laundry_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Lote post-partido Jornada 12"
  created_by UUID NOT NULL REFERENCES profiles(id),
  status laundry_status NOT NULL DEFAULT 'sucio',
  sent_at TIMESTAMPTZ,
  expected_return TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  laundry_service TEXT,
  cost NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: laundry_items (prendas en el lote)
-- ============================================================
CREATE TABLE laundry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES laundry_batches(id) ON DELETE CASCADE,
  item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status laundry_status NOT NULL DEFAULT 'sucio',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: medical_items (material médico/sanitario)
-- ============================================================
CREATE TABLE medical_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- "fármaco", "material cura", "ortopedia"
  brand TEXT,
  reference TEXT,
  barcode TEXT,
  stock_total INTEGER NOT NULL DEFAULT 0,
  stock_min INTEGER NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'unidad', -- "caja", "ml", "g"
  expiry_date DATE,
  batch_number TEXT,
  storage_temp TEXT, -- "2-8°C", "temperatura ambiente"
  prescription_required BOOLEAN NOT NULL DEFAULT false,
  location TEXT,
  supplier TEXT,
  unit_cost NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: medical_usage (uso de material médico)
-- ============================================================
CREATE TABLE medical_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES medical_items(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  used_by UUID NOT NULL REFERENCES profiles(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  reason TEXT,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

-- ============================================================
-- TABLA: alerts (sistema de alertas)
-- ============================================================
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  type alert_type NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT, -- "inventory_item", "trip", etc.
  entity_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  read_by UUID REFERENCES profiles(id),
  read_at TIMESTAMPTZ,
  auto_generated BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: audit_log (trazabilidad)
-- ============================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- "CREATE", "UPDATE", "DELETE"
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLA: user_teams (relación usuarios-equipos)
-- ============================================================
CREATE TABLE user_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'assistant',
  is_active BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

-- ============================================================
-- ÍNDICES DE RENDIMIENTO
-- ============================================================

-- Players
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_players_active ON players(team_id, is_active);
CREATE INDEX idx_players_search ON players USING gin(to_tsvector('spanish', full_name));

-- Inventory
CREATE INDEX idx_inventory_team ON inventory_items(team_id);
CREATE INDEX idx_inventory_category ON inventory_items(team_id, category);
CREATE INDEX idx_inventory_barcode ON inventory_items(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_inventory_qr ON inventory_items(qr_code) WHERE qr_code IS NOT NULL;
CREATE INDEX idx_inventory_low_stock ON inventory_items(team_id) WHERE stock_available <= stock_min AND is_active = true;

-- Assignments
CREATE INDEX idx_assignments_player ON item_assignments(player_id);
CREATE INDEX idx_assignments_item ON item_assignments(item_id);
CREATE INDEX idx_assignments_active ON item_assignments(player_id, is_returned) WHERE is_returned = false;

-- Requests
CREATE INDEX idx_requests_team ON requests(team_id);
CREATE INDEX idx_requests_status ON requests(team_id, status);
CREATE INDEX idx_requests_requester ON requests(requester_id);
CREATE INDEX idx_requests_player ON requests(player_id) WHERE player_id IS NOT NULL;

-- Trips
CREATE INDEX idx_trips_team ON trips(team_id);
CREATE INDEX idx_trips_dates ON trips(team_id, departure_date, return_date);
CREATE INDEX idx_trips_status ON trips(team_id, status);

-- Laundry
CREATE INDEX idx_laundry_team ON laundry_batches(team_id);
CREATE INDEX idx_laundry_status ON laundry_batches(team_id, status);

-- Medical
CREATE INDEX idx_medical_team ON medical_items(team_id);
CREATE INDEX idx_medical_expiry ON medical_items(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_medical_low_stock ON medical_items(team_id) WHERE stock_total <= stock_min;

-- Alerts
CREATE INDEX idx_alerts_team ON alerts(team_id);
CREATE INDEX idx_alerts_unread ON alerts(team_id, is_read, is_dismissed) WHERE is_read = false AND is_dismissed = false;

-- Audit
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_log(created_at DESC);

-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Trigger: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles',
    'teams',
    'players',
    'inventory_items',
    'requests',
    'trips',
    'laundry_batches',
    'medical_items'
  ] LOOP
    EXECUTE format('
      CREATE TRIGGER trg_%s_updated_at
      BEFORE UPDATE ON %s
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at()', t, t);
  END LOOP;
END;
$$;

-- Función: actualizar stock disponible al asignar
CREATE OR REPLACE FUNCTION update_stock_on_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE inventory_items
    SET stock_available = stock_available - NEW.quantity,
        stock_assigned = stock_assigned + NEW.quantity
    WHERE id = NEW.item_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.is_returned = true AND OLD.is_returned = false THEN
    UPDATE inventory_items
    SET stock_available = stock_available + OLD.quantity,
        stock_assigned = stock_assigned - OLD.quantity
    WHERE id = OLD.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assignment_stock
AFTER INSERT OR UPDATE ON item_assignments
FOR EACH ROW
EXECUTE FUNCTION update_stock_on_assignment();

-- Función: generar alerta de stock bajo
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_available <= NEW.stock_min AND (OLD.stock_available > OLD.stock_min OR TG_OP = 'INSERT') THEN
    INSERT INTO alerts (team_id, type, severity, title, message, entity_type, entity_id)
    VALUES (
      NEW.team_id,
      'stock_bajo',
      CASE WHEN NEW.stock_available = 0 THEN 'critical' ELSE 'warning' END,
      'Stock bajo: ' || NEW.name,
      'Quedan ' || NEW.stock_available || ' unidades de ' || NEW.name || '. Mínimo establecido: ' || NEW.stock_min,
      'inventory_item',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_inventory_low_stock
AFTER INSERT OR UPDATE ON inventory_items
FOR EACH ROW
EXECUTE FUNCTION check_low_stock();

-- Función: alerta de caducidad próxima (médico)
CREATE OR REPLACE FUNCTION check_medical_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date IS NOT NULL AND NEW.expiry_date <= CURRENT_DATE + INTERVAL '30 days' AND NEW.expiry_date > CURRENT_DATE THEN
    INSERT INTO alerts (team_id, type, severity, title, message, entity_type, entity_id)
    VALUES (
      NEW.team_id,
      'caducidad_proxima',
      CASE WHEN NEW.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical' ELSE 'warning' END,
      'Caducidad próxima: ' || NEW.name,
      NEW.name || ' caduca el ' || to_char(NEW.expiry_date, 'DD/MM/YYYY'),
      'medical_item',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_medical_expiry
AFTER INSERT OR UPDATE ON medical_items
FOR EACH ROW
EXECUTE FUNCTION check_medical_expiry();

-- Función: registro de auditoría automático
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, entity_type, entity_id, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE TG_OP WHEN 'DELETE' THEN OLD.id ELSE NEW.id END,
    CASE TG_OP WHEN 'INSERT' THEN NULL ELSE row_to_json(OLD)::jsonb END,
    CASE TG_OP WHEN 'DELETE' THEN NULL ELSE row_to_json(NEW)::jsonb END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: obtener estadísticas del dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_team_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_players', (SELECT COUNT(*) FROM players WHERE team_id = p_team_id AND is_active),
    'total_items', (SELECT COUNT(*) FROM inventory_items WHERE team_id = p_team_id AND is_active),
    'low_stock_items', (SELECT COUNT(*) FROM inventory_items WHERE team_id = p_team_id AND is_active AND stock_available <= stock_min),
    'pending_requests', (SELECT COUNT(*) FROM requests WHERE team_id = p_team_id AND status = 'pendiente'),
    'active_assignments', (SELECT COUNT(*) FROM item_assignments ia JOIN inventory_items ii ON ia.item_id = ii.id WHERE ii.team_id = p_team_id AND ia.is_returned = false),
    'upcoming_trips', (SELECT COUNT(*) FROM trips WHERE team_id = p_team_id AND departure_date > NOW() AND status IN ('planificado', 'en_preparacion')),
    'laundry_pending', (SELECT COUNT(*) FROM laundry_batches WHERE team_id = p_team_id AND status IN ('sucio', 'en_lavado')),
    'critical_alerts', (SELECT COUNT(*) FROM alerts WHERE team_id = p_team_id AND severity = 'critical' AND is_dismissed = false AND is_read = false),
    'expiring_medical', (SELECT COUNT(*) FROM medical_items WHERE team_id = p_team_id AND expiry_date <= CURRENT_DATE + INTERVAL '30 days' AND expiry_date > CURRENT_DATE)
  ) INTO result;
  RETURN result;
END;
$$;

-- Función: obtener inventario de un jugador
CREATE OR REPLACE FUNCTION get_player_inventory(p_player_id UUID)
RETURNS TABLE (
  assignment_id UUID,
  item_id UUID,
  item_name TEXT,
  category item_category,
  quantity INTEGER,
  assigned_at TIMESTAMPTZ,
  condition item_condition
) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT ia.id, ii.id, ii.name, ii.category, ia.quantity, ia.assigned_at, ia.condition_out
  FROM item_assignments ia
  JOIN inventory_items ii ON ia.item_id = ii.id
  WHERE ia.player_id = p_player_id AND ia.is_returned = false
  ORDER BY ia.assigned_at DESC;
$$;
