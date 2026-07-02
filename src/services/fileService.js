const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const env = require('../config/env');
const { getS3Client, isS3Enabled } = require('../config/storage');
const fileModel = require('../models/fileModel');

function buildObjectKey(userId, filename) {
  let ext = path.extname(filename || '').toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt', '.webp'];
  let isSafeExt = allowedExts.includes(ext);
  if (!isSafeExt) {
    ext = '.bin'; // Neutralize arbitrary executable extensions to prevent Remote Code Execution
  }
  return { key: 'users/' + userId + '/' + crypto.randomUUID() + ext, isSafeExt };
}

function buildPublicUrl(key) {
  if (env.S3_PUBLIC_BASE_URL) {
    return env.S3_PUBLIC_BASE_URL.replace(/\/$/, '') + '/' + key;
  }
  if (env.PUBLIC_BASE_URL) {
    return env.PUBLIC_BASE_URL.replace(/\/$/, '') + '/' + key;
  }
  return '/' + key;
}

async function storeLocal(file, userId) {
  const { key: relativeKey } = buildObjectKey(userId, file.originalname);
  const targetPath = path.join(process.cwd(), env.UPLOAD_DIR, relativeKey);
  const targetDir = path.dirname(targetPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(targetPath, file.buffer);
  return {
    storageProvider: 'local',
    bucket: null,
    objectKey: relativeKey,
    url: buildPublicUrl(path.join(env.UPLOAD_DIR, relativeKey).replace(/\\/g, '/'))
  };
}

async function storeS3(file, userId) {
  const client = getS3Client();
  const { key: objectKey, isSafeExt } = buildObjectKey(userId, file.originalname);
  
  // Prevent Stored XSS by forcing application/octet-stream if extension was neutralized
  const safeMimeType = isSafeExt ? file.mimetype : 'application/octet-stream';

  await client.send(new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: objectKey,
    Body: file.buffer,
    ContentType: safeMimeType
  }));

  return {
    storageProvider: 's3',
    bucket: env.S3_BUCKET,
    objectKey: objectKey,
    url: env.S3_PUBLIC_BASE_URL
      ? env.S3_PUBLIC_BASE_URL.replace(/\/$/, '') + '/' + objectKey
      : 'https://' + env.S3_BUCKET + '.s3.' + env.AWS_REGION + '.amazonaws.com/' + objectKey
  };
}

async function uploadFile(file, user) {
  if (!file) {
    throw new Error('File payload missing.');
  }

  let stored = null;
  if (isS3Enabled()) {
    stored = await storeS3(file, user.id);
  } else {
    stored = await storeLocal(file, user.id);
  }

  const record = await fileModel.create({
    userId: user.id,
    storageProvider: stored.storageProvider,
    bucket: stored.bucket,
    objectKey: stored.objectKey,
    url: stored.url,
    contentType: file.mimetype,
    sizeBytes: file.size
  });

  return {
    id: record.id,
    url: record.url,
    contentType: record.content_type,
    sizeBytes: record.size_bytes,
    createdAt: record.created_at
  };
}

module.exports = {
  uploadFile
};
