require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  cacheTTL: parseInt(process.env.CACHE_TTL, 10) || 10,
  grpcTimeout: parseInt(process.env.GRPC_TIMEOUT, 10) || 3000,
  grpcRetries: parseInt(process.env.GRPC_RETRIES, 10) || 3,
};
