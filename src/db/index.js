const { Pool } = require('pg');
const env = require('../config/env');
const logger = require('../config/logger');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT_MS
});

pool.on('error', function(err) {
  logger.error('Unexpected database error', { error: err.message });
});

async function query(text, params) {
  return pool.query(text, params);
}

async function ping() {
  await pool.query('SELECT 1');
}

module.exports = {
  pool,
  query,
  ping
};
