const env = require('../src/config/env');
const logger = require('../src/config/logger');
const db = require('../src/db');
const userModel = require('../src/models/userModel');
const { hashPassword } = require('../src/utils/password');

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const existing = await userModel.findByEmail(normalizedEmail);

  if (existing) {
    await db.query(
      'UPDATE users SET password_hash = $1, role = $2, updated_at = now() WHERE id = $3',
      [passwordHash, 'admin', existing.id]
    );
    logger.info('Admin user updated: ' + normalizedEmail);
  } else {
    await userModel.create({
      email: normalizedEmail,
      passwordHash: passwordHash,
      role: 'admin',
      name: 'Admin'
    });
    logger.info('Admin user created: ' + normalizedEmail);
  }

  await db.pool.end();
}

run().catch(function(err) {
  logger.error('Admin seed failed', { error: err.message });
  process.exit(1);
});
