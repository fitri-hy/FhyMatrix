const { ping } = require('../src/controllers/otherController');

test('ping returns pong', (done) => {
  ping({}, (err, res) => {
    expect(res.message).toBe('pong');
    done();
  });
});
