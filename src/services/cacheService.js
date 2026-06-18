const Redis = require('ioredis');
const env = require('../config/env');
const logger = require('../config/logger');

let client = null;
let redisReady = false;

function getClient() {
  if (!env.REDIS_URL) {
    return null;
  }
  if (!client) {
    client = new Redis(env.REDIS_URL, {
      enableOfflineQueue: false,
      lazyConnect: true,
      maxRetriesPerRequest: 0,
      retryStrategy: function(times) {
        // After 3 failed attempts, stop retrying — cache disabled silently
        if (times > 3) return null;
        return Math.min(times * 500, 2000);
      }
    });
    client.on('ready', function() {
      redisReady = true;
      logger.info('Redis connected');
    });
    client.on('close', function() {
      redisReady = false;
    });
    client.on('error', function(err) {
      if (redisReady) {
        // Only log if we were previously connected (real disconnect)
        logger.warn('Redis disconnected', { error: err.message });
      }
      redisReady = false;
    });

    // Attempt connection once at startup; if it fails, cache is just disabled
    client.connect().catch(function() {
      // Silent — cache unavailable, app continues without it
    });
  }
  return client;
}

// Initialize on module load
getClient();

async function get(key) {
  if (!redisReady) return null;
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  if (!redisReady) return;
  try {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
      await client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await client.set(key, payload);
    }
  } catch (err) {
    // Silent — cache miss is acceptable
  }
}

async function ping() {
  if (!redisReady) return false;
  try {
    const result = await client.ping();
    return result === 'PONG';
  } catch (err) {
    return false;
  }
}

function isReady() {
  return redisReady;
}

async function quit() {
  if (client) {
    try {
      if (client.status === 'ready' || client.status === 'connect') {
        await client.quit();
      } else {
        client.disconnect();
      }
    } catch (err) {}
  }
}

module.exports = {
  get,
  set,
  ping,
  isReady,
  quit
};
