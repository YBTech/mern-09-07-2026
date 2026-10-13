import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { DAY, NEXT_DAY, resetDb } from "./helpers";

const app = createApp();

beforeEach(resetDb);

const book = (body: object) => request(app).post("/api/bookings").send(body);
const valid = {
  roomId: 5,
  userId: 1,
  title: "Interview",
  start: `${DAY}T09:00`,
  end: `${DAY}T10:00`,
};

describe("GET /api/bookings", () => {
  it("lists the bookings for one day, earliest first", async () => {
    const res = await request(app).get(`/api/bookings?date=${DAY}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
    expect(res.body[0]).toMatchObject({
      roomName: "Aspen",
      title: "Team standup",
      userName: "Ana",
    });
  });

  it("returns only the bookings of the requested day", async () => {
    const res = await request(app).get(`/api/bookings?date=${NEXT_DAY}`);
    expect(res.body).toHaveLength(2);
  });

  it("rejects a missing or malformed date with 400", async () => {
    expect((await request(app).get("/api/bookings")).status).toBe(400);
    expect((await request(app).get("/api/bookings?date=tomorrow")).status).toBe(400);
  });
});

describe("POST /api/bookings", () => {
  it("creates a booking", async () => {
    const res = await book(valid);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ roomName: "Elm", userName: "Ana", start: `${DAY}T09:00` });
  });

  it("rejects a booking that overlaps an existing one with 409", async () => {
    const res = await book({ ...valid, roomId: 1, start: `${DAY}T10:30`, end: `${DAY}T11:30` });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Room not available");
  });

  it("allows a booking that starts exactly when another one ends", async () => {
    // Aspen already has a 10:00-11:00 booking ("Design sync").
    const res = await book({ ...valid, roomId: 1, start: `${DAY}T11:00`, end: `${DAY}T12:00` });
    expect(res.status).toBe(201);
  });

  it("allows a booking that ends exactly when another one starts", async () => {
    // Aspen's first booking of the day starts at 09:00.
    const res = await book({ ...valid, roomId: 1, start: `${DAY}T08:00`, end: `${DAY}T09:00` });
    expect(res.status).toBe(201);
  });

  it("rejects an end before the start with 400", async () => {
    const res = await book({ ...valid, start: `${DAY}T10:00`, end: `${DAY}T09:00` });
    expect(res.status).toBe(400);
  });

  it("rejects a booking that spans two days with 400", async () => {
    const res = await book({ ...valid, start: `${DAY}T23:00`, end: `${NEXT_DAY}T00:30` });
    expect(res.status).toBe(400);
  });

  it("rejects an unknown room with 404", async () => {
    expect((await book({ ...valid, roomId: 99 })).status).toBe(404);
  });
});

describe("DELETE /api/bookings/:id", () => {
  it("lets the owner cancel their booking", async () => {
    const created = await book(valid);
    const res = await request(app).delete(`/api/bookings/${created.body.id}?userId=1`);
    expect(res.status).toBe(204);
    expect((await request(app).get(`/api/bookings?date=${DAY}`)).body).toHaveLength(5);
  });

  it("refuses to cancel someone else's booking with 403", async () => {
    const created = await book(valid);
    const res = await request(app).delete(`/api/bookings/${created.body.id}?userId=2`);
    expect(res.status).toBe(403);
  });

  it("returns 404 for a booking that does not exist", async () => {
    expect((await request(app).delete("/api/bookings/999?userId=1")).status).toBe(404);
  });
});
