const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');
const { pool } = require('../db');

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

    // Log audit trail if modifying request
    if (req.method !== 'GET') {
      pool.query(
        'INSERT INTO audit_logs (user_id, action, target_resource, request_payload, ip_address) VALUES ($1, $2, $3, $4, $5)',
        [user.id, `${req.method} ${req.baseUrl}${req.path}`, req.originalUrl, JSON.stringify(req.body), req.ip || '127.0.0.1']
      ).catch(() => {});
    }

    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
}

async function authenticateOptional(req, _res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await userModel.findById(payload.sub);
    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    return next();
  } catch (err) {
    req.user = null;
    return next();
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

function requireVerified(req, res, next) {
  if (!req.user || !req.user.emailVerified) {
    return next(new ApiError(403, 'Email verification required.'));
  }
  return next();
}

async function authorizeParentOfStudent(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized.'));
  }
  
  if (req.user.role === 'admin') {
    return next(); // Admins can access any data
  }

  const studentId = req.params.studentId || req.body.studentId;
  if (!studentId) {
    return next(new ApiError(400, 'Student ID is required to verify parent access.'));
  }

  if (req.user.role === 'student' && req.user.id.toString() === studentId.toString()) {
    return next(); // Student can access their own data
  }

  if (req.user.role === 'parent') {
    const linkedStudents = await userModel.getLinkedStudents(req.user.id);
    const isLinked = linkedStudents.some(s => s.id.toString() === studentId.toString());
    if (isLinked) {
      return next(); // Linked parent can access student data
    }
  }

  return next(new ApiError(403, 'Insufficient permissions to access this student data.'));
}

async function authorizeAdmin(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized.'));
  }
  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin privileges required.'));
  }
  return next();
}

module.exports = {
  authenticate,
  authenticateOptional,
  authorize,
  requireVerified,
  authorizeParentOfStudent,
  authorizeAdmin
};
