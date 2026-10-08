// k6 load test #2: a STRESS test. Run with:  npm run load:stress
//
// The question this answers is not "is the shop fast?" but "where does it break first, and why?"
// So it does not keep a fixed number of users; it keeps raising the REQUESTS PER SECOND, step by
// step, until something gives. Watch Grafana → "Day 23 · Bottlenecks" while it runs.
//
// Why requests-per-second (an "open" model) and not virtual users? With a fixed pool of users,
// a slow server makes users wait, so they send LESS traffic, and the test politely backs off.
// Real shoppers don't wait for your server: they keep arriving. This script keeps arriving too.
//
// Three kinds of traffic ramp up at once, each aimed at a different weak spot:
//
//   browse    cheap reads (product list, product page) → the catalog's DB connection pool
//   checkout  place an order → the inventory row lock on the best-selling product, then
//             the payment provider's concurrency limit (about 40 charges/s)
//   report    an admin loads the revenue report (CPU-bound) → blocks the orders service's
//             single thread, so even unrelated checkouts stall
//
// What you should see, roughly (exact numbers depend on your machine; a full run is ~9 minutes):
//   min 0–2   everything green. p95 well under 500ms. This is your baseline.
//   min 3     checkout reaches ~30 orders/s. The best-seller (p1) is bought so often that its
//             inventory row lock gets a queue: "Inventory row-lock wait" climbs for p1 only.
//   min 4     the report starts. Orders' event-loop delay jumps, though no downstream is slower.
//   min 5–7   browse passes ~240 req/s: the catalog DB pool hits 6/6, a queue forms, browse latency
//             climbs. Checkout slows too: it asks catalog for prices, so it queues in the same pool.
//   min 7+    the gateway's 3s timeout trips → 504s. That's the breaking point.
//
// Then fix one thing and run it again (see the README, demo 4): LOCK_HOLD_MS=10 npm run dev removes the
// p1 queue, and the NEXT bottleneck shows itself: the payment provider's slots.
import http from "k6/http";
import { check } from "k6";
import { BASE, pickProduct, quantity } from "./common.js";

// One step is a minute. For a quick dry run:  STEP=20s npm run load:stress
const UNIT = __ENV.STEP || "1m";
const step = (target, units = 1) => ({ target, duration: UNIT.endsWith("s") ? `${parseInt(UNIT) * units}s` : `${parseInt(UNIT) * units}m` });

export const options = {
  scenarios: {
    browse: {
      executor: "ramping-arrival-rate",
      exec: "browse",
      startRate: 20, timeUnit: "1s", preAllocatedVUs: 60, maxVUs: 600,
      stages: [step(40), step(80), step(120), step(160), step(200), step(240), step(280), step(0)],
    },
    checkout: {
      executor: "ramping-arrival-rate",
      exec: "checkout",
      startRate: 3, timeUnit: "1s", preAllocatedVUs: 40, maxVUs: 600,
      stages: [step(8), step(16), step(24), step(32), step(40), step(48), step(48), step(0)],
    },
    report: {
      executor: "ramping-arrival-rate",
      exec: "report",
      startTime: step(4).duration, // an admin opens the dashboard once the shop is already busy
      startRate: 1, timeUnit: "1s", preAllocatedVUs: 10, maxVUs: 100,
      stages: [step(1), step(2), step(3), step(4), step(0)],
    },
  },
  // Not "must pass": these draw the line where the experience becomes unacceptable.
  // At the end, k6 shows which scenario crossed it.
  thresholds: {
    "http_req_duration{scenario:browse}": ["p(95)<300"],
    "http_req_duration{scenario:checkout}": ["p(95)<1500"],
    "http_req_duration{scenario:report}": ["p(95)<1000"],
    "http_req_failed{scenario:checkout}": ["rate<0.15"], // the pricing bug alone is ~10%
    "http_req_failed{scenario:browse}": ["rate<0.01"],
  },
};

export function browse() {
  const roll = Math.random();
  if (roll < 0.4) {
    http.get(`${BASE}/api/products`, { tags: { name: "GET /api/products" } });
  } else if (roll < 0.85) {
    http.get(`${BASE}/api/products/${pickProduct()}`, { tags: { name: "GET /api/products/:id" } });
  } else {
    http.get(`${BASE}/api/products/${pickProduct()}/recommendations/cached`, { tags: { name: "GET recommendations" } });
  }
}

export function checkout() {
  // Most orders are one line; some are two.
  const lines = Math.random() < 0.8 ? 1 : 2;
  const items = Array.from({ length: lines }, () => ({ productId: pickProduct(), quantity: quantity() }));
  const res = http.post(`${BASE}/api/orders`, JSON.stringify({ customer: `user${__VU}@example.com`, items }), {
    headers: { "Content-Type": "application/json" },
    tags: { name: "POST /api/orders" },
  });
  check(res, { "not a timeout (504)": (r) => r.status !== 504 });
}

export function report() {
  http.get(`${BASE}/api/orders/summary`, { tags: { name: "GET /api/orders/summary" } });
}
