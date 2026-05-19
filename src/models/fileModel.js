const db = require('../db');

async function create(file) {
  const result = await db.query(
    'INSERT INTO files (user_id, storage_provider, bucket, object_key, url, content_type, size_bytes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [
      file.userId,
      file.storageProvider,
      file.bucket,
      file.objectKey,
      file.url,
      file.contentType || null,
      file.sizeBytes || null
    ]
  );
  return result.rows[0];
}

async function findById(id) {
  const result = await db.query('SELECT * FROM files WHERE id = $1', [id]);
  return result.rows[0] || null;
}

module.exports = {
  create,
  findById
};
