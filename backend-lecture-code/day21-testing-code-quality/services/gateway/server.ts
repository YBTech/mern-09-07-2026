// API gateway: the browser's single front door. It forwards /api/<service>/... to that service.
import express from "express";

const PORT = Number(process.env.PORT ?? 4100);
// first path segment picks the service: /api/products -> catalog, /api/orders -> orders
const SERVICES: Record<string, string> = {
  products: process.env.CATALOG_URL ?? "http://localhost:4101",
  orders: process.env.ORDERS_URL ?? "http://localhost:4102",
};

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", async (req, res) => {
  // req.url is the path after "/api", e.g. "/orders" or "/products/2"
  const service = req.url.split("/")[1];
  const target = SERVICES[service];
  if (!target) {
    res.status(404).json({ error: `no service handles /api/${service}` });
    return;
  }

  try {
    // hand-written with fetch so nothing is hidden; a real project would use nginx or a cloud gateway
    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const upstream = await fetch(target + req.url, {
      method: req.method,
      headers: { "content-type": "application/json" },
      body: hasBody ? JSON.stringify(req.body) : undefined,
    });
    res
      .status(upstream.status)
      .type(upstream.headers.get("content-type") ?? "application/json")
      .send(await upstream.text());
  } catch {
    res.status(502).json({ error: `${service} service is unreachable` });
  }
});

app.listen(PORT, () => {
  console.log(`gateway listening on http://localhost:${PORT}`);
});
