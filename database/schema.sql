-- Bio-Link PostgreSQL schema (SDD data model: 6 core entities + thresholds)
-- Idempotent-ish init script for local development.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enumerations -------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('FARMER', 'DRIVER', 'QC', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE batch_status AS ENUM
    ('SUBMITTED', 'IN_TRANSIT', 'RECEIVED', 'GRADED', 'ACCEPTED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE qc_decision AS ENUM ('PENDING', 'APPROVED', 'OVERRIDDEN', 'REVIEW');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 1. Users -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  full_name       TEXT NOT NULL,
  role            user_role NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  failed_attempts INT NOT NULL DEFAULT 0,
  locked_until    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Harvest batches -------------------------------------------------------
CREATE TABLE IF NOT EXISTS harvest_batches (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id      UUID NOT NULL REFERENCES users(id),
  crop_type      TEXT NOT NULL,
  quantity_kg    NUMERIC(10,2) NOT NULL CHECK (quantity_kg > 0),
  photo_urls     TEXT[] NOT NULL DEFAULT '{}',
  certification_url TEXT,
  client_ref     TEXT,                          -- offline idempotency key
  current_status batch_status NOT NULL DEFAULT 'SUBMITTED',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (farmer_id, client_ref)
);

-- 3. Shipments (trips) -----------------------------------------------------
CREATE TABLE IF NOT EXISTS shipments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id    UUID NOT NULL REFERENCES users(id),
  origin       TEXT,
  destination  TEXT,
  started_at   TIMESTAMPTZ,
  ended_at     TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- link batches to a shipment (a trip carries many batches)
ALTER TABLE harvest_batches
  ADD COLUMN IF NOT EXISTS shipment_id UUID REFERENCES shipments(id);

-- 4. Telemetry readings ----------------------------------------------------
CREATE TABLE IF NOT EXISTS telemetry_readings (
  id           BIGSERIAL PRIMARY KEY,
  shipment_id  UUID NOT NULL REFERENCES shipments(id),
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  temperature_c NUMERIC(5,2),
  humidity_pct  NUMERIC(5,2),
  is_breach    BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_telemetry_shipment_time
  ON telemetry_readings (shipment_id, recorded_at);

-- 5. Quality assessments ---------------------------------------------------
CREATE TABLE IF NOT EXISTS quality_assessments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id        UUID NOT NULL REFERENCES harvest_batches(id),
  ai_grade        TEXT,
  ai_confidence   NUMERIC(4,3) CHECK (ai_confidence BETWEEN 0 AND 1),
  final_grade     TEXT,
  decision        qc_decision NOT NULL DEFAULT 'PENDING',
  reviewed_by     UUID REFERENCES users(id),
  assessed_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. e-PoO (electronic Proof-of-Origin) ------------------------------------
CREATE TABLE IF NOT EXISTS epoo (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL UNIQUE REFERENCES quality_assessments(id),
  qr_payload    TEXT NOT NULL,                 -- signed, tamper-evident token
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alert thresholds (US007) -------------------------------------------------
CREATE TABLE IF NOT EXISTS alert_thresholds (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produce_category TEXT UNIQUE NOT NULL,
  max_temperature_c NUMERIC(5,2) NOT NULL,
  min_temperature_c NUMERIC(5,2),
  max_humidity_pct  NUMERIC(5,2)
);
