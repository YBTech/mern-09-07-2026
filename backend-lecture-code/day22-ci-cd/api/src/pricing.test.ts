// UNIT tests: one pure function at a time. Fast, and the first tests CI runs.
import { describe, expect, it } from "vitest";
import { applyDiscount, subtotalCents } from "./pricing.js";

describe("subtotalCents", () => {
  it("adds price × quantity for every line", () => {
    expect(
      subtotalCents([
        { priceCents: 1200, quantity: 2 },
        { priceCents: 450, quantity: 1 },
      ]),
    ).toBe(2850);
  });

  it("is 0 for an empty cart", () => {
    expect(subtotalCents([])).toBe(0);
  });
});

describe("applyDiscount", () => {
  it("takes 10% off with SAVE10", () => {
    expect(applyDiscount(2850, "SAVE10")).toBe(2565);
  });

  it("ignores unknown codes", () => {
    expect(applyDiscount(2850, "FREESTUFF")).toBe(2850);
  });
});
