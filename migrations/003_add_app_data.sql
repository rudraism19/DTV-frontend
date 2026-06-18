ALTER TABLE users ADD COLUMN IF NOT EXISTS app_data jsonb DEFAULT '{}'::jsonb;
