-- migrations/002_add_phone_to_users.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
