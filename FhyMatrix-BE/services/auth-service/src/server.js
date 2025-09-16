const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const path = require('path');
const config = require('./config');
const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');

const protoPath = path.resolve(__dirname, '../proto/auth.proto');
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const authProto = grpc.loadPackageDefinition(packageDef).auth;

const grpcServer = new grpc.Server();
grpcServer.addService(authProto.AuthService.service, authController);

grpcServer.bindAsync(
  `0.0.0.0:${config.grpcPort}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) return console.error(err);
    console.log(`Auth Service gRPC running on port ${port}`);
    grpcServer.start();
  }
);

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

const EXPRESS_PORT = config.port;
app.listen(EXPRESS_PORT, () => {
  console.log(`Auth Service HTTP running on port ${EXPRESS_PORT}`);
});
