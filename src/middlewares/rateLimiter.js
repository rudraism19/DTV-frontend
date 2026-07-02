const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please retry later.' }
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Strictly 15 requests per 15 minutes per IP to prevent billing abuse
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'SECURITY ALERT: Too many AI requests. Please try again later.' }
});

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter
};
