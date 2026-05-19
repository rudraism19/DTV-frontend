const cacheService = require('../services/cacheService');

function cacheResponse(ttlSeconds) {
  return async function(req, res, next) {
    if (!cacheService.isReady()) {
      return next();
    }

    const key = 'cache:' + (req.user ? req.user.id + ':' : '') + req.originalUrl;
    const cached = await cacheService.get(key);
    if (cached) {
      return res.json(cached);
    }

    const json = res.json.bind(res);
    res.json = function(body) {
      cacheService.set(key, body, ttlSeconds);
      return json(body);
    };

    return next();
  };
}

module.exports = cacheResponse;
