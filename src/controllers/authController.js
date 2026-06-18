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
    lastLoginAt: user.lastLoginAt,
    isPremium: (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date()) || 
               (user.trialExpiresAt && new Date(user.trialExpiresAt) > new Date()) || false
  };
}

function setRefreshCookie(res, token, expiresAt) {
  const secure = env.COOKIE_SECURE || env.NODE_ENV === 'production';
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: secure,
    sameSite: 'strict',
    path: '/api/v1/auth',
    expires: expiresAt
  });
}

function clearRefreshCookie(res) {
  const secure = env.COOKIE_SECURE || env.NODE_ENV === 'production';
  res.clearCookie('refresh_token', {
    path: '/api/v1/auth',
    sameSite: 'strict',
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

const verifyOTP = asyncHandler(async function(req, res) {
  const { otpCode } = req.body;
  if (!otpCode) {
    throw new ApiError(400, 'OTP code is required.');
  }

  // The user must be logged in (have access token) to verify OTP
  const userId = req.user.id;
  const user = await authService.verifyOTP(userId, otpCode);

  res.status(200).json({
    message: 'Email verified successfully.',
    user: sanitizeUser(user)
  });
});

const resendOTP = asyncHandler(async function(req, res) {
  const userId = req.user.id;
  await authService.resendOTP(userId);

  res.status(200).json({
    message: 'Verification code sent to your email.'
  });
});

const forgotPassword = asyncHandler(async function(req, res) {
  const { email } = req.body;
  await authService.forgotPassword(email);

  res.status(200).json({
    message: 'If the email exists, a password reset code has been sent.'
  });
});

const resetPassword = asyncHandler(async function(req, res) {
  const { email, otpCode, newPassword } = req.body;
  await authService.resetPassword(email, otpCode, newPassword);

  res.status(200).json({
    message: 'Password successfully reset.'
  });
});

const smtpDebug = asyncHandler(async function(req, res) {
  const emailService = require('../services/emailService');
  const env = require('../config/env');
  
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    return res.status(500).json({ error: 'SMTP credentials not configured on server', user: env.SMTP_USER });
  }

  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      tls: { rejectUnauthorized: false }
    });
    
    await transporter.verify();
    res.status(200).json({ success: true, message: 'SMTP connection successful' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

module.exports = {
  signup,
  login,
  loginWithGoogle,
  refresh,
  logout,
  me,
  verifyOTP,
  resendOTP,
  smtpDebug,
  forgotPassword,
  resetPassword
};
