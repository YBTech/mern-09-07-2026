import ChatDemo, { type Run } from "./ChatDemo";
import { DEFAULT_ORDER_ID, ORDERS, REFUND_POLICY, REFUND_WINDOW_DAYS, findOrderId, type Order } from "./data";

// 2.1 Prompt chain: the same fixed steps for every message, each one feeding the next.
// The chain never asks "what kind of message is this?" — a returns-form email is always a
// refund — so a shipping question still walks the refund steps. That is the point.
// No step is a tool call: a tool is something the model chooses to call, and here your code
// already knows every next step, so it calls getOrder() and refund() itself.

async function lookUpOrder(text: string, run: Run): Promise<Order | null> {
  const id = findOrderId(text) ?? DEFAULT_ORDER_ID;
  const order = ORDERS[id] ?? null;
  await run.step({
    kind: "code",
    label: "Look up order",
    ms: 1000,
    result: order ? `${order.product}, ${order.daysSinceDelivery ?? "not yet"} days since delivery` : `no order ${id}`,
    tone: order ? "ok" : "bad",
    input: `getOrder("${id}")${findOrderId(text) ? "" : "   // no number in the message: Dana's account"}`,
    output: JSON.stringify(order, null, 2),
  });
  return order;
}

async function fetchPolicy(run: Run) {
  await run.step({
    kind: "code",
    label: "Fetch refund policy",
    ms: 700,
    result: "policy added to the next prompt",
    input: `retrieve("refund policy")`,
    output: REFUND_POLICY,
  });
}

async function decide(order: Order, run: Run): Promise<boolean> {
  const days = order.daysSinceDelivery;
  const eligible = days !== null && days <= REFUND_WINDOW_DAYS;
  await run.step({
    kind: "model",
    label: "Decide",
    ms: 1400,
    result: eligible ? "eligible" : "not eligible",
    tone: eligible ? "ok" : "bad",
    input: `Policy: ${REFUND_POLICY}\nOrder: delivered ${days ?? "—"} days ago\nAnswer ELIGIBLE or NOT_ELIGIBLE.`,
    output: eligible ? "ELIGIBLE" : `NOT_ELIGIBLE (${days === null ? "not delivered yet" : `${days} days > ${REFUND_WINDOW_DAYS}`})`,
  });
  return eligible;
}

async function processRefund(order: Order, run: Run) {
  await run.step({
    kind: "code",
    label: "Process refund",
    ms: 900,
    result: `refunded $${order.price}`,
    input: `if (decision === "ELIGIBLE") refund({ orderId: "${order.id}", amount: ${order.price} })`,
    output: `{ "refundId": "R-77${order.id.slice(-2)}", "amount": ${order.price}, "status": "issued" }`,
  });
}

async function denyReturn(order: Order, run: Run) {
  await run.step({
    kind: "code",
    label: "Deny return",
    ms: 500,
    result: "no refund issued",
    tone: "bad",
    input: `else markDenied("${order.id}")`,
  });
}

function replyFor(order: Order, eligible: boolean) {
  if (eligible)
    return `Hi ${order.customer},\n\nSorry your ${order.product} stopped working. It's within our ${REFUND_WINDOW_DAYS}-day window, so I've issued a full refund of $${order.price}. You'll see it in 3–5 business days.\n\nLumen Audio support`;
  if (order.daysSinceDelivery === null)
    return `Hi ${order.customer},\n\nYour ${order.product} hasn't been delivered yet, so there's nothing to refund right now. Once it arrives you'll have ${REFUND_WINDOW_DAYS} days to request one.\n\nLumen Audio support`;
  return `Hi ${order.customer},\n\nSorry about your ${order.product}. It was delivered ${order.daysSinceDelivery} days ago, past our ${REFUND_WINDOW_DAYS}-day refund window, so I can't refund it — but it's covered by the 1-year warranty and we'll repair it free of charge.\n\nLumen Audio support`;
}

async function draftReply(order: Order, eligible: boolean, run: Run): Promise<string> {
  const reply = replyFor(order, eligible);
  await run.step({
    kind: "model",
    label: "Draft reply",
    ms: 1500,
    result: `${reply.split(/\s+/).length} words`,
    input: `Customer: ${order.customer}\nDecision: ${eligible ? "refunded" : "denied"}\nWrite a short, friendly reply.`,
    output: reply,
  });
  return reply;
}

async function checkTone(reply: string, run: Run) {
  await run.step({
    kind: "model",
    label: "Check tone",
    ms: 900,
    result: "polite, nothing promised beyond policy",
    input: reply,
    output: `model: { "polite": true, "promisesBeyondPolicy": false }\ncode:  length ${reply.length} < 800 ✓`,
  });
}

async function respond(text: string, run: Run) {
  // 1. code: pull the order number out of the message and look it up
  const order = await lookUpOrder(text, run);
  if (!order) {
    await run.say("I couldn't find that order number. Could you double-check it? It looks like A-1001.");
    return;
  }
  // 2. code: retrieve the policy so the next prompt can read it (RAG in miniature)
  await fetchPolicy(run);
  // 3. model: decide, with the policy in its prompt
  const eligible = await decide(order, run);
  // 4. code branches on the model's answer
  if (eligible) await processRefund(order, run);
  else await denyReturn(order, run);
  // 5. model: write the reply, then 6. check it before it goes out
  const reply = await draftReply(order, eligible, run);
  await checkTone(reply, run);
  await run.say(reply);
}

export default function PromptChainDemo() {
  return (
    <ChatDemo
      greeting="Hi! This is the returns form. Tell us what went wrong and include your order number if you have it."
      suggestions={[
        "My Aria 500 broke after 10 days. I want a refund.",
        "Order A-1002 stopped charging, refund please",
        "Refund for A-1003",
        "Where is my package?",
      ]}
      respond={respond}
    />
  );
}
