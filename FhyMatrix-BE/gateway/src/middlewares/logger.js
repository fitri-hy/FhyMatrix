const morgan = require('morgan');
const config = require('../../config');

module.exports = (req, res, next) => {
  if (!config.loggingEnabled) return next();

  const logger = morgan('combined');
  return logger(req, res, next);
};
