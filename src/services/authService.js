const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const { hashPassword, comparePassword } = require('../utils/password');
const userModel = require('../models/userModel');

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function signup(payload) {
  const email = normalizeEmail(payload.email);
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new ApiError(409, 'Email already in use.');
  }

  const passwordHash = await hashPassword(payload.password);
  const user = await userModel.create({
    email: email,
    passwordHash: passwordHash,
    name: payload.name || null,
    role: 'user'
  });

  return user;
}

async function login(payload) {
  const email = normalizeEmail(payload.email);
  const user = await userModel.findByEmail(email);
  if (!user || !user.passwordHash) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is inactive.');
  }

  const matches = await comparePassword(payload.password, user.passwordHash);
  if (!matches) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  await userModel.updateLastLogin(user.id);
  return user;
}

async function loginWithGoogle(idToken) {
  if (!googleClient) {
    throw new ApiError(400, 'Google login is not configured.');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: idToken,
    audience: env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email) {
    throw new ApiError(401, 'Invalid Google token.');
  }

  const email = normalizeEmail(payload.email);
  const subject = payload.sub;

  let user = await userModel.findByOAuth('google', subject);
  if (!user) {
    const byEmail = await userModel.findByEmail(email);
    if (byEmail) {
      user = await userModel.linkOAuth(byEmail.id, 'google', subject, payload.picture, payload.name, payload.email_verified);
    } else {
      user = await userModel.create({
        email: email,
        name: payload.name || null,
        avatarUrl: payload.picture || null,
        role: 'user',
        oauthProvider: 'google',
        oauthSubject: subject,
        emailVerified: payload.email_verified || false
      });
    }
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is inactive.');
  }

  await userModel.updateLastLogin(user.id);
  return user;
}

module.exports = {
  signup,
  login,
  loginWithGoogle
};
