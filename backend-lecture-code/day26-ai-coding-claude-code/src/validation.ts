import { ValidationError } from "./errors";
import type { Genre, NewBook, NewOrderInput } from "./models/types";

const GENRES: Genre[] = ["fiction", "tech", "history", "kids"];

export function parseNewBook(body: unknown): NewBook {
  const b = (body ?? {}) as Record<string, unknown>;
  if (typeof b.title !== "string" || b.title.trim() === "")
    throw new ValidationError("title is required");
  if (typeof b.author !== "string" || b.author.trim() === "")
    throw new ValidationError("author is required");
  if (!GENRES.includes(b.genre as Genre))
    throw new ValidationError(`genre must be one of ${GENRES.join(", ")}`);
  if (!Number.isInteger(b.priceCents) || (b.priceCents as number) <= 0) {
    throw new ValidationError("priceCents must be a positive integer");
  }
  if (!Number.isInteger(b.stock) || (b.stock as number) < 0) {
    throw new ValidationError("stock must be a non-negative integer");
  }
  return {
    title: b.title.trim(),
    author: b.author.trim(),
    genre: b.genre as Genre,
    priceCents: b.priceCents as number,
    stock: b.stock as number,
  };
}

export function parseNewOrder(body: unknown): NewOrderInput {
  const b = (body ?? {}) as Record<string, unknown>;
  if (typeof b.customerEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.customerEmail)) {
    throw new ValidationError("customerEmail must be a valid email");
  }
  if (!Array.isArray(b.items) || b.items.length === 0)
    throw new ValidationError("items must not be empty");
  const items = b.items.map((raw) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    if (typeof item.bookId !== "string") throw new ValidationError("each item needs a bookId");
    if (!Number.isInteger(item.quantity) || (item.quantity as number) < 1) {
      throw new ValidationError("each item needs a quantity of at least 1");
    }
    return { bookId: item.bookId, quantity: item.quantity as number };
  });
  const couponCode = typeof b.couponCode === "string" ? b.couponCode.toUpperCase() : undefined;
  return { customerEmail: b.customerEmail, items, couponCode };
}
