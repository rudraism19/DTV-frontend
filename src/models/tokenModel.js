const db = require('../db');

async function create(token) {
  const result = await db.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [token.userId, token.tokenHash, token.expiresAt, token.ipAddress || null, token.userAgent || null]
  );
  return result.rows[0];
}

async function findByHash(tokenHash) {
  const result = await db.query('SELECT * FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
  return result.rows[0] || null;
}

async function revoke(tokenId) {
  await db.query('UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1', [tokenId]);
}

async function revokeByHash(tokenHash) {
  await db.query('UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1', [tokenHash]);
}

module.exports = {
  create,
  findByHash,
  revoke,
  revokeByHash
};
