const prisma = require('../models/otherModel');
const promClient = require('prom-client');

// Collect default metrics
promClient.collectDefaultMetrics();

module.exports = {
	
  // gRPC Handlers
  Ping: async (call, callback) => {
    try {
      const ping = await prisma.ping.create({ data: { message: 'pong' } });
      callback(null, {
        id: ping.id,
        message: ping.message,
        createdAt: ping.createdAt.toISOString(),
      });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },

  Metrics: async (call, callback) => {
    try {
      const metrics = await promClient.register.metrics();
      callback(null, { metrics });
    } catch (err) {
      callback({ code: 13, message: err.message });
    }
  },

  Health: async (call, callback) => {
    callback(null, { status: 'ok' });
  },

  // REST Handlers
  pingRest: async (req, res) => {
    try {
      const ping = await prisma.ping.create({ data: { message: 'pong' } });
      res.json({
        id: ping.id,
        message: ping.message,
        createdAt: ping.createdAt.toISOString(),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  metricsRest: async (req, res) => {
    try {
      const metrics = await promClient.register.metrics();
      res.set('Content-Type', promClient.register.contentType);
      res.end(metrics);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  healthRest: async (req, res) => {
    res.json({ status: 'ok' });
  },
};
