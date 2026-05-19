const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { pool } = require('./db');

const server = app.listen(env.PORT, function() {
  logger.info('Digital Twin server running on http://localhost:' + env.PORT);
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
process.on('uncaughtException', function(err) {
  logger.error('Uncaught exception', { error: err.message });
  shutdown('uncaughtException');
});
process.on('unhandledRejection', function(err) {
  logger.error('Unhandled rejection', { error: err && err.message ? err.message : 'Unknown' });
  shutdown('unhandledRejection');
});
