// This is the spec for the business rules described in service.ts's TODOs.
// All of these fail right now — implementing validation.ts, service.ts,
// and controller.ts correctly should turn them green, without editing this
// file.

import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../app";
import { resetDb } from "../test-utils";

beforeEach(async () => {
  await resetDb();
});

async function createWorkshop(capacity = 2) {
  const res = await request(app)
    .post("/workshops")
    .send({ title: "Test Workshop", capacity, startsAt: "2026-10-01T18:00:00.000Z" });
  return res.body;
}

async function createAttendee(email: string) {
  const res = await request(app).post("/attendees").send({ name: "Test Attendee", email });
  return res.body;
}

describe("POST /registrations", () => {
  it("creates a confirmed registration", async () => {
    const workshop = await createWorkshop();
    const attendee = await createAttendee("a@example.com");

    const res = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: attendee.id });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      workshopId: workshop.id,
      attendeeId: attendee.id,
      status: "confirmed",
    });
  });

  it("404s when the workshop doesn't exist", async () => {
    const attendee = await createAttendee("a@example.com");

    const res = await request(app)
      .post("/registrations")
      .send({ workshopId: 999999, attendeeId: attendee.id });

    expect(res.status).toBe(404);
  });

  it("404s when the attendee doesn't exist", async () => {
    const workshop = await createWorkshop();

    const res = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: 999999 });

    expect(res.status).toBe(404);
  });

  it("409s on a duplicate registration for the same workshop + attendee", async () => {
    const workshop = await createWorkshop();
    const attendee = await createAttendee("a@example.com");

    await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: attendee.id });
    const res = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: attendee.id });

    expect(res.status).toBe(409);
  });

  it("409s once the workshop is at capacity", async () => {
    const workshop = await createWorkshop(1);
    const first = await createAttendee("first@example.com");
    const second = await createAttendee("second@example.com");

    const firstRes = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: first.id });
    expect(firstRes.status).toBe(201);

    const secondRes = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: second.id });
    expect(secondRes.status).toBe(409);
  });

  it("allows registering again after a cancellation frees a seat", async () => {
    const workshop = await createWorkshop(1);
    const first = await createAttendee("first@example.com");
    const second = await createAttendee("second@example.com");

    const firstReg = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: first.id });

    await request(app)
      .patch(`/registrations/${firstReg.body.id}`)
      .send({ status: "cancelled" });

    const secondRes = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: second.id });
    expect(secondRes.status).toBe(201);
  });
});

describe("GET /registrations", () => {
  it("filters by workshopId when given", async () => {
    const workshopA = await createWorkshop();
    const workshopB = await createWorkshop();
    const attendee1 = await createAttendee("a@example.com");
    const attendee2 = await createAttendee("b@example.com");

    await request(app)
      .post("/registrations")
      .send({ workshopId: workshopA.id, attendeeId: attendee1.id });
    await request(app)
      .post("/registrations")
      .send({ workshopId: workshopB.id, attendeeId: attendee2.id });

    const res = await request(app).get(`/registrations?workshopId=${workshopA.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].workshopId).toBe(workshopA.id);
  });
});

describe("GET /registrations/:id", () => {
  it("returns the registration when it exists", async () => {
    const workshop = await createWorkshop();
    const attendee = await createAttendee("a@example.com");
    const created = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: attendee.id });

    const res = await request(app).get(`/registrations/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it("404s when it doesn't exist", async () => {
    const res = await request(app).get("/registrations/999999");
    expect(res.status).toBe(404);
  });
});

describe("PATCH /registrations/:id", () => {
  it("cancels a confirmed registration", async () => {
    const workshop = await createWorkshop();
    const attendee = await createAttendee("a@example.com");
    const created = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: attendee.id });

    const res = await request(app)
      .patch(`/registrations/${created.body.id}`)
      .send({ status: "cancelled" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("cancelled");
  });

  it("409s when cancelling an already-cancelled registration", async () => {
    const workshop = await createWorkshop();
    const attendee = await createAttendee("a@example.com");
    const created = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: attendee.id });

    await request(app)
      .patch(`/registrations/${created.body.id}`)
      .send({ status: "cancelled" });
    const res = await request(app)
      .patch(`/registrations/${created.body.id}`)
      .send({ status: "cancelled" });

    expect(res.status).toBe(409);
  });

  it('400s when status is not "cancelled"', async () => {
    const workshop = await createWorkshop();
    const attendee = await createAttendee("a@example.com");
    const created = await request(app)
      .post("/registrations")
      .send({ workshopId: workshop.id, attendeeId: attendee.id });

    const res = await request(app)
      .patch(`/registrations/${created.body.id}`)
      .send({ status: "confirmed" });

    expect(res.status).toBe(400);
  });

  it("404s when it doesn't exist", async () => {
    const res = await request(app)
      .patch("/registrations/999999")
      .send({ status: "cancelled" });

    expect(res.status).toBe(404);
  });
});
