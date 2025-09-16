require('dotenv').config();

module.exports = {
  port: process.env.PORT || 51052,
  grpcPort: process.env.GRPC_PORT || 50052,
  dbUrl: process.env.USER_DATABASE_URL,
};
