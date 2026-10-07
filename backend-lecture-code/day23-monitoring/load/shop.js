// k6 load test #1: realistic, comfortable shop traffic. Run with:  npm run load:shop
//
// Purpose: give the dashboards something to show, including the deliberate production bug.
// This is NOT trying to break anything; for that, see stress.js.
//
// Each "virtual user" (VU) loops: browse → look at a product → maybe buy → think → repeat.
import http from "k6/http";
import { check, sleep } from "k6";
import { BASE, pickProduct, quantity } from "./common.js";

export const options = {
  stages: [
    { duration: "30s", target: 15 },
    { duration: "3m", target: 15 },
    { duration: "20s", target: 0 },
  ],
  // Pass/fail goals, printed at the end. With the bug in place, the error-rate one FAILS.
  thresholds: {
    http_req_failed: ["rate<0.01"], // less than 1% of requests may fail
    http_req_duration: ["p(95)<500"], // 95% of requests under 500ms
  },
};

export default function () {
  http.get(`${BASE}/api/products`, { tags: { name: "GET /api/products" } });
  http.get(`${BASE}/api/promo`, { tags: { name: "GET /api/promo" } });

  const id = pickProduct();
  http.get(`${BASE}/api/products/${id}`, { tags: { name: "GET /api/products/:id" } });
  http.get(`${BASE}/api/products/${id}/recommendations/cached`, { tags: { name: "GET recommendations" } });

  // About 35% of visits end in an order.
  if (Math.random() < 0.35) {
    const order = http.post(
      `${BASE}/api/orders`,
      JSON.stringify({ customer: `user${__VU}@example.com`, items: [{ productId: pickProduct(), quantity: quantity() }] }),
      { headers: { "Content-Type": "application/json" }, tags: { name: "POST /api/orders" } },
    );
    check(order, { "order placed (201), or refused for a business reason (402/409)": (r) => [201, 402, 409].includes(r.status) });
  }

  sleep(1 + Math.random() * 2); // a real user pauses between clicks
}
