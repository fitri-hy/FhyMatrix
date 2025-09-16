const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const path = require('path');
const config = require('./config');
const otherRoutes = require('./routes/otherRoutes');
const otherController = require('./controllers/otherController');

const protoPath = path.join(__dirname, '../proto/other.proto');
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const otherProto = grpc.loadPackageDefinition(packageDef).other;

const grpcServer = new grpc.Server();
grpcServer.addService(otherProto.OtherService.service, otherController);

grpcServer.bindAsync(
  `0.0.0.0:${config.grpcPort}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) return console.error(err);
    console.log(`Other Service gRPC running on port ${port}`);
    grpcServer.start();
  }
);

const app = express();
app.use(express.json());

app.use('/other', otherRoutes);

const EXPRESS_PORT = config.port;
app.listen(EXPRESS_PORT, () => {
  console.log(`OTHER Service HTTP running on port ${EXPRESS_PORT}`);
});
