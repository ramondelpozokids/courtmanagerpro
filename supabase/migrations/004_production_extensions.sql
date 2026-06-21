-- ============================================================
-- CourtManager Pro — Migración 004: tablas producción
-- garment_units, coaching_staff, catálogo tallas, alerta cumpleaños
-- ============================================================

-- Alerta cumpleaños (usada por birthday-alerts)
ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'cumpleanos';

-- ============================================================
-- Cuerpo técnico
-- ============================================================
CREATE TABLE IF NOT EXISTS coaching_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  nationality TEXT DEFAULT 'España',
  photo_url TEXT,
  shirt_size TEXT DEFAULT 'L',
  shorts_size TEXT DEFAULT 'L',
  shoe_size NUMERIC(4,1) DEFAULT 43,
  jacket_size TEXT,
  sock_size TEXT,
  sizing_metadata JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaching_staff_team ON coaching_staff(team_id) WHERE is_active = true;

-- ============================================================
-- Unidades de prenda (QR por pieza física)
-- ============================================================
CREATE TYPE garment_status AS ENUM (
  'disponible',
  'asignada',
  'en_lavanderia',
  'en_viaje',
  'baja'
);

CREATE TYPE garment_condition AS ENUM (
  'nuevo',
  'bueno',
  'desgastado'
);

CREATE TABLE IF NOT EXISTS garment_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL UNIQUE,
  item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  category TEXT NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player_name TEXT,
  player_number INTEGER,
  size TEXT NOT NULL,
  wash_count INTEGER NOT NULL DEFAULT 0,
  status garment_status NOT NULL DEFAULT 'asignada',
  location TEXT,
  image_url TEXT,
  last_wash_date DATE,
  condition garment_condition NOT NULL DEFAULT 'nuevo',
  last_scanned_at TIMESTAMPTZ,
  product_ref TEXT,
  barcode TEXT,
  brand TEXT,
  rfid_tag TEXT,
  scan_aliases JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_garment_units_team ON garment_units(team_id);
CREATE INDEX IF NOT EXISTS idx_garment_units_qr ON garment_units(qr_code);
CREATE INDEX IF NOT EXISTS idx_garment_units_barcode ON garment_units(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_garment_units_player ON garment_units(player_id) WHERE player_id IS NOT NULL;

-- ============================================================
-- Productos de tallaje personalizados por club
-- ============================================================
CREATE TABLE IF NOT EXISTS sizing_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  product_key TEXT NOT NULL,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  default_size TEXT DEFAULT '—',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, product_key)
);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE coaching_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE garment_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizing_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coaching_staff_team_access" ON coaching_staff
  FOR ALL USING (
    team_id IN (SELECT team_id FROM user_teams WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "garment_units_team_access" ON garment_units
  FOR ALL USING (
    team_id IN (SELECT team_id FROM user_teams WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "sizing_products_team_access" ON sizing_products
  FOR ALL USING (
    team_id IN (SELECT team_id FROM user_teams WHERE user_id = auth.uid() AND is_active = true)
  );
