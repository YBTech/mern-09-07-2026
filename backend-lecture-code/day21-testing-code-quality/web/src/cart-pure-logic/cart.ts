// Cart logic as pure functions, pulled out of the component so it can be
// unit-tested without rendering anything.

export type CartLine = { productId: number; name: string; price: number; qty: number };

export function addToCart(cart: CartLine[], product: Omit<CartLine, "qty">): CartLine[] {
  const existing = cart.find((line) => line.productId === product.productId);
  if (existing) {
    return cart.map((line) =>
      line.productId === product.productId ? { ...line, qty: line.qty + 1 } : line,
    );
  }
  return [...cart, { ...product, qty: 1 }];
}

export function setQty(cart: CartLine[], productId: number, qty: number): CartLine[] {
  return cart.map((line) => (line.productId === productId ? { ...line, qty } : line));
}

export function cartTotal(cart: CartLine[]): number {
  return cart.reduce((sum, line) => sum + line.price * line.qty, 0);
}
