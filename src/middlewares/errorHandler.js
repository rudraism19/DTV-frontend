const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

function notFound(_req, _res, next) {
  next(new ApiError(404, 'Route not found.'));
}

function errorHandler(err, req, res, _next) {
  const status = err.statusCode || err.status || (err.type === 'entity.parse.failed' ? 400 : 500);
  const message = status === 500 ? 'Internal server error.' : err.message;

  if (status >= 500) {
    logger.error('Request failed', { error: err.message, requestId: req.id });
  } else {
    logger.warn('Request error', { error: err.message, requestId: req.id });
  }

  res.status(status).json({
    error: message,
    details: err.details || null,
    requestId: req.id
  });
}

module.exports = {
  notFound,
  errorHandler
};
