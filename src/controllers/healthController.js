const asyncHandler = require('../utils/asyncHandler');
const db = require('../db');
const cacheService = require('../services/cacheService');
const aiService = require('../services/aiService');

const health = asyncHandler(async function(_req, res) {
  let dbOk = true;
  let redisOk = true;

  try {
    await db.ping();
  } catch (_err) {
    dbOk = false;
  }

  if (cacheService.isReady()) {
    redisOk = await cacheService.ping();
  }

  const provider = aiService.resolveProvider();

  res.json({
    ok: dbOk,
    service: 'digital-twin-api',
    database: dbOk ? 'up' : 'down',
    redis: cacheService.isReady() ? (redisOk ? 'up' : 'down') : 'disabled',
    aiConfigured: !provider.error,
    provider: provider.provider || null,
    timestamp: new Date().toISOString()
  });
});

module.exports = {
  health
};
