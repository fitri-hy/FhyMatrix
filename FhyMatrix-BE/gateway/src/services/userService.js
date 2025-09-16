const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const router = express.Router();

const userProtoPath = path.resolve(__dirname, '../../../services/user-service/proto/user.proto');
const userProtoDef = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDef).user;
const userClient = new userProto.UserService(
  process.env.USER_GRPC_HOST || 'localhost:50052',
  grpc.credentials.createInsecure()
);

router.get('/', (req, res) => {
  userClient.ListUsers({}, (err, response) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(response);
  });
});

router.get('/:id', (req, res) => {
  userClient.GetUser({ id: Number(req.params.id) }, (err, response) => {
    if (err) return res.status(404).json({ message: err.message });
    res.json(response);
  });
});

module.exports = { router, userClient };
