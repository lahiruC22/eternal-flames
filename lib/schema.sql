-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  passcode_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date VARCHAR(100) NOT NULL,
  caption TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_focus_x REAL CHECK (image_focus_x >= 0 AND image_focus_x <= 1),
  image_focus_y REAL CHECK (image_focus_y >= 0 AND image_focus_y <= 1),
  image_aspect_ratio REAL CHECK (image_aspect_ratio > 0 AND image_aspect_ratio <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Existing DBs: add focus columns (0..1 inclusive)
-- ALTER TABLE memories
--   ADD COLUMN IF NOT EXISTS image_focus_x REAL
--     CHECK (image_focus_x >= 0 AND image_focus_x <= 1),
--   ADD COLUMN IF NOT EXISTS image_focus_y REAL
--     CHECK (image_focus_y >= 0 AND image_focus_y <= 1);

-- Existing DBs: add aspect ratio column
-- ALTER TABLE memories
--   ADD COLUMN IF NOT EXISTS image_aspect_ratio REAL
--     CHECK (image_aspect_ratio > 0 AND image_aspect_ratio <= 5);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);

