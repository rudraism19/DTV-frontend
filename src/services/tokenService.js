const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const env = require('../config/env');
const tokenModel = require('../models/tokenModel');
const userModel = require('../models/userModel');
const ApiError = require('../utils/apiError');

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL
  });
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString('base64url');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getAccessExpiresInSeconds() {
  const ttlMs = ms(env.JWT_ACCESS_TTL);
  return Math.floor(ttlMs / 1000);
}

function getRefreshExpiresAt() {
  const ttlMs = ms(env.JWT_REFRESH_TTL);
  return new Date(Date.now() + ttlMs);
}

async function createAuthTokens(user, meta) {
  const accessToken = signAccessToken(user);
  const refreshToken = generateRefreshToken();
  const refreshHash = hashToken(refreshToken);
  const expiresAt = getRefreshExpiresAt();

  await tokenModel.create({
    userId: user.id,
    tokenHash: refreshHash,
    expiresAt: expiresAt,
    ipAddress: meta.ip,
    userAgent: meta.userAgent
  });

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessExpiresIn: getAccessExpiresInSeconds(),
    refreshExpiresAt: expiresAt
  };
}

async function rotateRefreshToken(refreshToken, meta) {
  const tokenHash = hashToken(refreshToken);
  const record = await tokenModel.findByHash(tokenHash);
  if (!record) {
    throw new ApiError(401, 'Invalid refresh token.');
  }

  if (record.revoked_at || new Date(record.expires_at) < new Date()) {
    throw new ApiError(401, 'Refresh token expired.');
  }

  const user = await userModel.findById(record.user_id);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'Account is inactive or missing.');
  }

  await tokenModel.revoke(record.id);
  const tokens = await createAuthTokens(user, meta);

  return { user: user, tokens: tokens };
}

async function revokeRefreshToken(refreshToken) {
  const tokenHash = hashToken(refreshToken);
  await tokenModel.revokeByHash(tokenHash);
}

module.exports = {
  createAuthTokens,
  rotateRefreshToken,
  revokeRefreshToken,
  getAccessExpiresInSeconds
};
