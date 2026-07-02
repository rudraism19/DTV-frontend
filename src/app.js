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
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(hpp()); // Protect against HTTP Parameter Pollution
app.use(cookieParser());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "'unsafe-eval'", 
        "https://www.googletagmanager.com", 
        "https://checkout.razorpay.com", 
        "https://cdnjs.cloudflare.com"
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://www.google-analytics.com", "https://*.razorpay.com", "https://razorpay.com"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://*.analytics.google.com", "https://*.razorpay.com", "wss:"],
      frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      mediaSrc: ["'self'", "data:", "blob:"]
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

app.use(function(req, res, next) {
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(cors({
  origin: true,
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
const parentUiDir = path.join(__dirname, '..', 'parent-ui', 'dist');

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

// Serve parent portal static files with strict caching headers
app.use('/parent', express.static(parentUiDir, {
  setHeaders: (res, filePath) => {
    if (filePath.includes('/assets/') || filePath.match(/\.[0-9a-zA-Z]+\.(js|css)$/)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (filePath.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    } else {
      res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// Auto-healing middleware for cached asset requests in Parent Portal
app.use('/parent/assets', function(req, res, next) {
  const fs = require('fs');
  const assetPath = path.join(parentUiDir, 'assets', req.path);
  if (fs.existsSync(assetPath)) {
    return res.sendFile(assetPath);
  }
  // If exact hashed file doesn't exist (e.g., cached index.html requesting old hash),
  // find the latest .js or .css file in parent-ui/dist/assets and serve it!
  try {
    const assetsDir = path.join(parentUiDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      const ext = path.extname(req.path); // .js or .css
      const latestAsset = files.find(f => f.endsWith(ext));
      if (latestAsset) {
        console.log(`Auto-healing asset request: ${req.path} -> serving latest ${latestAsset}`);
        if (ext === '.js') res.setHeader('Content-Type', 'application/javascript');
        if (ext === '.css') res.setHeader('Content-Type', 'text/css');
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        return res.sendFile(path.join(assetsDir, latestAsset));
      }
    }
  } catch (err) {
    console.error('Auto-healing asset error:', err);
  }
  res.status(404).send('Asset not found');
});

app.use(function(req, res, next) {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');

  if (req.path.startsWith('/parent')) {
    console.log('Serving SPA fallback for Parent Portal.');
    return res.sendFile('index.html', { root: parentUiDir }, (err) => {
      if (err) {
        console.error('sendFile error for Parent SPA:', err);
        next(err);
      }
    });
  }

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
