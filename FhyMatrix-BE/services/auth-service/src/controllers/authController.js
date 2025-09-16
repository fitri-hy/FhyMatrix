const grpc = require('@grpc/grpc-js');
const jwt = require('jsonwebtoken');
const prisma = require('../models/authModel');
const config = require('../config');
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
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  Metrics: async (call, callback) => {
    try {
      const metrics = await promClient.register.metrics();
      callback(null, { metrics });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  Health: async (call, callback) => {
    callback(null, { status: 'ok' });
  },

  Login: async (call, callback) => {
    const { email, password } = call.request;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.password !== password) {
        return callback({ code: grpc.status.UNAUTHENTICATED, message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
      callback(null, { token });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  Register: async (call, callback) => {
    const { email, password } = call.request;
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return callback({ code: grpc.status.ALREADY_EXISTS, message: 'User already exists' });

      const newUser = await prisma.user.create({ data: { email, password } });
      callback(null, { id: newUser.id, email: newUser.email });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  // REST Handlers
  pingRest: async (req, res) => {
    try {
      const ping = await prisma.ping.create({ data: { message: 'pong' } });
      res.json({ id: ping.id, message: ping.message, createdAt: ping.createdAt.toISOString() });
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

  loginRest: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  registerRest: async (req, res) => {
    const { email, password } = req.body;
    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(400).json({ message: 'User already exists' });

      const newUser = await prisma.user.create({ data: { email, password } });
      res.json({ id: newUser.id, email: newUser.email });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
