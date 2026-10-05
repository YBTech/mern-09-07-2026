// Orders service: places orders, asking Catalog for each product's price and stock.
//   POST /orders  { email, items: [{ productId, qty }] }      GET /orders/:id
import express from "express";
import type { CatalogClient } from "./catalogClient";
import { calculateOrderTotal } from "./pricing";
import { validateOrderInput, type OrderInput } from "./validation";

type Order = {
  id: number;
  email: string;
  items: { productId: number; name: string; price: number; qty: number }[];
  total: number;
  status: "placed";
};

// catalog is passed in (dependency injection): unit tests pass a fake, integration tests a real one
export function createOrdersApp(catalog: CatalogClient) {
  const app = express();
  app.use(express.json());

  const orders: Order[] = [];
  let nextId = 1;

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/orders", async (req, res) => {
    const error = validateOrderInput(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }
    const input = req.body as OrderInput;

    const items: Order["items"] = [];
    for (const { productId, qty } of input.items) {
      let product;
      try {
        product = await catalog.getProduct(productId);
      } catch {
        res.status(503).json({ error: "catalog is unavailable, try again later" });
        return;
      }

      if (!product) {
        res.status(400).json({ error: `product ${productId} does not exist` });
        return;
      }
      if (qty > product.stock) {
        res.status(409).json({ error: `only ${product.stock} ${product.name} left in stock` });
        return;
      }
      items.push({ productId, name: product.name, price: product.price, qty });
    }

    const order: Order = {
      id: nextId++,
      email: input.email,
      items,
      total: calculateOrderTotal(items),
      status: "placed",
    };
    orders.push(order);
    res.status(201).json(order);
  });

  app.get("/orders/:id", (req, res) => {
    const order = orders.find((o) => o.id === Number(req.params.id));
    if (!order) {
      res.status(404).json({ error: "order not found" });
      return;
    }
    res.json(order);
  });

  return app;
}
