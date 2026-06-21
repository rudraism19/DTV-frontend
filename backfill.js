require('dotenv').config();
const db = require('./src/db');
const crypto = require('crypto');

async function run() {
  try {
    const res = await db.query("SELECT id, link_code FROM users WHERE role = 'user' OR link_code IS NULL");
    let c = 0;
    for (let r of res.rows) {
      const code = r.link_code || crypto.randomBytes(3).toString('hex').toUpperCase();
      await db.query("UPDATE users SET link_code = $1, role = 'student' WHERE id = $2", [code, r.id]);
      c++;
    }
    console.log('Updated ' + c + ' students');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
