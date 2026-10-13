import { describe, it } from "vitest";

// TICKET-103: turn these into real tests first, then implement getLowStockBooks.
describe("getLowStockBooks", () => {
  it.todo("returns books with stock at or below the threshold");
  it.todo("sorts the result by stock, lowest first");
  it.todo("includes a book whose stock equals the threshold");
  it.todo("returns an empty list when nothing is low");
});
