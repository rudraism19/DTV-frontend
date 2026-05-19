const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const env = require('../src/config/env');
const logger = require('../src/config/logger');

async function run() {
  const client = new Client({ connectionString: env.DATABASE_URL });
  await client.connect();

  const filePath = path.join(__dirname, '..', 'migrations', '001_init.sql');
  const sql = fs.readFileSync(filePath, 'utf8');
  await client.query(sql);

  await client.end();
  logger.info('Database migrations applied.');
}

run().catch(function(err) {
  logger.error('Migration failed', { error: err.message || String(err), stack: err.stack });
  console.error(err);
  process.exit(1);
});
