const grpc = require('@grpc/grpc-js');
const prisma = require('../models/userModel');
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

  listUsers: async (call, callback) => {
    try {
      const users = await prisma.user.findMany({ select: { id: true, email: true } });
      callback(null, { users });
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  getUser: async (call, callback) => {
    const { id } = call.request;
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) }, select: { id: true, email: true } });
      if (!user) {
        return callback({ code: grpc.status.NOT_FOUND, message: 'User not found' });
      }
      callback(null, user);
    } catch (err) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  // REST Handlers
  pingRest: async (req, res) => {
    res.json({
      id: 0,
      message: 'pong',
      createdAt: new Date().toISOString(),
    });
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

  listUsersRest: async (req, res) => {
    try {
      const users = await prisma.user.findMany({ select: { id: true, email: true } });
      res.json({ users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUserRest: async (req, res) => {
    const id = Number(req.params.id);
    try {
      const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true } });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
