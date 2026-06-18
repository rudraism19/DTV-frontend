const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { pool } = require('./db');

const backupService = require('./services/backupService');

backupService.startBackupCron();

const server = app.listen(env.PORT, '0.0.0.0', function() {
  logger.info('Digital Twin server running on http://0.0.0.0:' + env.PORT);
});

function shutdown(signal) {
  logger.info('Shutting down server', { signal: signal });
  server.close(function() {
    pool.end().then(function() {
      process.exit(0);
    }).catch(function() {
      process.exit(1);
    });
  });

  setTimeout(function() {
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', function() {
  shutdown('SIGINT');
});
process.on('SIGTERM', function() {
  shutdown('SIGTERM');
});

// ── Crash Protection ─────────────────────────────────────────────────────────
// DO NOT shut down on uncaughtException / unhandledRejection in production.
// Log the error and keep the server alive. Shutting down on every background
// error (cron, email, DB hiccup) is the #1 cause of unexpected downtime.
process.on('uncaughtException', function(err) {
  logger.error('Uncaught exception (server kept alive)', {
    error: err.message,
    stack: err.stack
  });
});
process.on('unhandledRejection', function(reason) {
  logger.error('Unhandled promise rejection (server kept alive)', {
    error: reason && reason.message ? reason.message : String(reason)
  });
});

// ── Keep-Alive ping for Render free tier (spins down after 15 min idle) ──────
if (env.NODE_ENV === 'production' && env.PUBLIC_BASE_URL) {
  const PING_INTERVAL_MS = 10 * 60 * 1000; // every 10 minutes
  setInterval(function() {
    fetch(env.PUBLIC_BASE_URL + '/api/v1/health').catch(function() {
      // Silent — just keeping the dyno warm
    });
  }, PING_INTERVAL_MS);
}
