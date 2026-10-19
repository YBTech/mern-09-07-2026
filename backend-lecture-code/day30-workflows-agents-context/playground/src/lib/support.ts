// A tiny fake back office for steps 01-06. Not business logic, just something for the model to look up.

const ORDERS: Record<string, { item: string; deliveredDaysAgo: number; total: number }> = {
  A1042: { item: "Aria 500 headphones", deliveredDaysAgo: 10, total: 129 },
  A1043: { item: "Nova speaker", deliveredDaysAgo: 40, total: 149 },
  A1044: { item: "Aria 500 headphones", deliveredDaysAgo: 3, total: 129 },
};

const POLICY: Record<string, string> = {
  refund:
    "Opened headphones and speakers can be returned within 14 days of delivery, with a 12% restocking fee. " +
    "Items that arrive defective: contact support within 7 days of delivery for a full refund and no fee.",
  warranty:
    "Headphones and speakers are covered for 1 year from delivery against manufacturing faults. " +
    "If the product cannot be fixed, we replace it.",
  firmware:
    "Firmware 2.4.0 made Bluetooth connections drop on the Aria 500. Firmware 2.4.1 (August 2026) fixes the drop " +
    "and fixes a crackle at high volume on Nova speakers. Update from the Lumen app, product page, About.",
};

export function lookUpOrder(orderId: string | undefined) {
  return (orderId && ORDERS[orderId]) || { error: "order not found" };
}

// Return every policy whose topic appears in the query (or all of them for a broad query)
export function searchPolicy(query: string) {
  const words = query.toLowerCase();
  const hits = Object.entries(POLICY).filter(([topic]) => words.includes(topic));
  const found = hits.length > 0 ? hits : Object.entries(POLICY);
  return found.map(([topic, text]) => `${topic}: ${text}`).join("\n");
}

export const EASY_REFUND = "Hi, order A1042 arrived 10 days ago. I opened the headphones and want to return them. What happens?";
export const EASY_FIRMWARE = "Is there a fix for the Bluetooth drops on my Aria 500?";
export const EASY_STATUS = "Hi, where is my order A1044? When did it arrive?";

// The running case from the Notes: one order, a refund wish, and a firmware question in the same email
export const DANA =
  "Hi, this is Dana. My Aria 500 (order A1042) keeps dropping Bluetooth since the last update, and it is only " +
  "10 days old. I want a refund. Or is this the firmware bug I read about?";

// Several things at once, and no fixed shape: two orders, two problems, and a question about both
export const HARD =
  "My Aria 500 (order A1042) keeps dropping its Bluetooth connection since the update, and my sister's Nova speaker " +
  "(order A1043) crackles at high volume. Should we return them, or is there a fix?";

// What a good answer to HARD must cover. Plain string checks, so the result does not depend on a model.
// Each point needs a different tool result: the firmware notes, the refund policy, or one of the two orders.
export function checkHardReply(reply: string) {
  const text = reply.toLowerCase();
  return [
    { label: "names firmware 2.4.1 as the fix", ok: text.includes("2.4.1") },
    { label: "quotes the 12% restocking fee (refund policy)", ok: text.includes("12%") },
    { label: "knows A1042 was delivered 10 days ago (order lookup)", ok: /10 days|10-day/.test(text) },
    { label: "knows A1043 was delivered 40 days ago (order lookup)", ok: /40 days|40-day/.test(text) },
  ];
}
