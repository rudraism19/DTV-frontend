const env = require('./env');
const { S3Client } = require('@aws-sdk/client-s3');

let s3Client = null;

function isS3Enabled() {
  return env.FILE_STORAGE === 's3';
}

function assertS3Config() {
  if (!env.AWS_REGION || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.S3_BUCKET) {
    throw new Error('S3 storage is enabled but AWS configuration is missing.');
  }
}

function getS3Client() {
  if (!isS3Enabled()) {
    return null;
  }
  if (!s3Client) {
    assertS3Config();
    s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
      }
    });
  }
  return s3Client;
}

module.exports = {
  getS3Client,
  isS3Enabled
};
