import ChatDemo, { type Run } from "./ChatDemo";
import { DEFAULT_ORDER_ID, DOCS, ORDERS, REFUND_POLICY, REFUND_WINDOW_DAYS, findOrderId } from "./data";

// 2.2 Router: classify first, then send the message down ONE path built for it.
// The classifier here is keyword counting standing in for an LLM call that returns a
// category. Dana's email hits two categories, and the router still picks one: half an answer.

type Route = "refund" | "product" | "status";

const ROUTES: Record<Route, { name: string; tools: string; keywords: string[] }> = {
  refund: { name: "Refund path", tools: "order, refund", keywords: ["refund", "return", "money back", "broke", "broken", "cancel my order", "send it back"] },
  product: { name: "Product question", tools: "search docs", keywords: ["firmware", "bug", "battery", "bluetooth", "pair", "pairing", "noise", "how do i", "how to", "update", "charge"] },
  status: { name: "Order status", tools: "order only", keywords: ["where is", "where's", "shipping", "shipped", "tracking", "arrive", "delivery", "package"] },
};

type Classification = { route: Route | null; scores: Record<Route, string[]> };

function classify(text: string): Classification {
  const lower = text.toLowerCase();
  const scores = {} as Record<Route, string[]>;
  for (const r of Object.keys(ROUTES) as Route[]) scores[r] = ROUTES[r].keywords.filter((k) => lower.includes(k));
  const ranked = (Object.keys(scores) as Route[]).sort((a, b) => scores[b].length - scores[a].length);
  return { route: scores[ranked[0]].length > 0 ? ranked[0] : null, scores };
}

async function classifyStep(text: string, run: Run): Promise<Classification> {
  const c = classify(text);
  await run.step({
    kind: "model",
    label: "Classify intent",
    ms: 1100,
    result: c.route ?? "other",
    tone: c.route ? "ok" : "warn",
    input: `Classify into: refund | product | status | other\n\n"${text}"`,
    output:
      (Object.keys(c.scores) as Route[]).map((r) => `${r.padEnd(8)} ${c.scores[r].length} hit(s)  ${c.scores[r].join(", ")}`).join("\n") +
      `\n\n(real app: one LLM call returns the label; here: keyword counting)`,
  });
  return c;
}

async function refundPath(text: string, run: Run) {
  const order = ORDERS[findOrderId(text) ?? DEFAULT_ORDER_ID] ?? ORDERS[DEFAULT_ORDER_ID];
  await run.step({ kind: "tool", label: "Look up order", ms: 900, result: `${order.product}, ${order.daysSinceDelivery ?? "—"} days`, input: `getOrder({ orderId: "${order.id}" })`, output: JSON.stringify(order, null, 2) });
  await run.step({ kind: "code", label: "Fetch refund policy", ms: 600, result: "policy in prompt", output: REFUND_POLICY });
  const eligible = order.daysSinceDelivery !== null && order.daysSinceDelivery <= REFUND_WINDOW_DAYS;
  await run.step({ kind: "model", label: "Decide + draft", ms: 1500, result: eligible ? "eligible, refund drafted" : "not eligible", tone: eligible ? "ok" : "bad" });
  return eligible
    ? `Hi ${order.customer}, your ${order.product} is within our ${REFUND_WINDOW_DAYS}-day window, so I've refunded $${order.price}. You'll see it in 3–5 business days.`
    : `Hi ${order.customer}, your ${order.product} is past our ${REFUND_WINDOW_DAYS}-day refund window, but the 1-year warranty covers a free repair.`;
}

async function productPath(text: string, run: Run) {
  const lower = text.toLowerCase();
  const ranked = [...DOCS].sort((a, b) => b.keywords.filter((k) => lower.includes(k)).length - a.keywords.filter((k) => lower.includes(k)).length);
  const doc = ranked[0];
  await run.step({ kind: "tool", label: "Search docs", ms: 1200, result: `“${doc.title}”`, input: `searchDocs("${text}")`, output: doc.body });
  await run.step({ kind: "model", label: "Answer from the doc", ms: 1300, result: "answer drafted" });
  return `Good question! From our docs (${doc.title}): ${doc.body}`;
}

async function statusPath(text: string, run: Run) {
  const order = ORDERS[findOrderId(text) ?? DEFAULT_ORDER_ID] ?? ORDERS[DEFAULT_ORDER_ID];
  await run.step({ kind: "tool", label: "Look up order", ms: 900, result: order.status, input: `getOrder({ orderId: "${order.id}" })`, output: JSON.stringify(order, null, 2) });
  await run.step({ kind: "model", label: "Draft status reply", ms: 1000, result: "drafted" });
  return order.status === "shipped"
    ? `Order ${order.id} (${order.product}) is on its way and should arrive ${order.eta}.`
    : `Order ${order.id} (${order.product}) was delivered ${order.daysSinceDelivery} days ago.`;
}

const PATHS: Record<Route, (text: string, run: Run) => Promise<string>> = {
  refund: refundPath,
  product: productPath,
  status: statusPath,
};

async function respond(text: string, run: Run) {
  // 1. model: classify the message
  const { route, scores } = await classifyStep(text, run);

  // 2. code: no category fits -> the fallback path
  if (!route) {
    run.note("No path matches → hand to a person", "warn");
    await run.say("Thanks for your message. I've passed it to a member of our support team, who'll reply within one business day.");
    return;
  }

  // 3. code: branch on the label. Only this path's prompt and tools are used.
  run.note(`Routed to: ${ROUTES[route].name}  ·  tools: ${ROUTES[route].tools}`, "info");
  const skipped = (Object.keys(scores) as Route[]).filter((r) => r !== route && scores[r].length > 0);
  if (skipped.length > 0)
    run.note(`Also matched ${skipped.map((r) => `“${ROUTES[r].name}”`).join(" and ")}, but a router picks ONE path. That part will go unanswered.`, "warn");

  // 4. the chosen path runs its own steps
  const reply = await PATHS[route](text, run);
  await run.say(reply);
}

export default function RouterDemo() {
  return (
    <ChatDemo
      greeting="Hi! Ask us anything: refunds, product questions, or where your order is."
      suggestions={[
        "I want a refund for A-1002",
        "How long does the battery last?",
        "Where is my package? Order A-1003",
        "My Aria 500 broke after 10 days. I want a refund, and is this the firmware bug?",
        "Do you sell gift cards?",
      ]}
      respond={respond}
    />
  );
}
