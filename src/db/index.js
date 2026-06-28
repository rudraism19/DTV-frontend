const { Pool } = require('pg');
const env = require('../config/env');
const logger = require('../config/logger');

const isTest = env.NODE_ENV === 'test';
const connectionString = (isTest && env.TEST_DATABASE_URL && env.TEST_DATABASE_URL !== env.DATABASE_URL) ? env.TEST_DATABASE_URL : env.DATABASE_URL;

const isLocalHost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
const sslConfig = (isLocalHost || env.DB_SSL_OFF) ? false : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: connectionString,
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
