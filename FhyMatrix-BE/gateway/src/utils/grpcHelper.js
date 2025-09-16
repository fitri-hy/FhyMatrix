function callGrpc(client, method, payload = {}) {
  return new Promise((resolve) => {
    client[method](payload, (err, response) => {
      if (err) {
        resolve({ error: err.message });
      } else {
        resolve(response);
      }
    });
  });
}

module.exports = { callGrpc };
