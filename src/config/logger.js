const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const env = require('./env');

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(function(info) {
    const meta = Object.assign({}, info);
    delete meta.level;
    delete meta.message;
    delete meta.timestamp;
    const metaString = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
    return info.timestamp + ' ' + info.level + ': ' + info.message + metaString;
  })
);

const jsonFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: env.NODE_ENV === 'production' ? jsonFormat : consoleFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  }
};

module.exports = logger;
