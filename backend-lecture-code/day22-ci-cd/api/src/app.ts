// The Express app, exported WITHOUT calling listen(), so Supertest can send it
// requests in-process. server.ts is the only file that opens a port.
import path from "node:path";
import express from "express";
import { applyDiscount, subtotalCents } from "./pricing.js";

export const products = [
  { id: "p1", name: "Mechanical keyboard", priceCents: 1200 },
  { id: "p2", name: "USB-C cable", priceCents: 450 },
  { id: "p3", name: "Monitor stand", priceCents: 3000 },
];

type OrderBody = {
  items?: { productId: string; quantity: number }[];
  discountCode?: string;
};

export type Order = {
  id: number;
  createdAt: string;
  items: { productId: string; name: string; quantity: number }[];
  totalCents: number;
};

// Every order placed, kept in memory: it resets whenever the server restarts (including
// every deploy, which starts a fresh container). A real app would store these in a database.
export const orders: Order[] = [];

export const app = express();
app.use(express.json());

// In the Docker image, the React build is copied to ./public and served from here, so one
// container runs the whole app. Locally (npm run dev) the folder doesn't exist and this does nothing.
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Which environment is this, and which commit is running? Set by deploy/deploy.sh when it starts
// the container. The smoke test reads this to confirm the right version went out.
app.get("/version", (_req, res) => {
  res.json({ env: process.env.APP_ENV ?? "local", version: process.env.APP_VERSION ?? "local" });
});

app.get("/products", (_req, res) => {
  res.json(products);
});

app.post("/orders", (req, res) => {
  const { items, discountCode } = req.body as OrderBody;

  if (!items || items.length === 0) {
    res.status(400).json({ error: "Order must contain at least one item" });
    return;
  }

  const lines = [];
  const orderItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      res.status(400).json({ error: `Unknown product: ${item.productId}` });
      return;
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      res.status(400).json({ error: "Quantity must be a positive whole number" });
      return;
    }
    lines.push({ priceCents: product.priceCents, quantity: item.quantity });
    orderItems.push({ productId: product.id, name: product.name, quantity: item.quantity });
  }

  const order: Order = {
    id: orders.length + 1,
    createdAt: new Date().toISOString(),
    items: orderItems,
    totalCents: applyDiscount(subtotalCents(lines), discountCode),
  };
  orders.push(order);
  res.status(201).json(order);
});

// Order history, newest first.
app.get("/orders", (_req, res) => {
  res.json([...orders].reverse());
});
