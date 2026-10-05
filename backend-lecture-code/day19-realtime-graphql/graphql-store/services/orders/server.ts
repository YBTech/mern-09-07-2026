// Orders: a customer's orders and their line items. Plain REST, simple CRUD.
//   GET  /orders?customerId=c-1&limit=4   recent orders, items included
//   GET  /orders/:id
//   POST /orders                          { customerId, items: [{ sku, name, thumbnail, price, qty }] }
//
// Each line item keeps a SNAPSHOT of the product as it was at checkout: its
// name, picture, and the price the customer paid. So listing orders needs no
// call to Catalog. In a real database, GET /orders is one query joining this
// service's own orders and order_items tables. What it can't join is another
// service's data: shipment status lives in Shipping.
import express from "express";
import { allowBrowser, edgeLatency, latencyControl } from "../../shared/http";

const PORT = Number(process.env.PORT ?? 4502);

type Order = {
  id: string;
  customerId: string;
  placedAt: string;
  items: { sku: string; name: string; thumbnail: string; price: number; qty: number }[];
  total: number;
};

const item = (sku: string, name: string, price: number, qty = 1) => ({
  sku,
  name,
  thumbnail: `https://cdn.shop.example/img/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-thumb.jpg`,
  price,
  qty,
});

const order = (id: string, placedAt: string, items: Order["items"]): Order => ({
  id,
  customerId: "c-1",
  placedAt,
  items,
  total: Math.round(items.reduce((sum, i) => sum + i.price * i.qty, 0) * 100) / 100,
});

const orders: Order[] = [
  order("ord-2004", "2026-09-27T14:05:00Z", [item("sku-101", "Mechanical Keyboard", 129), item("sku-102", "Wireless Mouse", 59)]),
  order("ord-2003", "2026-09-20T09:41:00Z", [item("sku-103", '27" 4K Monitor', 349)]),
  order("ord-2002", "2026-09-11T18:22:00Z", [
    item("sku-104", "Noise-Cancelling Headphones", 199),
    item("sku-105", "1080p Webcam", 79, 2),
    item("sku-106", "USB-C Hub", 39),
  ]),
  order("ord-2001", "2026-08-30T12:00:00Z", [item("sku-107", "LED Desk Lamp", 45), item("sku-101", "Mechanical Keyboard", 119)]),
];
let nextId = 2005;

const app = express();
app.use(allowBrowser, edgeLatency, express.json());
latencyControl(app);

app.get("/orders", (req, res) => {
  const customerId = String(req.query.customerId ?? "");
  const limit = Number(req.query.limit ?? 10);
  res.json(orders.filter((o) => o.customerId === customerId).slice(0, limit));
});

app.get("/orders/:id", (req, res) => {
  const found = orders.find((o) => o.id === req.params.id);
  if (!found) return res.status(404).json({ error: `order ${req.params.id} not found` });
  res.json(found);
});

app.post("/orders", (req, res) => {
  const { customerId, items } = req.body as { customerId: string; items: Order["items"] };
  if (!customerId || !items?.length) return res.status(400).json({ error: "customerId and items are required" });
  const created = order(`ord-${nextId++}`, new Date().toISOString(), items);
  created.customerId = customerId;
  orders.unshift(created);
  res.status(201).json(created);
});

app.get("/health", (_req, res) => {
  res.json({ service: "orders", status: "ok" });
});

app.listen(PORT, () => console.log(`orders (REST) on http://localhost:${PORT}`));
