require('dotenv').config();

module.exports = {
  port: process.env.PORT || 51052,
  grpcPort: process.env.GRPC_PORT || 50052
};
