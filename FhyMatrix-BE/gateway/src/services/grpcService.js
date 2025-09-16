const { callGrpc } = require('../utils/grpcHelper');
const opossum = require('opossum');
const retry = require('async-retry');
const config = require('../../config');

const services = [
  { name: 'auth', client: require('./authService').authClient },
  { name: 'user', client: require('./userService').userClient },
  { name: 'other', client: require('./otherService').otherClient },
];

const breakerOptions = {
  timeout: config.grpcTimeout,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
};

async function callService(client, serviceName, method) {
  const breaker = new opossum(
    () => retry(async () => callGrpc(client, method), { retries: config.grpcRetries }),
    breakerOptions
  );

  try {
    const res = await breaker.fire();
    return { response: res };
  } catch (err) {
    return { err };
  }
}

async function callAll(method) {
  const promises = services.map(svc => 
    callService(svc.client, svc.name, method).then(res => ({ name: svc.name, ...res }))
  );
  return Promise.all(promises);
}

module.exports = { callAll };
