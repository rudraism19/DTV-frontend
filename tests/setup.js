const fs = require('fs');
const path = require('path');
const db = require('../src/db');

beforeAll(async function() {
  const filePath = path.join(__dirname, '..', 'migrations', '001_init.sql');
  const sql = fs.readFileSync(filePath, 'utf8');
  await db.pool.query(sql);
});

afterEach(async function() {
  await db.pool.query('TRUNCATE TABLE refresh_tokens, files, users RESTART IDENTITY CASCADE');
});

afterAll(async function() {
  await db.pool.end();
});
