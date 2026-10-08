// k6 load test #3: BEFORE vs. AFTER for each backend optimization. Run with:  npm run load:compare
//
// Every iteration calls all six endpoints, so each pair gets identical traffic. The summary at
// the end reports p95 per endpoint, and each one has its own threshold: the "before" versions
// fail it, the "after" versions pass. The Grafana dashboard shows the same split live.
import http from "k6/http";
import { sleep } from "k6";
import { BASE } from "./common.js";

const PAIRS = [
  // [tag, path]
  ["n-plus-one", "/api/orders/recent/n-plus-one"],
  ["batched", "/api/orders/recent/batched"],
  ["uncached", "/api/products/p1/recommendations/uncached"],
  ["cached", "/api/products/p1/recommendations/cached"],
  ["sequential", "/api/dashboard/sequential"],
  ["parallel", "/api/dashboard/parallel"],
];

export const options = {
  vus: 10,
  duration: "2m",
  // One threshold per endpoint, so the end-of-run summary prints each p95 separately.
  thresholds: Object.fromEntries(PAIRS.map(([tag]) => [`http_req_duration{name:${tag}}`, ["p(95)<250"]])),
};

export default function () {
  for (const [tag, path] of PAIRS) {
    http.get(`${BASE}${path}`, { tags: { name: tag } });
  }
  sleep(1);
}
