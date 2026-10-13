import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { resetData } from "../src/data/reset";

const app = createApp();

beforeEach(resetData);

function placeOrder(body: object) {
  return request(app).post("/orders").send(body);
}

describe("POST /orders", () => {
  it("places an order and computes the total", async () => {
    const res = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b3", quantity: 2 }],
    });
    expect(res.status).toBe(201);
    expect(res.body.subtotalCents).toBe(2000);
    expect(res.body.totalCents).toBe(2000);
    expect(res.body.status).toBe("placed");
  });

  it("decrements stock", async () => {
    await placeOrder({ customerEmail: "ana@example.com", items: [{ bookId: "b3", quantity: 2 }] });
    const book = await request(app).get("/books/b3");
    expect(book.body.stock).toBe(18);
  });

  it("rejects an order that asks for more than the stock with 409", async () => {
    const res = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b6", quantity: 3 }],
    });
    expect(res.status).toBe(409);
  });

  it("rejects an invalid email with 400", async () => {
    const res = await placeOrder({
      customerEmail: "not-an-email",
      items: [{ bookId: "b3", quantity: 1 }],
    });
    expect(res.status).toBe(400);
  });

  it("applies FIVEOFF when the subtotal is at least $20", async () => {
    const res = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b3", quantity: 2 }],
      couponCode: "FIVEOFF",
    });
    expect(res.status).toBe(201);
    expect(res.body.totalCents).toBe(1500);
  });

  it("rejects FIVEOFF below the minimum subtotal", async () => {
    const res = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b3", quantity: 1 }],
      couponCode: "FIVEOFF",
    });
    expect(res.status).toBe(400);
  });

  it("applies SAVE10 as 10% off the subtotal", async () => {
    const res = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b3", quantity: 2 }],
      couponCode: "SAVE10",
    });
    expect(res.status).toBe(201);
    expect(res.body.discountCents).toBe(200);
    expect(res.body.totalCents).toBe(1800);
  });
});

describe("GET /orders/:id", () => {
  it("returns a placed order", async () => {
    const created = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b7", quantity: 1 }],
    });
    const res = await request(app).get(`/orders/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.customerEmail).toBe("ana@example.com");
  });
});

describe("PATCH /orders/:id/cancel", () => {
  function cancel(id: string) {
    return request(app).patch(`/orders/${id}/cancel`);
  }

  it("cancels a placed order and returns it", async () => {
    const created = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b3", quantity: 2 }],
    });
    const res = await cancel(created.body.id);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.status).toBe("cancelled");
  });

  it("restores the stock of every book in the order", async () => {
    const created = await placeOrder({
      customerEmail: "ana@example.com",
      items: [
        { bookId: "b3", quantity: 2 },
        { bookId: "b7", quantity: 5 },
      ],
    });
    await cancel(created.body.id);
    expect((await request(app).get("/books/b3")).body.stock).toBe(20);
    expect((await request(app).get("/books/b7")).body.stock).toBe(30);
  });

  it("rejects cancelling an order twice and does not restore stock again", async () => {
    const created = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b3", quantity: 2 }],
    });
    await cancel(created.body.id);
    const res = await cancel(created.body.id);
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
    expect((await request(app).get("/books/b3")).body.stock).toBe(20);
  });

  it("returns 404 for an unknown order", async () => {
    const res = await cancel("nope");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Order nope not found" });
  });

  it("still cancels an order whose book has been deleted", async () => {
    const created = await placeOrder({
      customerEmail: "ana@example.com",
      items: [{ bookId: "b3", quantity: 1 }],
    });
    await request(app).delete("/books/b3");
    const res = await cancel(created.body.id);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("cancelled");
  });
});
