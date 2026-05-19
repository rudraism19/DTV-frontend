const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');

async function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Missing authorization token.'));
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await userModel.findById(payload.sub);
    if (!user || !user.isActive) {
      return next(new ApiError(401, 'Account is inactive or missing.'));
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
}

function authorize() {
  const roles = Array.prototype.slice.call(arguments);
  return function(req, _res, next) {
    if (!req.user || roles.indexOf(req.user.role) === -1) {
      return next(new ApiError(403, 'Insufficient permissions.'));
    }
    return next();
  };
}

module.exports = {
  authenticate,
  authorize
};
