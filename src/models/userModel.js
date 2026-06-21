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
    linkCode: row.link_code,
    otpCode: row.otp_code,
    otpExpiresAt: row.otp_expires_at,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
    trialExpiresAt: row.trial_expires_at,
    subscriptionExpiresAt: row.subscription_expires_at
  };
}

async function create(user) {
  let linkCode = user.linkCode || null;
  if (user.role === 'student' && !linkCode) {
    const crypto = require('crypto');
    linkCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
  }

  const result = await db.query(
    'INSERT INTO users (email, password_hash, role, name, avatar_url, oauth_provider, oauth_subject, email_verified, link_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [
      user.email,
      user.passwordHash,
      user.role || 'user',
      user.name || null,
      user.avatarUrl || null,
      user.oauthProvider || null,
      user.oauthSubject || null,
      user.emailVerified || false,
      linkCode
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

async function findByLinkCode(linkCode) {
  const result = await db.query('SELECT * FROM users WHERE link_code = $1', [linkCode]);
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
    'SELECT id, email, role, name, avatar_url, is_active, created_at, last_login_at, count(*) OVER() AS total FROM users WHERE ($1::text IS NULL OR email ILIKE $1 OR name ILIKE $1) ORDER BY created_at DESC, id ASC LIMIT $2 OFFSET $3',
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

async function verifyEmail(id) {
  const result = await db.query(
    'UPDATE users SET email_verified = true, updated_at = now() WHERE id = $1 RETURNING *',
    [id]
  );
  return mapUser(result.rows[0]);
}

async function setOTP(id, otpCode, expiresAt) {
  const result = await db.query(
    'UPDATE users SET otp_code = $1, otp_expires_at = $2, updated_at = now() WHERE id = $3 RETURNING *',
    [otpCode, expiresAt, id]
  );
  return mapUser(result.rows[0]);
}

async function clearOTP(id) {
  const result = await db.query(
    'UPDATE users SET otp_code = null, otp_expires_at = null, updated_at = now() WHERE id = $1 RETURNING *',
    [id]
  );
  return mapUser(result.rows[0]);
}

async function updatePassword(id, passwordHash) {
  const result = await db.query(
    'UPDATE users SET password_hash = $1, otp_code = null, otp_expires_at = null, updated_at = now() WHERE id = $2 RETURNING *',
    [passwordHash, id]
  );
  return mapUser(result.rows[0]);
}

async function updateActiveStatus(id, isActive) {
  const result = await db.query(
    'UPDATE users SET is_active = $1, updated_at = now() WHERE id = $2 RETURNING *',
    [isActive, id]
  );
  return mapUser(result.rows[0]);
}

async function linkParentStudent(parentId, studentId) {
  const result = await db.query(
    'INSERT INTO parent_student_link (parent_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
    [parentId, studentId]
  );
  return result.rows[0];
}

async function getLinkedStudents(parentId) {
  const result = await db.query(
    'SELECT u.* FROM users u JOIN parent_student_link psl ON u.id = psl.student_id WHERE psl.parent_id = $1',
    [parentId]
  );
  return result.rows.map(mapUser);
}

async function getLinkedParents(studentId) {
  const result = await db.query(
    'SELECT u.* FROM users u JOIN parent_student_link psl ON u.id = psl.parent_id WHERE psl.student_id = $1',
    [studentId]
  );
  return result.rows.map(mapUser);
}

async function getAppData(userId) {
  const result = await db.query('SELECT app_data FROM users WHERE id = $1', [userId]);
  return result.rows[0]?.app_data || {};
}

async function saveAppData(userId, appData) {
  const result = await db.query(
    'UPDATE users SET app_data = $1, updated_at = now() WHERE id = $2 RETURNING app_data',
    [JSON.stringify(appData), userId]
  );
  return result.rows[0].app_data;
}

module.exports = {
  create,
  findByEmail,
  findById,
  findByOAuth,
  linkOAuth,
  updateLastLogin,
  listUsers,
  updateRole,
  verifyEmail,
  setOTP,
  clearOTP,
  updatePassword,
  updateActiveStatus,
  linkParentStudent,
  getLinkedStudents,
  getLinkedParents,
  getAppData,
  saveAppData,
  findByLinkCode
};
