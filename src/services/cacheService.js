const Redis = require('ioredis');
const env = require('../config/env');
const logger = require('../config/logger');

let client = null;

function getClient() {
  if (!env.REDIS_URL) {
    return null;
  }
  if (!client) {
    client = new Redis(env.REDIS_URL, { enableOfflineQueue: false });
    client.on('error', function(err) {
      logger.warn('Redis error', { error: err.message });
    });
  }
  return client;
}

async function get(key) {
  const redis = getClient();
  if (!redis) return null;
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    logger.warn('Redis get failed', { error: err.message });
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  const redis = getClient();
  if (!redis) return;
  try {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.set(key, payload, 'EX', ttlSeconds);
    } else {
      await redis.set(key, payload);
    }
  } catch (err) {
    logger.warn('Redis set failed', { error: err.message });
  }
}

async function ping() {
  const redis = getClient();
  if (!redis) return false;
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (err) {
    logger.warn('Redis ping failed', { error: err.message });
    return false;
  }
}

function isReady() {
  return Boolean(env.REDIS_URL);
}

module.exports = {
  get,
  set,
  ping,
  isReady
};
