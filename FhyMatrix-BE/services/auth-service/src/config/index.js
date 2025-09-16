require('dotenv').config();

module.exports = {
  port: process.env.PORT || 51051,
  grpcPort: process.env.GRPC_PORT || 50051,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret'
};
