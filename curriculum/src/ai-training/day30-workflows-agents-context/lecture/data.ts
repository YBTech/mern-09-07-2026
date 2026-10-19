// Lumen Audio's fake back office, shared by every demo. Nothing here is fetched:
// each "tool" in the demos is a lookup into one of these objects.

export type Order = {
  id: string;
  customer: string;
  product: string;
  price: number;
  daysSinceDelivery: number | null; // null: not delivered yet
  status: "delivered" | "shipped";
  eta?: string;
  firmware: string;
};

export const ORDERS: Record<string, Order> = {
  "A-1001": { id: "A-1001", customer: "Dana", product: "Aria 500", price: 199, daysSinceDelivery: 10, status: "delivered", firmware: "2.3.1" },
  "A-1002": { id: "A-1002", customer: "Sam", product: "Aria 300", price: 129, daysSinceDelivery: 45, status: "delivered", firmware: "2.2.0" },
  "A-1003": { id: "A-1003", customer: "Lee", product: "Aria 500", price: 199, daysSinceDelivery: null, status: "shipped", eta: "Thursday", firmware: "2.3.2" },
};

/** Dana's order — used when a message has no order number in it. */
export const DEFAULT_ORDER_ID = "A-1001";

export const REFUND_WINDOW_DAYS = 30;
export const WARRANTY_DAYS = 365;

export const REFUND_POLICY =
  "Refunds: full refund within 30 days of delivery for any defect. After 30 days: free repair under the 1-year warranty, no refund.";

export const FIRMWARE_NOTES =
  "Firmware 2.3.1 (Aria 500 only): known bug — the right earcup stops pairing after the headphones sleep. Fixed in 2.3.2.";

export type Doc = { title: string; keywords: string[]; body: string };

export const DOCS: Doc[] = [
  { title: "Firmware 2.3.1 known issues", keywords: ["firmware", "bug", "update", "pair", "pairing", "earcup", "sleep", "broke", "broken"], body: FIRMWARE_NOTES },
  { title: "Battery life", keywords: ["battery", "charge", "charging", "hours"], body: "Aria 500: 30 hours with noise cancelling on, 40 hours off. A full charge takes 2 hours over USB-C." },
  { title: "Bluetooth pairing", keywords: ["bluetooth", "connect", "pair", "pairing", "phone", "laptop"], body: "Hold the power button for 5 seconds until the light blinks blue, then pick “Aria” in your device's Bluetooth list." },
  { title: "Noise cancelling", keywords: ["noise", "cancel", "cancelling", "anc", "quiet"], body: "Press the ANC button once for full noise cancelling, twice for transparency mode." },
];

/** Pulls "A-1001" / "a1001" / "1001" out of a message. */
export function findOrderId(text: string): string | null {
  const m = text.match(/\b(?:A-?)?(\d{4})\b/i);
  return m ? `A-${m[1]}` : null;
}
