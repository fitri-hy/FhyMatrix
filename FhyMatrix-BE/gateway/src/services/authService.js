const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const config = require('../../config');

const router = express.Router();

const authProtoPath = path.resolve(__dirname, '../../../services/auth-service/proto/auth.proto');
const authProtoDef = protoLoader.loadSync(authProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const authProto = grpc.loadPackageDefinition(authProtoDef).auth;
const authClient = new authProto.AuthService(
  config.authGrpcHost,
  grpc.credentials.createInsecure()
);

router.post('/login', (req, res) => {
  authClient.Login(req.body, (err, response) => {
    if (err) return res.status(401).json({ message: err.message });
    res.json(response);
  });
});

router.post('/register', (req, res) => {
  authClient.Register(req.body, (err, response) => {
    if (err) return res.status(400).json({ message: err.message });
    res.json(response);
  });
});

module.exports = { router, authClient };
