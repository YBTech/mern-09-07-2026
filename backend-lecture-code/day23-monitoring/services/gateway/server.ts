// The API gateway: the only backend the outside world talks to (k6, curl, a browser).
// It forwards /api/* to the right service, and has two endpoints that fan out to several
// services at once (the dashboard, a performance demo).
import express from "express";
import { errorHandler } from "../shared/errorHandler";
import { callService, type JsonResponse } from "../shared/http";
import { listen } from "../shared/listen";
import type { ServiceName } from "../shared/ports";

const app = express();
app.use(express.json());

// How long the gateway waits for a service before giving up with a 504. Under heavy load,
// requests queue inside the services; once the queue is longer than this, users start
// seeing errors: that's the "breaking point" the stress test is looking for.
const UPSTREAM_TIMEOUT_MS = 3_000;

// Forward the request to a service and relay its status + body back unchanged.
async function forward(req: express.Request, res: express.Response, service: ServiceName, path: string) {
  try {
    const upstream = await callService(service, path, {
      method: req.method === "GET" ? "GET" : "POST",
      body: req.method === "GET" ? undefined : req.body,
      timeoutMs: UPSTREAM_TIMEOUT_MS,
    });
    res.status(upstream.status).json(upstream.body);
  } catch (err) {
    if ((err as Error).name === "TimeoutError") {
      res.status(504).json({ error: `${service} took longer than ${UPSTREAM_TIMEOUT_MS}ms` });
      return;
    }
    throw err;
  }
}

app.get("/api/products", (req, res) => forward(req, res, "catalog", "/products"));
app.get("/api/products/:id", (req, res) => forward(req, res, "catalog", `/products/${req.params.id}`));
app.get("/api/promo", (req, res) => forward(req, res, "catalog", "/promo"));
app.get("/api/products/:id/recommendations/:variant", (req, res) =>
  forward(req, res, "catalog", `/products/${req.params.id}/recommendations/${req.params.variant}`),
);
app.post("/api/orders", (req, res) => forward(req, res, "orders", "/orders"));
app.get("/api/orders/summary", (req, res) => forward(req, res, "orders", "/orders/summary"));
app.get("/api/orders/recent/:variant", (req, res) => forward(req, res, "orders", `/orders/recent/${req.params.variant}`));

// ─── PERFORMANCE DEMO: sequential vs. parallel calls ─────────────────────────
// The dashboard needs three things from three services. None depends on another.

const getJson = (service: ServiceName, path: string): Promise<JsonResponse> => callService(service, path);

// BEFORE: one after another. ~120 + ~120 + ~150 = ~390ms.
app.get("/api/dashboard/sequential", async (_req, res) => {
  const inventory = await getJson("inventory", "/inventory/summary");
  const stats = await getJson("orders", "/orders/stats");
  const promo = await getJson("catalog", "/promo");
  res.json({ inventory: inventory.body, stats: stats.body, promo: promo.body });
});

// AFTER: all three at once. Total = the slowest one, ~150ms.
app.get("/api/dashboard/parallel", async (_req, res) => {
  const [inventory, stats, promo] = await Promise.all([
    getJson("inventory", "/inventory/summary"),
    getJson("orders", "/orders/stats"),
    getJson("catalog", "/promo"),
  ]);
  res.json({ inventory: inventory.body, stats: stats.body, promo: promo.body });
});

app.use(errorHandler);

listen(app, "gateway");
