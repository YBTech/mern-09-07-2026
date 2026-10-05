// UNIT TEST, table-driven: one row per rule. The happy path gets one test;
// the unhappy paths (bad input) each get their own row.
import { describe, it, expect } from "vitest";
import { validateOrderInput } from "./validation";

const validOrder = { email: "ana@example.com", items: [{ productId: 1, qty: 2 }] };

describe("validateOrderInput", () => {
  it("accepts a valid order (happy path)", () => {
    expect(validateOrderInput(validOrder)).toBeNull();
  });

  it.each([
    ["a missing body", undefined, "a valid email is required"],
    ["an email without @", { ...validOrder, email: "ana" }, "a valid email is required"],
    ["no items", { ...validOrder, items: [] }, "at least one item is required"],
    ["a missing productId", { ...validOrder, items: [{ qty: 1 }] }, "every item needs a productId"],
    [
      "a zero quantity",
      { ...validOrder, items: [{ productId: 1, qty: 0 }] },
      "qty must be a whole number of at least 1",
    ],
  ])("rejects %s", (_name, body, expectedError) => {
    expect(validateOrderInput(body)).toBe(expectedError);
  });
});
