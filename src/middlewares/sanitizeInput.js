function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(function(item) {
      return sanitizeValue(item);
    });
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce(function(acc, key) {
      acc[key] = sanitizeValue(value[key]);
      return acc;
    }, {});
  }

  return value;
}

function sanitizeInput(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  return next();
}

module.exports = sanitizeInput;
