ALTER TABLE users DROP CONSTRAINT users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'user', 'parent', 'student'));

CREATE TABLE IF NOT EXISTS parent_student_link (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS parent_student_link_parent_idx ON parent_student_link(parent_id);
CREATE INDEX IF NOT EXISTS parent_student_link_student_idx ON parent_student_link(student_id);
