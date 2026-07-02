function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, 'x-on=')
      .replace(/<(iframe|object|embed|applet|svg|math)\b/gi, '<x-$1')
      .replace(/data:text\/html/gi, 'data:text/plain')
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

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }

  return next();
}

module.exports = sanitizeInput;
