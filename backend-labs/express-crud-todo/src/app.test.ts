import { afterAll, beforeEach, describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import request from "supertest";
import app from "./app";

// Same resolution app.ts uses for its own DATA_FILE — this file lives next
// to it in src/, so the relative path matches.
const DATA_FILE = path.join(__dirname, "../data/transactions.json");
const ORIGINAL_DATA = fs.readFileSync(DATA_FILE, "utf-8");

beforeEach(() => {
  fs.writeFileSync(DATA_FILE, "[]");
});

afterAll(() => {
  fs.writeFileSync(DATA_FILE, ORIGINAL_DATA);
});

const sampleInput = { amount: 42.5, currency: "USD", userId: "user_test123" };

describe("POST /transactions", () => {
  it("creates a transaction with a generated id and Pending status", async () => {
    const res = await request(app).post("/transactions").send(sampleInput);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ ...sampleInput, status: "Pending" });
    expect(typeof res.body.transactionId).toBe("string");
  });
});

describe("GET /transactions/:transactionId", () => {
  it("returns the transaction when it exists", async () => {
    const created = await request(app).post("/transactions").send(sampleInput);

    const res = await request(app).get(`/transactions/${created.body.transactionId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it("returns 404 with the standard message when it doesn't exist", async () => {
    const res = await request(app).get("/transactions/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Transaction not found" });
  });
});

describe("PUT /transactions/:transactionId", () => {
  it("updates the status and returns it when the transaction exists", async () => {
    const created = await request(app).post("/transactions").send(sampleInput);

    const res = await request(app)
      .put(`/transactions/${created.body.transactionId}`)
      .send({ status: "Completed" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ transactionId: created.body.transactionId, status: "Completed" });
  });

  it("returns 404 with the standard message when it doesn't exist", async () => {
    const res = await request(app)
      .put("/transactions/does-not-exist")
      .send({ status: "Completed" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Transaction not found" });
  });
});

describe("GET /transactions", () => {
  it("returns every created transaction", async () => {
    const first = await request(app).post("/transactions").send(sampleInput);
    const second = await request(app)
      .post("/transactions")
      .send({ amount: 10, currency: "EUR", userId: "user_other" });

    const res = await request(app).get("/transactions");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.map((t: { transactionId: string }) => t.transactionId).sort()).toEqual(
      [first.body.transactionId, second.body.transactionId].sort(),
    );
  });
});

describe("DELETE /transactions/:transactionId", () => {
  it("deletes an existing transaction and returns the standard message", async () => {
    const created = await request(app).post("/transactions").send(sampleInput);

    const res = await request(app).delete(`/transactions/${created.body.transactionId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Transaction deleted successfully" });
  });

  it("returns 404 with the standard message when it doesn't exist", async () => {
    const res = await request(app).delete("/transactions/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Transaction not found" });
  });
});
