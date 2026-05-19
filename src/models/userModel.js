const db = require('../db');

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    name: row.name,
    avatarUrl: row.avatar_url,
    oauthProvider: row.oauth_provider,
    oauthSubject: row.oauth_subject,
    emailVerified: row.email_verified,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at
  };
}

async function create(user) {
  const result = await db.query(
    'INSERT INTO users (email, password_hash, role, name, avatar_url, oauth_provider, oauth_subject, email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [
      user.email,
      user.passwordHash,
      user.role || 'user',
      user.name || null,
      user.avatarUrl || null,
      user.oauthProvider || null,
      user.oauthSubject || null,
      user.emailVerified || false
    ]
  );
  return mapUser(result.rows[0]);
}

async function findByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return mapUser(result.rows[0]);
}

async function findById(id) {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return mapUser(result.rows[0]);
}

async function findByOAuth(provider, subject) {
  const result = await db.query(
    'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_subject = $2',
    [provider, subject]
  );
  return mapUser(result.rows[0]);
}

async function linkOAuth(userId, provider, subject, avatarUrl, name, emailVerified) {
  const result = await db.query(
    'UPDATE users SET oauth_provider = $1, oauth_subject = $2, avatar_url = COALESCE($3, avatar_url), name = COALESCE($4, name), email_verified = COALESCE($5, email_verified), updated_at = now() WHERE id = $6 RETURNING *',
    [provider, subject, avatarUrl || null, name || null, emailVerified, userId]
  );
  return mapUser(result.rows[0]);
}

async function updateLastLogin(userId) {
  await db.query('UPDATE users SET last_login_at = now(), updated_at = now() WHERE id = $1', [userId]);
}

async function listUsers(options) {
  const search = options.search ? '%' + options.search + '%' : null;
  const limit = options.limit;
  const offset = options.offset;
  const result = await db.query(
    'SELECT id, email, role, name, avatar_url, is_active, created_at, last_login_at, count(*) OVER() AS total FROM users WHERE ($1::text IS NULL OR email ILIKE $1 OR name ILIKE $1) ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [search, limit, offset]
  );

  const total = result.rows[0] ? Number(result.rows[0].total) : 0;
  const users = result.rows.map(function(row) {
    return {
      id: row.id,
      email: row.email,
      role: row.role,
      name: row.name,
      avatarUrl: row.avatar_url,
      isActive: row.is_active,
      createdAt: row.created_at,
      lastLoginAt: row.last_login_at
    };
  });

  return { users: users, total: total };
}

async function updateRole(userId, role) {
  const result = await db.query(
    'UPDATE users SET role = $1, updated_at = now() WHERE id = $2 RETURNING *',
    [role, userId]
  );
  return mapUser(result.rows[0]);
}

module.exports = {
  create,
  findByEmail,
  findById,
  findByOAuth,
  linkOAuth,
  updateLastLogin,
  listUsers,
  updateRole
};
