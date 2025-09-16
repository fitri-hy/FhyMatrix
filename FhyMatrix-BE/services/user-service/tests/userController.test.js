const { getUser } = require('../src/controllers/userController');
const grpc = require('@grpc/grpc-js');

test('getUser not found', (done) => {
  const call = { request: { id: 9999 } };
  getUser(call, (err, res) => {
    expect(err.code).toBe(grpc.status.NOT_FOUND);
    done();
  });
});
