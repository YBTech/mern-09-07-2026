// Integration test: the real Orders talking to the real Catalog over real HTTP, nothing stubbed.
// It crosses a service boundary, unlike services/orders/app.test.ts, which fakes Catalog.
//
// Lives in tests/, not in a service, because it belongs to neither. In production this is often
// a dedicated test repo that boots every service, or a shared package of test helpers.
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import request from "supertest";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createCatalogApp } from "../../services/catalog/app";
import { createCatalogClient } from "../../services/orders/catalogClient";
import { createOrdersApp } from "../../services/orders/app";

let catalogServer: Server;
let catalogUrl: string;

beforeAll(async () => {
  // Start the real Catalog on a random free port (0 = "pick one"), so it can't collide with
  // a dev server. With a database, a real test database would be started here too.
  catalogServer = createCatalogApp().listen(0);
  await new Promise((resolve) => catalogServer.once("listening", resolve));
  catalogUrl = `http://localhost:${(catalogServer.address() as AddressInfo).port}`;
});

afterAll(() => {
  catalogServer.close();
});

describe("Orders + Catalog", () => {
  it("prices an order with the catalog's real price", async () => {
    const orders = createOrdersApp(createCatalogClient(catalogUrl));

    const res = await request(orders)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 1, qty: 2 }] })
      .expect(201);

    // 2 × Keyboard at $50, as the real Catalog says.
    expect(res.body.total).toBe(100);
  });

  it("enforces the catalog's real stock", async () => {
    const orders = createOrdersApp(createCatalogClient(catalogUrl));

    await request(orders)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 3, qty: 1 }] }) // Monitor: 0 left
      .expect(409);
  });

  it("maps the catalog's real 404 to a 400", async () => {
    const orders = createOrdersApp(createCatalogClient(catalogUrl));

    await request(orders)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 999, qty: 1 }] })
      .expect(400);
  });

  it("returns 503 when nothing is listening at the catalog URL", async () => {
    const orders = createOrdersApp(createCatalogClient("http://localhost:1"));

    await request(orders)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 1, qty: 1 }] })
      .expect(503);
  });
});
