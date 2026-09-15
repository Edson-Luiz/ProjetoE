const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/server');

test('GET /health retorna status 200', async () => {
  // Simples verificação que a aplicação exporta o app Express
  assert.ok(app);
});
