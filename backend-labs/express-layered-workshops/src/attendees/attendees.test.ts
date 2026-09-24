// These already pass against the flat controller.ts you're about to
// refactor. Your job isn't to make them pass — it's to keep them passing
// while you split the code into validation.ts / service.ts / controller.ts.
// If any of these go red during your refactor, you changed behavior, not
// just structure.

import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../app";
import { resetDb } from "../test-utils";

beforeEach(async () => {
  await resetDb();
});

const sampleAttendee = { name: "Ada Lovelace", email: "ada@example.com" };

describe("POST /attendees", () => {
  it("creates an attendee and returns it", async () => {
    const res = await request(app).post("/attendees").send(sampleAttendee);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(sampleAttendee);
    expect(typeof res.body.id).toBe("number");
  });

  it("400s when name is missing", async () => {
    const res = await request(app).post("/attendees").send({ email: "ada@example.com" });
    expect(res.status).toBe(400);
  });

  it("400s when email is missing", async () => {
    const res = await request(app).post("/attendees").send({ name: "Ada Lovelace" });
    expect(res.status).toBe(400);
  });
});

describe("GET /attendees/:id", () => {
  it("returns the attendee when it exists", async () => {
    const created = await request(app).post("/attendees").send(sampleAttendee);

    const res = await request(app).get(`/attendees/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it("404s when it doesn't exist", async () => {
    const res = await request(app).get("/attendees/999999");
    expect(res.status).toBe(404);
  });
});

describe("GET /attendees", () => {
  it("returns every created attendee", async () => {
    await request(app).post("/attendees").send(sampleAttendee);
    await request(app)
      .post("/attendees")
      .send({ name: "Grace Hopper", email: "grace@example.com" });

    const res = await request(app).get("/attendees");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe("PATCH /attendees/:id", () => {
  it("updates the given fields and leaves the rest alone", async () => {
    const created = await request(app).post("/attendees").send(sampleAttendee);

    const res = await request(app)
      .patch(`/attendees/${created.body.id}`)
      .send({ name: "Ada, Countess of Lovelace" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Ada, Countess of Lovelace");
    expect(res.body.email).toBe(sampleAttendee.email);
  });

  it("404s when it doesn't exist", async () => {
    const res = await request(app).patch("/attendees/999999").send({ name: "x" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /attendees/:id", () => {
  it("deletes an existing attendee", async () => {
    const created = await request(app).post("/attendees").send(sampleAttendee);

    const res = await request(app).delete(`/attendees/${created.body.id}`);

    expect(res.status).toBe(204);
  });

  it("404s when it doesn't exist", async () => {
    const res = await request(app).delete("/attendees/999999");
    expect(res.status).toBe(404);
  });
});
