import { z } from "zod";

// Slice Pizza: a tiny fake shop. Prices live in code, never in the model's head.

export const SIZES = ["small", "medium", "large"] as const;

export const PIZZAS: Record<string, { small: number; medium: number; large: number; vegetarian: boolean }> = {
  margherita: { small: 10, medium: 13, large: 16, vegetarian: true },
  pepperoni: { small: 11, medium: 14, large: 17, vegetarian: false },
  "bbq chicken": { small: 12, medium: 15, large: 18, vegetarian: false },
  "veggie garden": { small: 11, medium: 14, large: 17, vegetarian: true },
  "four cheese": { small: 12, medium: 15, large: 18, vegetarian: true },
};

export const EXTRAS: Record<string, number> = {
  coke: 2.5,
  sprite: 2.5,
  "sparkling water": 3,
  "garlic knots": 5,
  "caesar salad": 7,
};

// The menu as one short string, for prompts and for the get_menu tool
export const MENU_TEXT = [
  "Pizzas (small / medium / large):",
  ...Object.entries(PIZZAS).map(
    ([name, p]) => `- ${name}: $${p.small} / $${p.medium} / $${p.large}${p.vegetarian ? " (vegetarian)" : ""}`,
  ),
  "Drinks and sides:",
  ...Object.entries(EXTRAS).map(([name, price]) => `- ${name}: $${price}`),
].join("\n");

// One line on an order. The same zod schema is the structured-output shape, the tool input and the state type.
export const OrderItem = z.object({
  item: z.string().describe("Menu item name in lower case, e.g. 'pepperoni' or 'coke'"),
  size: z.enum(SIZES).optional().describe("Only for pizzas"),
  quantity: z.number().int().min(1),
});
export type OrderItem = z.infer<typeof OrderItem>;

// Price one line in code. Returns null for things that are not on the menu.
export function priceOf({ item, size, quantity }: OrderItem) {
  const name = item.toLowerCase().replace(/s$/, ""); // "pepperonis" → "pepperoni"
  const pizza = PIZZAS[name];
  if (pizza) return pizza[size ?? "medium"] * quantity;
  const extra = EXTRAS[name] ?? EXTRAS[item.toLowerCase()];
  return extra === undefined ? null : extra * quantity;
}

export function cartTotal(cart: OrderItem[]) {
  return cart.reduce((sum, line) => sum + (priceOf(line) ?? 0), 0);
}

export function describeCart(cart: OrderItem[]) {
  if (cart.length === 0) return "(empty)";
  const lines = cart.map((l) => `${l.quantity}× ${l.size ? l.size + " " : ""}${l.item} $${priceOf(l)?.toFixed(2)}`);
  return `${lines.join(", ")} = $${cartTotal(cart).toFixed(2)}`;
}

// Orders already placed, for "where is my order?". New orders are added here at checkout.
export const ORDERS: Record<string, string> = {
  "S-1001": "in the oven, about 15 minutes to go",
  "S-1002": "out for delivery with Sam, about 5 minutes away",
  "S-1003": "delivered at 7:42 pm",
};

let lastOrderNumber = 1003;
export function nextOrderId() {
  return `S-${++lastOrderNumber}`;
}
