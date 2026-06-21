const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const Sentry = require('@sentry/node');
const env = require('./config/env');
const logger = require('./config/logger');
const swaggerSpec = require('./config/swagger');
const requestId = require('./middlewares/requestId');
const sanitizeInput = require('./middlewares/sanitizeInput');
const { generalLimiter } = require('./middlewares/rateLimiter');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const parentRoutes = require('./routes/parentRoutes');
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 0.1
  });
  if (Sentry.Handlers && Sentry.Handlers.requestHandler) {
    app.use(Sentry.Handlers.requestHandler());
  }
}

app.use(requestId);
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(hpp()); // Protect against HTTP Parameter Pollution
app.use(cookieParser());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        "https://www.googletagmanager.com"
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
        "https://fonts.googleapis.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://images.unsplash.com",
        "https://digital-twin-app.onrender.com",
        "https://www.googletagmanager.com"
      ],
      connectSrc: [
        "'self'",
        "https://digital-twin-app.onrender.com",
        "https://formspree.io",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://api.razorpay.com"
      ]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
const corsOrigins = env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',').map(function(origin) {
  return origin.trim();
}).filter(Boolean) : [];
const corsOrigin = corsOrigins.length === 0
  ? false // STRICT SECURITY: Do not fallback to true (allow all) if missing
  : (corsOrigins.indexOf('*') !== -1 ? '*' : corsOrigins);

app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(compression());
app.use(sanitizeInput);
app.use(generalLimiter);

if (env.FILE_STORAGE === 'local') {
  app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));
}

// Lightweight ping endpoint for external cron jobs to prevent "output too large" errors
app.get('/ping', function(req, res) {
  // CRITICAL: Prevent Render CDN/Edge from caching this response, which would let the server sleep
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.status(200).send('OK');
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', aiRoutes);
app.use('/api/v1/parent', parentRoutes);
app.use('/api/v1', routes);

// Simple admin dashboard to browse DB
app.use('/dashboard', dashboardRoutes);

const publicDir = path.join(__dirname, '..', 'public');

app.get('/api/version', (req, res) => {
  try {
    const versionPath = path.join(__dirname, '..', 'build-version.json');
    if (require('fs').existsSync(versionPath)) {
      const versionData = require(versionPath);
      return res.json({ version: versionData.version });
    }
  } catch (e) {}
  res.json({ version: 'dev' });
});

app.use('/api', function(_req, res) {
  res.status(404).json({ error: 'API route not found.' });
});

app.use(express.static(publicDir, {
  index: false, // Handle index.html manually for strict caching
  setHeaders: (res, filePath) => {
    if (filePath.includes('/dist/') || filePath.match(/\.[0-9a-f]{8}\.(js|css)$/)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

app.use(function(req, res, next) {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  console.log('Serving SPA fallback for root.');
  res.sendFile('index.html', { root: publicDir }, (err) => {
    if (err) {
      console.error('sendFile error for SPA:', err);
      next(err);
    }
  });
});

if (env.SENTRY_DSN && Sentry.Handlers && Sentry.Handlers.errorHandler) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
