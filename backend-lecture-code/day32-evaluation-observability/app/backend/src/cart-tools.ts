import { tool } from "langchain";
import { z } from "zod";
import { OrderItem, describeCart, priceOf } from "./shop";

// The cart tools both agents use. Each tool edits the `cart` array it is given; prices and totals stay in code.
export function cartTools(cart: OrderItem[]) {
  const addToCart = tool(
    async (line) => {
      if (priceOf(line) === null) return `"${line.item}" is not on the menu.`;
      const same = cart.find((l) => l.item === line.item && l.size === line.size);
      if (same) same.quantity += line.quantity;
      else cart.push(line);
      return `Cart: ${describeCart(cart)}`;
    },
    { name: "add_to_cart", description: "Add items to the customer's cart.", schema: OrderItem },
  );

  const removeFromCart = tool(
    async ({ item }) => {
      const before = cart.length;
      const kept = cart.filter((l) => l.item !== item.toLowerCase());
      cart.splice(0, cart.length, ...kept);
      return before === cart.length ? `${item} is not in the cart.` : `Removed. Cart: ${describeCart(cart)}`;
    },
    { name: "remove_from_cart", description: "Remove every line of one menu item from the cart.", schema: z.object({ item: z.string() }) },
  );

  const viewCart = tool(async () => describeCart(cart), {
    name: "view_cart",
    description: "The cart and its total, worked out by the shop's till.",
    schema: z.object({}),
  });

  return [addToCart, removeFromCart, viewCart];
}
