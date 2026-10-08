// HTTP tests with Supertest: real requests through the real Express routes,
// without opening a port. Slower than the unit tests, so CI reports them after.
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app, orders } from "./app.js";

// Orders are kept in memory, so start every test with an empty history.
beforeEach(() => {
  orders.length = 0;
});

describe("GET /health", () => {
  it("responds 200 ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /version", () => {
  it("reports the environment and version", async () => {
    const res = await request(app).get("/version");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ env: "local", version: "local" });
  });
});

describe("GET /products", () => {
  it("lists the catalog", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });
});

describe("POST /orders", () => {
  it("creates an order and returns the total", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "p1", quantity: 2 }, { productId: "p2", quantity: 1 }] });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: 1,
      totalCents: 2850,
      items: [
        { productId: "p1", name: "Mechanical keyboard", quantity: 2 },
        { productId: "p2", name: "USB-C cable", quantity: 1 },
      ],
    });
  });

  it("applies a discount code", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "p1", quantity: 2 }, { productId: "p2", quantity: 1 }], discountCode: "SAVE10" });
    expect(res.body.totalCents).toBe(2565);
  });

  it("rejects an empty order with 400", async () => {
    const res = await request(app).post("/orders").send({ items: [] });
    expect(res.status).toBe(400);
  });

  it("rejects an unknown product with 400", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "nope", quantity: 1 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("nope");
  });

  it("rejects a zero quantity with 400", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ items: [{ productId: "p1", quantity: 0 }] });
    expect(res.status).toBe(400);
  });
});

describe("GET /orders", () => {
  it("is empty before any order is placed", async () => {
    const res = await request(app).get("/orders");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("lists placed orders, newest first", async () => {
    await request(app).post("/orders").send({ items: [{ productId: "p1", quantity: 1 }] });
    await request(app).post("/orders").send({ items: [{ productId: "p2", quantity: 3 }] });

    const res = await request(app).get("/orders");
    expect(res.body.map((o: { id: number; totalCents: number }) => [o.id, o.totalCents])).toEqual([
      [2, 1350],
      [1, 1200],
    ]);
  });

  it("does not record rejected orders", async () => {
    await request(app).post("/orders").send({ items: [] });
    const res = await request(app).get("/orders");
    expect(res.body).toEqual([]);
  });
});
