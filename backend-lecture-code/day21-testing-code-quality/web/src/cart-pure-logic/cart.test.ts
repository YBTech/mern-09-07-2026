// UNIT TEST of pure frontend logic. Same shape as a backend unit test: no
// DOM, no rendering, no React.
import { describe, it, expect } from "vitest";
import { addToCart, cartTotal, setQty } from "./cart";

const keyboard = { productId: 1, name: "Keyboard", price: 50 };

describe("cart", () => {
  it("adds a new product with qty 1", () => {
    expect(addToCart([], keyboard)).toEqual([{ ...keyboard, qty: 1 }]);
  });

  it("bumps the qty when the product is already in the cart", () => {
    const cart = addToCart(addToCart([], keyboard), keyboard);
    expect(cart).toEqual([{ ...keyboard, qty: 2 }]);
  });

  it("sets a line's qty without touching other lines", () => {
    const mouse = { productId: 2, name: "Mouse", price: 25 };
    const cart = addToCart(addToCart([], keyboard), mouse);
    expect(setQty(cart, 2, 4)).toEqual([
      { ...keyboard, qty: 1 },
      { ...mouse, qty: 4 },
    ]);
  });

  it("totals price × qty", () => {
    expect(cartTotal([{ ...keyboard, qty: 3 }])).toBe(150);
  });
});
