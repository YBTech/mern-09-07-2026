// Catalog: the product list, prices, the promo banner, and recommendations.
import express from "express";
import { query } from "../shared/fakeDb";
import { errorHandler } from "../shared/errorHandler";
import { listen } from "../shared/listen";
import { sleep, withSpan } from "../shared/trace";
import { products } from "./products";

const app = express();
app.use(express.json());

app.get("/products", async (_req, res) => {
  const rows = await query("SELECT * FROM products", 45, () => products);
  res.json(rows);
});

app.get("/products/:id", async (req, res) => {
  const product = await query(`SELECT * FROM products WHERE id = '${req.params.id}'`, 15, () =>
    products.find((p) => p.id === req.params.id),
  );
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

app.get("/promo", async (_req, res) => {
  const promo = await query("SELECT * FROM promotions WHERE active", 150, () => ({
    text: "Back to school: 15% off desk mats this week",
  }));
  res.json(promo);
});

// ─── PERFORMANCE DEMO: caching ────────────────────────────────────────────────
// Recommendations come from a slow "ML service" (~300ms) and change rarely.

function fetchRecommendationsFromMlService(productId: string): Promise<string[]> {
  return withSpan("ml-service.recommend", { "peer.service": "ml-service", "product.id": productId }, async () => {
    await sleep(300);
    return products.filter((p) => p.id !== productId).slice(0, 3).map((p) => p.id);
  });
}

// BEFORE: every request pays the full 300ms.
app.get("/products/:id/recommendations/uncached", async (req, res) => {
  res.json(await fetchRecommendationsFromMlService(req.params.id));
});

// AFTER: cache-aside. Check memory first; only call the slow service on a miss.
// In production this Map would be Redis, so every instance shares one cache.
const cache = new Map<string, { value: string[]; expiresAt: number }>();
const TTL_MS = 5 * 60_000; // only the first request per product (after a restart or expiry) pays 300ms

app.get("/products/:id/recommendations/cached", async (req, res) => {
  const key = `recs:${req.params.id}`;
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    res.json(hit.value); // fast path: ~0ms
    return;
  }
  const value = await fetchRecommendationsFromMlService(req.params.id); // slow path: 300ms
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS });
  res.json(value);
});

app.use(errorHandler);

listen(app, "catalog");
