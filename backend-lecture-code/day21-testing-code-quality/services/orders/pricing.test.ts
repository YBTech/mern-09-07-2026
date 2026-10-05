// UNIT TEST of a pure function. No setup, no mocks: just input -> output.
//
// The runner (Vitest) gives us describe / it / expect. That's all a pure
// function needs. No testing library required.
import { describe, it, expect } from "vitest";
import { calculateOrderTotal } from "./pricing";

describe("calculateOrderTotal", () => {
  it("sums price × qty across line items", () => {
    const items = [
      { price: 10, qty: 2 },
      { price: 5, qty: 1 },
    ]; // arrange
    const total = calculateOrderTotal(items); // act
    expect(total).toBe(25); // assert
  });

  it("returns 0 for an empty order", () => {
    expect(calculateOrderTotal([])).toBe(0);
  });
});
