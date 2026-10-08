import { describe, expect, it } from "vitest";
import type { CatalogProduct } from "./catalogClient";
import { lineTotalCents } from "./pricing";

const keyboard: CatalogProduct = {
  id: "p1",
  name: "Mechanical keyboard",
  priceCents: 8900,
  bulkDiscount: { minQuantity: 5, percent: 10 },
};

describe("lineTotalCents", () => {
  it("charges full price below the bulk quantity", () => {
    expect(lineTotalCents(keyboard, 2)).toBe(17800);
  });

  it("applies the bulk discount at 5 or more", () => {
    expect(lineTotalCents(keyboard, 5)).toBe(40050);
  });

  // After finding the production bug, add the regression test here (see README, demo 2).
});
