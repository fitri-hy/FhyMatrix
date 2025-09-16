const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const config = require('../config');
const grpcService = require('./services/grpcService');
const jsonParser = require('./middlewares/jsonParser');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const cacheMiddleware = require('./middlewares/cache');

const authService = require('./services/authService');
const userService = require('./services/userService');
const otherService = require('./services/otherService');

const app = express();

app.use(jsonParser);
app.use(logger);

app.use('/auth', authService.router);
app.use('/users', userService.router);
app.use('/other', otherService.router);

app.get(
  '/ping',
  cacheMiddleware(() => 'ping'),
  async (req, res, next) => {
    try {
      const results = await grpcService.callAll('Ping');
      const response = {};
      results.forEach((r) => {
        response[r.name] = r.err ? { error: r.err.message } : r.response;
      });
      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/metrics',
  cacheMiddleware(() => 'metrics'),
  async (req, res, next) => {
    try {
      const results = await grpcService.callAll('Metrics');
      res.set('Content-Type', 'text/plain');
      const metrics = results.map((r) =>
        r.err ? `# ERROR: ${r.name} ${r.err.message}` : r.response.metrics
      );
      res.send(metrics.join('\n'));
    } catch (err) {
      next(err);
    }
  }
);

app.get('/health', async (req, res, next) => {
  try {
    const results = await grpcService.callAll('Health');
    const response = {};
    results.forEach((r) => {
      response[r.name] = r.err
        ? { status: 'error', message: r.err.message }
        : r.response;
    });
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () =>
  console.log(`API Gateway running on port ${PORT}`)
);
