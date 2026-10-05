// Catalog service: owns products, prices and stock. Read-only, so every run starts from the same data.
import express from "express";

export type Product = { id: number; name: string; price: number; stock: number };

export const SEED_PRODUCTS: Product[] = [
  { id: 1, name: "Keyboard", price: 50, stock: 10 },
  { id: 2, name: "Mouse", price: 25, stock: 3 },
  { id: 3, name: "Monitor", price: 200, stock: 0 },
];

// built by a function, not at import time, so a test can hand it its own product list
export function createCatalogApp(products: Product[] = structuredClone(SEED_PRODUCTS)) {
  const app = express();

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/products", (_req, res) => {
    res.json(products);
  });

  app.get("/products/:id", (req, res) => {
    const product = products.find((p) => p.id === Number(req.params.id));
    if (!product) {
      res.status(404).json({ error: "product not found" });
      return;
    }
    res.json(product);
  });

  return app;
}
