import express, { type Express, type RequestHandler } from "express";

// ── Simulated network ───────────────────────────────────────────────────────
// On one laptop every request takes ~1 ms, so a browser making 4 calls in two
// waves would look as fast as a browser making 1. Real customers are far from
// the datacenter: a laptop on good Wi-Fi is ~20 ms away, a phone on cellular
// ~150 ms or more, and every round trip pays that again.
//
// So: a request from a BROWSER (it carries an Origin header) waits
// `edgeLatencyMs` before it's handled. A server-to-server call (the
// aggregator calling a service) carries no Origin header and stays fast, the
// way calls inside one datacenter are.
//
// It starts at EDGE_LATENCY_MS (default 150, "a phone on cellular"). The
// lecture page's Wi-Fi / Cellular switch changes it on every service through
// POST /debug/latency.
let edgeLatencyMs = Number(process.env.EDGE_LATENCY_MS ?? 150);

export const edgeLatency: RequestHandler = (req, _res, next) => {
  if (!req.headers.origin || edgeLatencyMs === 0) return next();
  setTimeout(next, edgeLatencyMs);
};

export function latencyControl(app: Express) {
  app.get("/debug/latency", (_req, res) => {
    res.json({ ms: edgeLatencyMs });
  });
  app.post("/debug/latency", express.json(), (req, res) => {
    edgeLatencyMs = Math.max(0, Number((req.body as { ms?: number }).ms ?? 0));
    res.json({ ms: edgeLatencyMs });
  });
}

// The lecture page runs on another port, so browsers need permission to call
// us. Max-Age lets the browser cache the preflight for a POST, instead of
// paying an extra round trip before every GraphQL request.
export const allowBrowser: RequestHandler = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Max-Age", "600");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
};

// ── Outbound calls, logged ──────────────────────────────────────────────────
// Every call the aggregator makes is printed, so the fan-out (and the N+1
// problem, and its fix) is visible in the terminal.
export async function getJson<T>(service: string, url: string): Promise<T> {
  const started = Date.now();
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  const path = url.replace(/^https?:\/\/[^/]+/, "");
  console.log(`  → ${service.padEnd(8)} GET ${path} (${res.status}, ${Date.now() - started}ms)`);
  if (!res.ok) throw new Error(`${service} answered ${res.status} for ${path}`);
  return (await res.json()) as T;
}
