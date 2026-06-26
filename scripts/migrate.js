const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const env = require('../src/config/env');
const logger = require('../src/config/logger');

async function run() {
  const isLocal = !env.DATABASE_URL || env.DATABASE_URL.includes('localhost') || env.DATABASE_URL.includes('127.0.0.1');
  const clientConfig = { connectionString: env.DATABASE_URL };
  if (!isLocal && env.DB_SSL_OFF !== 'true') {
    clientConfig.ssl = { rejectUnauthorized: false };
  }
  const client = new Client(clientConfig);
  await client.connect();

  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    await client.query(sql);
    logger.info(`Applied migration: ${file}`);
  }

  await client.end();
  logger.info('Database migrations applied successfully.');
}

run().catch(function(err) {
  logger.error('Migration failed', { error: err.message || String(err), stack: err.stack });
  console.error(err);
  process.exit(1);
});
