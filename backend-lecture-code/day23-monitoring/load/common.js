// Shared by every k6 script: where the gateway is, and what a "typical shopper" picks.
import http from "k6/http";

export const BASE = __ENV.BASE_URL || "http://localhost:4000";

// 402 (card declined) and 409 (out of stock) are normal business outcomes, not failures.
// Only 5xx and timeouts count as "failed" in k6's http_req_failed.
http.setResponseCallback(http.expectedStatuses({ min: 200, max: 499 }));

// Real shops have hot products: p1 is the best seller, so a third of all traffic lands on it.
const WEIGHTS = [["p1", 30], ["p2", 15], ["p3", 8], ["p4", 8], ["p5", 12], ["p6", 7], ["p7", 8], ["p8", 12]];
const TOTAL = WEIGHTS.reduce((sum, [, w]) => sum + w, 0);

export function pickProduct() {
  let roll = Math.random() * TOTAL;
  for (const [id, weight] of WEIGHTS) {
    if ((roll -= weight) < 0) return id;
  }
  return "p1";
}

// 1–6 units. 5 and 6 are the ones that trigger the pricing bug on products without a bulk discount.
export const quantity = () => 1 + Math.floor(Math.random() * 6);
