const { login } = require('../src/controllers/authController');
const grpc = require('@grpc/grpc-js');

test('login with invalid user', (done) => {
  const call = { request: { email: 'notfound@test.com', password: '123' } };
  login(call, (err, res) => {
    expect(err.code).toBe(grpc.status.UNAUTHENTICATED);
    done();
  });
});
