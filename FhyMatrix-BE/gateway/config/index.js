module.exports = {
  port: process.env.PORT || 3000,

  authGrpcHost: process.env.AUTH_GRPC_HOST,
  userGrpcHost: process.env.USER_GRPC_HOST,
  otherGrpcHost: process.env.OTHER_GRPC_HOST,

  cacheEnabled: process.env.CACHE_ENABLED === 'true',
  cacheTTL: parseInt(process.env.CACHE_TTL, 10) || 10,
  
  grpcTimeout: parseInt(process.env.GRPC_TIMEOUT, 10) || 3000,
  grpcRetries: parseInt(process.env.GRPC_RETRIES, 10) || 3,
  
  loggingEnabled: process.env.LOGGING_ENABLED === 'true',
};
