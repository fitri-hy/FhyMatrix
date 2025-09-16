const NodeCache = require('node-cache');
const config = require('../../config');

const cache = new NodeCache({ stdTTL: config.cacheTTL });

module.exports = (keyFn) => (req, res, next) => {
  if (!config.cacheEnabled) return next();

  const key = keyFn(req);
  const cached = cache.get(key);

  if (cached) {
    return res.json(cached);
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };

  next();
};
