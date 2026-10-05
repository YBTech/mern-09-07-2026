// UNIT TEST of the Catalog HTTP layer with Supertest. Catalog has no
// dependencies, so there's nothing to stub.
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createCatalogApp } from "./app";

describe("catalog", () => {
  it("lists every product", async () => {
    const res = await request(createCatalogApp()).get("/products").expect(200);
    expect(res.body).toHaveLength(3);
  });

  it("returns one product by id", async () => {
    const res = await request(createCatalogApp()).get("/products/2").expect(200);
    expect(res.body).toEqual({ id: 2, name: "Mouse", price: 25, stock: 3 });
  });

  it("returns 404 for an unknown product", async () => {
    await request(createCatalogApp()).get("/products/999").expect(404);
  });
});
