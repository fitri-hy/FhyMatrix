const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const path = require('path');
const config = require('./config');
const userController = require('./controllers/userController');
const userRoutes = require('./routes/userRoutes');

const protoPath = path.resolve(__dirname, '../proto/user.proto');
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDef).user;

const grpcServer = new grpc.Server();
grpcServer.addService(userProto.UserService.service, userController);

grpcServer.bindAsync(
  `0.0.0.0:${config.grpcPort}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) return console.error(err);
    console.log(`User Service gRPC running on port ${port}`);
    grpcServer.start();
  }
);

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

const EXPRESS_PORT = config.port;
app.listen(EXPRESS_PORT, () => {
  console.log(`User Service HTTP running on port ${EXPRESS_PORT}`);
});
