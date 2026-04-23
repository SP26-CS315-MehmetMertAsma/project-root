const test = require("node:test");
const assert = require("node:assert");
const app = require("./server");

let server;

test.before(() => {
  server = app.listen(3000);
});

test.after(() => {
  server.close();
});

test("GET / should return 200", async () => {
  const res = await fetch("http://localhost:3000");
  assert.strictEqual(res.status, 200);
});

test("GET /api/orders should return an array", async () => {
  const res = await fetch("http://localhost:3000/api/orders");
  const data = await res.json();
  assert.ok(Array.isArray(data));
});

test("POST /api/orders should create a new order", async () => {
  const res = await fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      table: 5,
      item: "Hummus Plate",
      price: 8.99,
    }),
  });

  const data = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(data.item, "Hummus Plate");
});