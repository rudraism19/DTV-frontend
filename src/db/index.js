const { Pool } = require('pg');
const env = require('../config/env');
const logger = require('../config/logger');

const isLocalHost = env.DATABASE_URL.includes('localhost') || env.DATABASE_URL.includes('127.0.0.1');
const sslConfig = (isLocalHost || env.DB_SSL_OFF) ? false : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT_MS,
  ssl: sslConfig
});

pool.on('error', function(err) {
  logger.error('Unexpected database pool error (auto-reconnecting)', { error: err.message, stack: err.stack });
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
