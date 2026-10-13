import { ValidationError } from "../errors";
import type { OrderItem } from "../models/types";

type Coupon =
  | { type: "percent"; value: number }
  | { type: "fixed"; valueCents: number; minSubtotalCents: number };

const COUPONS: Record<string, Coupon> = {
  SAVE10: { type: "percent", value: 10 },
  FIVEOFF: { type: "fixed", valueCents: 500, minSubtotalCents: 2000 },
};

export interface Totals {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
}

export function calculateTotals(items: OrderItem[], couponCode?: string): Totals {
  const subtotalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  let discountCents = 0;

  if (couponCode) {
    const coupon = COUPONS[couponCode];
    if (!coupon) throw new ValidationError(`Unknown coupon ${couponCode}`);

    if (coupon.type === "percent") {
      discountCents = Math.round(subtotalCents * coupon.value);
    } else {
      if (subtotalCents < coupon.minSubtotalCents) {
        throw new ValidationError("FIVEOFF needs a subtotal of at least $20.00");
      }
      discountCents = coupon.valueCents;
    }
  }

  return { subtotalCents, discountCents, totalCents: subtotalCents - discountCents };
}
