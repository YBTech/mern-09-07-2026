// Catalog: products. Plain REST — in real life these responses sit behind a
// CDN cache, which GraphQL's single POST endpoint would lose.
//   GET /products/:sku
//   GET /products?ids=sku-101,sku-102     (batch — what DataLoader calls)
//
// Each product has ~25 fields. A product card needs 3 of them; REST always
// sends all of them. That's over-fetching.
import express from "express";
import { allowBrowser, edgeLatency, latencyControl } from "../../shared/http";

const PORT = Number(process.env.PORT ?? 4503);

const LOREM =
  "Built for long days at the desk, with a solid aluminium body, a matte finish that shrugs off " +
  "fingerprints, and a two-year warranty. Ships in recyclable packaging. Compatible with macOS, " +
  "Windows, and Linux out of the box — no drivers to install, no account to create.";

function product(sku: string, name: string, brand: string, price: number, category: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    sku,
    name,
    brand,
    price,
    compareAtPrice: Math.round(price * 1.2),
    currency: "CAD",
    category,
    tags: [category, brand.toLowerCase(), "bestseller", "free-shipping"],
    thumbnail: `https://cdn.shop.example/img/${slug}-thumb.jpg`,
    images: [1, 2, 3, 4, 5].map((n) => `https://cdn.shop.example/img/${slug}-${n}-2048.jpg`),
    description: `${name} by ${brand}. ${LOREM} ${LOREM}`,
    bulletPoints: ["Two-year warranty", "Free returns for 30 days", "Ships in 1–2 business days", "Recyclable packaging"],
    specs: { weightGrams: 420, dimensionsMm: "300 x 120 x 35", color: "Graphite", material: "Aluminium", warrantyYears: 2 },
    variants: ["Graphite", "Silver", "White"].map((color, i) => ({ sku: `${sku}-${i + 1}`, color, stock: 10 + i * 7 })),
    rating: 4.4,
    ratingCount: 1280,
    vendor: `${brand} Inc.`,
    returnPolicy: "Free returns within 30 days of delivery. Items must be in original packaging.",
    shippingClass: "standard",
    seoTitle: `${name} | ${brand} | Shop`,
    seoDescription: `Buy the ${name} from ${brand}. ${LOREM}`,
    createdAt: "2025-11-02T10:00:00Z",
    updatedAt: "2026-09-01T08:30:00Z",
  };
}

const products = new Map(
  [
    product("sku-101", "Mechanical Keyboard", "KeyForge", 129, "keyboards"),
    product("sku-102", "Wireless Mouse", "Pointr", 59, "mice"),
    product("sku-103", '27" 4K Monitor', "Clearview", 349, "monitors"),
    product("sku-104", "Noise-Cancelling Headphones", "Hush", 199, "audio"),
    product("sku-105", "1080p Webcam", "Lensy", 79, "cameras"),
    product("sku-106", "USB-C Hub", "Portly", 39, "accessories"),
    product("sku-107", "LED Desk Lamp", "Glow", 45, "lighting"),
    product("sku-108", "Laptop Stand", "Lift", 49, "accessories"),
  ].map((p) => [p.sku, p]),
);

const app = express();
app.use(allowBrowser, edgeLatency);
latencyControl(app);

app.get("/products", (req, res) => {
  const ids = String(req.query.ids ?? "")
    .split(",")
    .filter(Boolean);
  res.json(ids.length ? ids.map((id) => products.get(id)).filter(Boolean) : [...products.values()]);
});

app.get("/products/:sku", (req, res) => {
  const found = products.get(req.params.sku);
  if (!found) return res.status(404).json({ error: `product ${req.params.sku} not found` });
  res.json(found);
});

app.get("/health", (_req, res) => {
  res.json({ service: "catalog", status: "ok" });
});

app.listen(PORT, () => console.log(`catalog (REST) on http://localhost:${PORT}`));
