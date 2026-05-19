const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const env = require('../config/env');

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  };
}

function setRefreshCookie(res, token, expiresAt) {
  const secure = env.COOKIE_SECURE || env.NODE_ENV === 'production';
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: secure,
    sameSite: 'lax',
    path: '/api/v1/auth',
    expires: expiresAt
  });
}

function clearRefreshCookie(res) {
  const secure = env.COOKIE_SECURE || env.NODE_ENV === 'production';
  res.clearCookie('refresh_token', {
    path: '/api/v1/auth',
    sameSite: 'lax',
    secure: secure
  });
}

function getMeta(req) {
  return {
    ip: req.ip,
    userAgent: req.headers['user-agent'] || null
  };
}

const signup = asyncHandler(async function(req, res) {
  const user = await authService.signup(req.body);
  const tokens = await tokenService.createAuthTokens(user, getMeta(req));
  setRefreshCookie(res, tokens.refreshToken, tokens.refreshExpiresAt);

  res.status(201).json({
    user: sanitizeUser(user),
    accessToken: tokens.accessToken,
    expiresIn: tokens.accessExpiresIn
  });
});

const login = asyncHandler(async function(req, res) {
  const user = await authService.login(req.body);
  const tokens = await tokenService.createAuthTokens(user, getMeta(req));
  setRefreshCookie(res, tokens.refreshToken, tokens.refreshExpiresAt);

  res.json({
    user: sanitizeUser(user),
    accessToken: tokens.accessToken,
    expiresIn: tokens.accessExpiresIn
  });
});

const loginWithGoogle = asyncHandler(async function(req, res) {
  const idToken = req.body.idToken;
  if (!idToken) {
    throw new ApiError(400, 'Google ID token is required.');
  }

  const user = await authService.loginWithGoogle(idToken);
  const tokens = await tokenService.createAuthTokens(user, getMeta(req));
  setRefreshCookie(res, tokens.refreshToken, tokens.refreshExpiresAt);

  res.json({
    user: sanitizeUser(user),
    accessToken: tokens.accessToken,
    expiresIn: tokens.accessExpiresIn
  });
});

const refresh = asyncHandler(async function(req, res) {
  const refreshToken = req.cookies.refresh_token || (req.body ? req.body.refreshToken : null);
  if (!refreshToken) {
    throw new ApiError(401, 'Missing refresh token.');
  }

  const result = await tokenService.rotateRefreshToken(refreshToken, getMeta(req));
  setRefreshCookie(res, result.tokens.refreshToken, result.tokens.refreshExpiresAt);

  res.json({
    user: sanitizeUser(result.user),
    accessToken: result.tokens.accessToken,
    expiresIn: result.tokens.accessExpiresIn
  });
});

const logout = asyncHandler(async function(req, res) {
  const refreshToken = req.cookies.refresh_token || (req.body ? req.body.refreshToken : null);
  if (refreshToken) {
    await tokenService.revokeRefreshToken(refreshToken);
  }
  clearRefreshCookie(res);
  res.status(200).json({ ok: true });
});

const me = asyncHandler(async function(req, res) {
  res.json({ user: sanitizeUser(req.user) });
});

module.exports = {
  signup,
  login,
  loginWithGoogle,
  refresh,
  logout,
  me
};
