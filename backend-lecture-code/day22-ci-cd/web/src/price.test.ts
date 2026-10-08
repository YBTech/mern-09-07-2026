// UNIT tests for the pure helpers.
import { describe, expect, it } from "vitest";
import { cartTotalCents, formatPrice } from "./price";

describe("formatPrice", () => {
  it("formats cents as dollars", () => {
    expect(formatPrice(2850)).toBe("$28.50");
  });

  it("keeps two decimals", () => {
    expect(formatPrice(1200)).toBe("$12.00");
  });
});

describe("cartTotalCents", () => {
  it("adds price × quantity", () => {
    expect(
      cartTotalCents([
        { id: "p1", name: "Keyboard", priceCents: 1200, quantity: 2 },
        { id: "p2", name: "Cable", priceCents: 450, quantity: 1 },
      ]),
    ).toBe(2850);
  });
});
