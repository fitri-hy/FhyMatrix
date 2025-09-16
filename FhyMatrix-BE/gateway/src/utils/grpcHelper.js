function callGrpc(client, method, payload = {}) {
  return new Promise((resolve) => {
    client[method](payload, (err, response) => {
      resolve({ err, response });
    });
  });
}

module.exports = { callGrpc };
