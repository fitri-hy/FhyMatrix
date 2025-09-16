require('dotenv').config();
const express = require('express');
const { callGrpc } = require('./utils/grpcHelper');

const authService = require('./services/authService');
const userService = require('./services/userService');
const otherService = require('./services/otherService');

const app = express();
app.use(express.json());

app.use('/auth', authService.router);
app.use('/users', userService.router);
app.use('/other', otherService.router);

app.get('/ping', async (req, res) => {
  const results = await Promise.all([
    callGrpc(authService.authClient, 'Ping'),
    callGrpc(userService.userClient, 'Ping'),
    callGrpc(otherService.otherClient, 'Ping'),
  ]);

  res.json({
    auth: results[0].err ? { error: results[0].err.message } : results[0].response,
    user: results[1].err ? { error: results[1].err.message } : results[1].response,
    other: results[2].err ? { error: results[2].err.message } : results[2].response,
  });
});

app.get('/metrics', async (req, res) => {
  const results = await Promise.all([
    callGrpc(authService.authClient, 'Metrics'),
    callGrpc(userService.userClient, 'Metrics'),
    callGrpc(otherService.otherClient, 'Metrics'),
  ]);

  res.set('Content-Type', 'text/plain');
  res.send([
    results[0].err ? `# ERROR: auth ${results[0].err.message}` : results[0].response.metrics,
    results[1].err ? `# ERROR: user ${results[1].err.message}` : results[1].response.metrics,
    results[2].err ? `# ERROR: other ${results[2].err.message}` : results[2].response.metrics,
  ].join('\n'));
});

app.get('/health', async (req, res) => {
  const results = await Promise.all([
    callGrpc(authService.authClient, 'Health'),
    callGrpc(userService.userClient, 'Health'),
    callGrpc(otherService.otherClient, 'Health'),
  ]);

  res.json({
    auth: results[0].err ? { status: 'error', message: results[0].err.message } : results[0].response,
    user: results[1].err ? { status: 'error', message: results[1].err.message } : results[1].response,
    other: results[2].err ? { status: 'error', message: results[2].err.message } : results[2].response,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
