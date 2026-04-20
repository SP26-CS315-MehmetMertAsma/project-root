const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

test('GET / should return 200', async () => {
  const res = await fetch('http://localhost:3000');
  assert.strictEqual(res.status, 200);
});

test('GET /api/orders should return data', async () => {
  const res = await fetch('http://localhost:3000/api/orders');
  const data = await res.json();
  assert.ok(Array.isArray(data));
});