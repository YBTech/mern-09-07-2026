import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { resetDb } from "./helpers";

const app = createApp();

beforeEach(resetDb);

describe("GET /api/rooms and /api/users", () => {
  it("lists the six rooms by name", async () => {
    const res = await request(app).get("/api/rooms");
    expect(res.body.map((r: { name: string }) => r.name)).toEqual([
      "Aspen",
      "Birch",
      "Cedar",
      "Dogwood",
      "Elm",
      "Fir",
    ]);
    expect(res.body[0]).toEqual({ id: 1, name: "Aspen", floor: 1, capacity: 4 });
  });

  it("lists the five users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.body).toHaveLength(5);
  });
});
