// Minimal smoke tests using the built-in node:test runner (no extra deps).
const test = require("node:test");
const assert = require("node:assert");
const { isBreach } = require("../src/routes/telemetry.routes");

test("isBreach flags temperatures above the threshold", () => {
  assert.strictEqual(isBreach(13, 12), true);
  assert.strictEqual(isBreach(11, 12), false);
});

test("health endpoint module loads without throwing", () => {
  const app = require("../src/index");
  assert.ok(app);
});
