require('dotenv').config();

module.exports = {
  port: process.env.PORT || 51053,
  grpcPort: process.env.GRPC_PORT || 50053,
  dbUrl: process.env.DATABASE_URL,
};
