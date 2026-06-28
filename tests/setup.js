const fs = require('fs');
const path = require('path');
const db = require('../src/db');

jest.setTimeout(60000);

beforeAll(async function() {
  const filePath = path.join(__dirname, '..', 'migrations', '001_init.sql');
  const sql = fs.readFileSync(filePath, 'utf8');
  await db.pool.query(sql);
}, 60000);

afterEach(async function() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('ep-sparkling-mode-apvo7mhj')) {
    console.warn('SAFETY LOCK: Skipping TRUNCATE on production Neon database!');
    return;
  }
  await db.pool.query('TRUNCATE TABLE refresh_tokens, files, users RESTART IDENTITY CASCADE');
}, 60000);

afterAll(async function() {
  await db.pool.end();
}, 60000);
