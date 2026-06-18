const path = require('path');
const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.ENV_FILE || path.join(process.cwd(), '.env')
});

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  DB_POOL_MAX: Joi.number().default(10),
  DB_IDLE_TIMEOUT_MS: Joi.number().default(10000),
  DB_CONNECTION_TIMEOUT_MS: Joi.number().default(2000),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_TTL: Joi.string().default('15m'),
  JWT_REFRESH_TTL: Joi.string().default('30d'),
  COOKIE_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  CORS_ORIGINS: Joi.string().allow(''),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().default(100),
  AUTH_RATE_LIMIT_MAX: Joi.number().default(20),
  REDIS_URL: Joi.string().allow(''),
  CACHE_TTL_SECONDS: Joi.number().default(30),
  FILE_STORAGE: Joi.string().valid('local', 's3').default('local'),
  UPLOAD_DIR: Joi.string().default('uploads'),
  PUBLIC_BASE_URL: Joi.string().allow(''),
  AWS_REGION: Joi.string().allow(''),
  AWS_ACCESS_KEY_ID: Joi.string().allow(''),
  AWS_SECRET_ACCESS_KEY: Joi.string().allow(''),
  S3_BUCKET: Joi.string().allow(''),
  S3_PUBLIC_BASE_URL: Joi.string().allow(''),
  GOOGLE_CLIENT_ID: Joi.string().allow(''),
  SENTRY_DSN: Joi.string().allow(''),
  ANTHROPIC_API_KEY: Joi.string().allow(''),
  ANTHROPIC_MODEL: Joi.string().allow(''),
  OPENAI_API_KEY: Joi.string().allow(''),
  OPENAI_MODEL: Joi.string().allow(''),
  AI_PROVIDER: Joi.string().lowercase().valid('auto', 'anthropic', 'openai').default('auto'),
  SMTP_USER: Joi.string().allow(''),
  SMTP_PASS: Joi.string().allow(''),
  BREVO_API_KEY: Joi.string().allow(''),
  RAZORPAY_KEY_ID: Joi.string().allow(''),
  RAZORPAY_KEY_SECRET: Joi.string().allow('')
}).unknown();

const result = schema.validate(process.env, { abortEarly: false });
if (result.error) {
  throw new Error('Environment validation error: ' + result.error.message);
}

module.exports = result.value;
