const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const config = require('../../config');

const router = express.Router();

const otherProtoPath = path.resolve(__dirname, '../../../services/other-service/proto/other.proto');
const otherProtoDef = protoLoader.loadSync(otherProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const otherProto = grpc.loadPackageDefinition(otherProtoDef).other;
const otherClient = new otherProto.OtherService(
  config.otherGrpcHost,
  grpc.credentials.createInsecure()
);

router.get('/ping', (req, res) => {
  otherClient.Ping({}, (err, response) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(response);
  });
});

router.get('/metrics', (req, res) => {
  otherClient.Metrics({}, (err, response) => {
    if (err) return res.status(500).json({ message: err.message });
    res.set('Content-Type', 'text/plain');
    res.send(response.metrics);
  });
});

router.get('/health', (req, res) => {
  otherClient.Health({}, (err, response) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(response);
  });
});

module.exports = { router, otherClient };
