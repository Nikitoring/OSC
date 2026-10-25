
-- Open Street Cat: initial schema for a fresh PostgreSQL/PostGIS database.
-- This file runs only when the PostgreSQL data directory is empty.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cats (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  gender TEXT NOT NULL DEFAULT 'unknown'
    CHECK (gender IN ('male', 'female', 'unknown')),
  location GEOGRAPHY(Point, 4326) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS cat_photos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cat_id BIGINT NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS help_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cat_id BIGINT NOT NULL REFERENCES cats(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('food', 'medical', 'home')),
  status TEXT NOT NULL CHECK (status IN ('needed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS cats_location_gist_idx
  ON cats USING GIST (location);

CREATE INDEX IF NOT EXISTS cats_created_at_idx
  ON cats (created_at DESC);

CREATE INDEX IF NOT EXISTS cats_created_by_idx
  ON cats (created_by);

CREATE INDEX IF NOT EXISTS cat_photos_cat_id_idx
  ON cat_photos (cat_id);

CREATE INDEX IF NOT EXISTS help_requests_cat_type_created_idx
  ON help_requests (cat_id, type, created_at DESC);

CREATE INDEX IF NOT EXISTS help_requests_created_by_idx
  ON help_requests (created_by);
