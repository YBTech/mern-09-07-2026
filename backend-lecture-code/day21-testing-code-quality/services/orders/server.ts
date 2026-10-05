import express from "express";
import { createOrdersApp } from "./app";
import { createCatalogClient } from "./catalogClient";

const PORT = Number(process.env.PORT ?? 4102);
const CATALOG_URL = process.env.CATALOG_URL ?? "http://localhost:4101";

const app = express();

// Pretend to be a real network: every order takes 200–1200ms. This lives in
// server.ts, not app.ts, so unit tests stay instant. It's what makes the
// flaky E2E demo (e2e/flaky.spec.ts) flaky.
app.use("/orders", (req, _res, next) => {
  if (req.method !== "POST") return next();
  setTimeout(next, 200 + Math.random() * 1000);
});

app.use(createOrdersApp(createCatalogClient(CATALOG_URL)));

app.listen(PORT, () => {
  console.log(`orders listening on http://localhost:${PORT} (catalog at ${CATALOG_URL})`);
});
