// Also pure: takes the raw request body, returns an error message or null.

export type OrderInput = {
  email: string;
  items: { productId: number; qty: number }[];
};

export function validateOrderInput(body: unknown): string | null {
  const input = body as Partial<OrderInput> | undefined;

  if (typeof input?.email !== "string" || !input.email.includes("@")) {
    return "a valid email is required";
  }
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return "at least one item is required";
  }
  for (const item of input.items) {
    if (!Number.isInteger(item?.productId)) {
      return "every item needs a productId";
    }
    if (!Number.isInteger(item?.qty) || item.qty < 1) {
      return "qty must be a whole number of at least 1";
    }
  }
  return null;
}
