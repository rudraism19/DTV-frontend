const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());
app.use(helmet({ contentSecurityPolicy: false }));

const corsOrigins = env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',').map(function(origin) {
  return origin.trim();
}).filter(Boolean) : [];
const corsOrigin = corsOrigins.length === 0
  ? true
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

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', aiRoutes);
app.use('/api/v1', routes);

app.use('/api', function(_req, res) {
  res.status(404).json({ error: 'API route not found.' });
});

const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir, {
  maxAge: '7d',
  etag: true,
  index: 'index.html'
}));

app.use(function(req, res, next) {
  if (req.path.startsWith('/api')) {
    return next();
  }
  return res.sendFile(path.join(publicDir, 'index.html'));
});

if (env.SENTRY_DSN && Sentry.Handlers && Sentry.Handlers.errorHandler) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
