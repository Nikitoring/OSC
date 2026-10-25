
-- Apply manually to an existing development database after taking a backup.
-- Unlike database/init.sql, this migration is intended for an existing DB.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cats
  ADD COLUMN IF NOT EXISTS description TEXT;

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

-- Add the cats -> users foreign key only when existing data is consistent.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'cats_created_by_fkey'
      AND conrelid = 'cats'::regclass
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM cats c
      LEFT JOIN users u ON u.id = c.created_by
      WHERE u.id IS NULL
    ) THEN
      RAISE NOTICE
        'Skipped cats_created_by_fkey: cats contain created_by values without matching users';
    ELSE
      ALTER TABLE cats
        ADD CONSTRAINT cats_created_by_fkey
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT;
    END IF;
  END IF;
END $$;
