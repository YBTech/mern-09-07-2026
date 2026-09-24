// REFERENCE — these already pass; nothing to do here. Read them to see
// what a finished spec looks like for a fully-layered resource.

import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../app";
import { resetDb } from "../test-utils";

beforeEach(async () => {
  await resetDb();
});

const sampleWorkshop = {
  title: "Intro to Testing",
  capacity: 20,
  startsAt: "2026-10-01T18:00:00.000Z",
};

describe("POST /workshops", () => {
  it("creates a workshop and returns it", async () => {
    const res = await request(app).post("/workshops").send(sampleWorkshop);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(sampleWorkshop);
    expect(typeof res.body.id).toBe("number");
  });

  it("400s when title is missing", async () => {
    const res = await request(app)
      .post("/workshops")
      .send({ capacity: 10, startsAt: sampleWorkshop.startsAt });

    expect(res.status).toBe(400);
  });
});

describe("GET /workshops/:id", () => {
  it("returns the workshop when it exists", async () => {
    const created = await request(app).post("/workshops").send(sampleWorkshop);

    const res = await request(app).get(`/workshops/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it("404s when it doesn't exist", async () => {
    const res = await request(app).get("/workshops/999999");
    expect(res.status).toBe(404);
  });
});

describe("GET /workshops", () => {
  it("returns every created workshop", async () => {
    await request(app).post("/workshops").send(sampleWorkshop);
    await request(app)
      .post("/workshops")
      .send({ ...sampleWorkshop, title: "Second Workshop" });

    const res = await request(app).get("/workshops");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe("PATCH /workshops/:id", () => {
  it("updates the given fields and leaves the rest alone", async () => {
    const created = await request(app).post("/workshops").send(sampleWorkshop);

    const res = await request(app)
      .patch(`/workshops/${created.body.id}`)
      .send({ capacity: 30 });

    expect(res.status).toBe(200);
    expect(res.body.capacity).toBe(30);
    expect(res.body.title).toBe(sampleWorkshop.title);
  });

  it("404s when it doesn't exist", async () => {
    const res = await request(app).patch("/workshops/999999").send({ capacity: 30 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /workshops/:id", () => {
  it("deletes an existing workshop", async () => {
    const created = await request(app).post("/workshops").send(sampleWorkshop);

    const res = await request(app).delete(`/workshops/${created.body.id}`);

    expect(res.status).toBe(204);
  });

  it("404s when it doesn't exist", async () => {
    const res = await request(app).delete("/workshops/999999");
    expect(res.status).toBe(404);
  });
});
