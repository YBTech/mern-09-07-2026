// Unit test of the Orders HTTP layer with Catalog stubbed: proves Orders' own logic only.
// Whether the real Catalog answers like this is the integration and contract tests' job.
import { describe, it, expect, vi } from "vitest";
import request from "supertest"; // sends HTTP requests straight to the Express app, no port needed
import { createOrdersApp } from "./app";
import type { CatalogClient, CatalogProduct } from "./catalogClient";

const FAKE_PRODUCTS: Record<number, CatalogProduct> = {
  1: { id: 1, name: "Keyboard", price: 50, stock: 10 },
  2: { id: 2, name: "Mouse", price: 25, stock: 3 },
};

// STUB: returns canned answers. vi.fn also records each call, so a test can
// assert on how it was called (which makes it a MOCK when we do).
function stubCatalog(): CatalogClient {
  return { getProduct: vi.fn(async (id: number) => FAKE_PRODUCTS[id] ?? null) };
}

describe("POST /orders", () => {
  it("creates an order priced from the catalog", async () => {
    const app = createOrdersApp(stubCatalog());

    const res = await request(app)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 1, qty: 2 }] })
      .expect(201);

    expect(res.body).toMatchObject({ status: "placed", total: 100 });
  });

  it("rejects an invalid body before ever calling the catalog", async () => {
    const catalog = stubCatalog();
    const app = createOrdersApp(catalog);

    await request(app).post("/orders").send({ email: "nope" }).expect(400);

    // Asserting on the fake turns the stub into a MOCK. Use sparingly: it
    // ties the test to HOW the code works, not just what it returns.
    expect(catalog.getProduct).not.toHaveBeenCalled();
  });

  it("returns 400 for a product the catalog doesn't know", async () => {
    const app = createOrdersApp(stubCatalog());

    const res = await request(app)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 999, qty: 1 }] })
      .expect(400);

    expect(res.body.error).toBe("product 999 does not exist");
  });

  it("returns 409 when asking for more than is in stock", async () => {
    const app = createOrdersApp(stubCatalog());

    const res = await request(app)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 2, qty: 5 }] })
      .expect(409);

    expect(res.body.error).toBe("only 3 Mouse left in stock");
  });

  it("returns 503 when the catalog is down", async () => {
    // A situation that's hard to create for real but trivial with a stub.
    const downCatalog: CatalogClient = {
      getProduct: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    };
    const app = createOrdersApp(downCatalog);

    await request(app)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 1, qty: 1 }] })
      .expect(503);
  });
});

describe("GET /orders/:id", () => {
  it("returns an order that was placed", async () => {
    const app = createOrdersApp(stubCatalog());
    const created = await request(app)
      .post("/orders")
      .send({ email: "ana@example.com", items: [{ productId: 1, qty: 1 }] });

    const res = await request(app).get(`/orders/${created.body.id}`).expect(200);
    expect(res.body.email).toBe("ana@example.com");
  });

  it("returns 404 for an unknown order", async () => {
    await request(createOrdersApp(stubCatalog())).get("/orders/42").expect(404);
  });
});
