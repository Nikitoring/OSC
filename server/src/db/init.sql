CREATE TABLE cats (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  name VARCHAR(255) NOT NULL,

  gender TEXT NOT NULL
    CHECK (gender IN ('male', 'female', 'unknown')),

  location GEOGRAPHY(Point, 4326),

  created_at TIMESTAMPTZ NOT NULL,

  created_by BIGINT NOT NULL,

  description TEXT
);
