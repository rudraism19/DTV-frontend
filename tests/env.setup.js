require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || '3001';
process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/digital_twin_test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.JWT_ACCESS_TTL = process.env.JWT_ACCESS_TTL || '15m';
process.env.JWT_REFRESH_TTL = process.env.JWT_REFRESH_TTL || '30d';
process.env.COOKIE_SECURE = 'false';
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:3000';
process.env.FILE_STORAGE = process.env.FILE_STORAGE || 'local';
process.env.UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
process.env.PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || '1000';
process.env.AUTH_RATE_LIMIT_MAX = process.env.AUTH_RATE_LIMIT_MAX || '1000';
