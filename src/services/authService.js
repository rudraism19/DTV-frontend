const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const { hashPassword, comparePassword } = require('../utils/password');
const userModel = require('../models/userModel');
const emailService = require('./emailService');
const crypto = require('crypto');

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isFakeEmail(email) {
  const blockedTerms = ['@example.com', 'test_', 'tempmail', '10minutemail', 'mailinator', 'yopmail', 'guerrillamail'];
  return blockedTerms.some(term => email.includes(term));
}

async function signup(payload) {
  const email = normalizeEmail(payload.email);
  if (isFakeEmail(email)) {
    throw new ApiError(403, 'Unauthorized: Test or temporary emails are not allowed.');
  }
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

  // Generate 6-digit OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await userModel.setOTP(user.id, otpCode, expiresAt);
  
  // Fire and forget email sending to avoid blocking signup
  emailService.sendVerificationEmail(user.email, otpCode).catch(err => console.error('Signup email err:', err));

  return user;
}

async function verifyOTP(userId, otpCode) {
  const user = await userModel.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  if (user.emailVerified) return user;

  if (!user.otpCode || user.otpCode !== otpCode) {
    throw new ApiError(400, 'Invalid verification code.');
  }

  if (new Date() > new Date(user.otpExpiresAt)) {
    throw new ApiError(400, 'Verification code has expired. Please request a new one.');
  }

  await userModel.verifyEmail(user.id);
  await userModel.clearOTP(user.id);
  
  return await userModel.findById(user.id);
}

async function resendOTP(userId) {
  const user = await userModel.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  if (user.emailVerified) throw new ApiError(400, 'Email is already verified.');

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await userModel.setOTP(user.id, otpCode, expiresAt);
  
  // Fire and forget
  emailService.sendVerificationEmail(user.email, otpCode).catch(err => console.error('Resend email err:', err));
}

async function login(payload) {
  const email = normalizeEmail(payload.email);
  if (isFakeEmail(email)) {
    throw new ApiError(403, 'Unauthorized: Test or temporary emails are not allowed.');
  }
  const user = await userModel.findByEmail(email);
  if (!user || !user.passwordHash) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Blocked User: This account has been disabled by the admin.');
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
    throw new ApiError(403, 'Blocked User: This account has been disabled by the admin.');
  }

  await userModel.updateLastLogin(user.id);
  return user;
}

async function forgotPassword(rawEmail) {
  const email = normalizeEmail(rawEmail);
  if (isFakeEmail(email)) {
    throw new ApiError(403, 'Unauthorized: Test or temporary emails are not allowed.');
  }
  const user = await userModel.findByEmail(email);
  if (!user) {
    // Silently return to prevent user enumeration
    return;
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await userModel.setOTP(user.id, otpCode, expiresAt);
  
  // Fire and forget email sending
  emailService.sendPasswordResetEmail(user.email, otpCode).catch(err => console.error('Reset email err:', err));
}

async function resetPassword(email, otpCode, newPassword) {
  const user = await userModel.findByEmail(normalizeEmail(email));
  if (!user) {
    throw new ApiError(400, 'Invalid request.');
  }

  if (user.otpCode !== otpCode) {
    throw new ApiError(400, 'Invalid or expired OTP.');
  }

  if (new Date() > new Date(user.otpExpiresAt)) {
    throw new ApiError(400, 'OTP has expired.');
  }

  const passwordHash = await hashPassword(newPassword);
  await userModel.updatePassword(user.id, passwordHash);
  await userModel.clearOTP(user.id);
}

module.exports = {
  signup,
  login,
  loginWithGoogle,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword
};
