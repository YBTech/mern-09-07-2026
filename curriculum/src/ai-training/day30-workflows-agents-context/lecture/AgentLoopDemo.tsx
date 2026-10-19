import ChatDemo, { type Run, type StepSpec } from "./ChatDemo";
import { DEFAULT_ORDER_ID, DOCS, ORDERS, REFUND_POLICY, REFUND_WINDOW_DAYS, type Doc, type Order } from "./data";

// 3.1 The agent loop: the same for-loop as the notes, but the MODEL picks every next step.
//
//   for (let turn = 1; turn <= MAX_TURNS; turn++) {
//     const reply = callModel(state);          // fakeModel below
//     if (reply.stop_reason === "end_turn") break;
//     await runTools(reply.calls);             // results go back into the window
//   }
//
// fakeModel stands in for the LLM: plain if/else over what the message asks for and what the
// tools have returned so far. Easy questions end in one or two turns, harder ones chain
// several tools, and one question never resolves, so the turn cap has to stop it.

const MAX_TURNS = 6;
const TOOL_NAMES = "getOrder, searchDocs, getPolicy, issueRefund";

type ToolCall =
  | { name: "getOrder"; id: string }
  | { name: "searchDocs"; query: string }
  | { name: "getPolicy" }
  | { name: "issueRefund"; id: string; amount: number };

type Reply = { thought: string; calls: ToolCall[] } | { thought: string; final: string };

/** Everything the model can "see": the message plus every tool result so far. */
type Window = {
  text: string;
  ids: string[];
  orders: Record<string, Order | null>;
  docs: Record<string, Doc>;
  policy: boolean;
  refunded: string[];
  searches: number;
  messages: number;
};

const REGION_QUERIES = ["2.3.2 release by region", "2.3.2 rollout schedule", "firmware availability by country", "2.3.2 Europe", "2.3.2 release notes", "2.3.2 download page"];

// ───────────── the fake model ─────────────

function wants(text: string) {
  const t = text.toLowerCase();
  return {
    region: /region|country|europe|available where/.test(t),
    refund: /refund|return|money back/.test(t),
    firmware: /firmware|bug/.test(t),
    status: /where is|where's|shipping|arrive|track/.test(t),
    topic: DOCS.slice(1).find((d) => d.keywords.some((k) => t.includes(k))),
  };
}

const eligible = (o: Order) => o.daysSinceDelivery !== null && o.daysSinceDelivery <= REFUND_WINDOW_DAYS;

function fakeModel(w: Window): Reply {
  const want = wants(w.text);

  // a question the docs can't answer: the model keeps trying new searches
  if (want.region) {
    const query = REGION_QUERIES[w.searches % REGION_QUERIES.length];
    return {
      thought: w.searches === 0
        ? "They want to know if 2.3.2 is out in their region. I'll search the docs."
        : "The docs say 2.3.2 fixes the bug, but nothing about regions. Maybe a different search will find it.",
      calls: [{ name: "searchDocs", query }],
    };
  }

  // 1. orders first: everything else depends on them
  const unfetched = w.ids.filter((id) => !(id in w.orders));
  if (unfetched.length > 0)
    return {
      thought:
        unfetched.length > 1
          ? `Two orders to compare. I'll look up ${unfetched.join(" and ")} at the same time.`
          : w.text.match(/\d{4}/)
            ? `I need order ${unfetched[0]} before I can answer anything.`
            : `No order number in the message, so I'll use the order on this account (${unfetched[0]}).`,
      calls: unfetched.map((id) => ({ name: "getOrder", id })),
    };

  const found = w.ids.map((id) => w.orders[id]).filter((o): o is Order => o !== null);
  if (w.ids.length > 0 && found.length === 0)
    return { thought: `getOrder found nothing for ${w.ids.join(", ")}. I shouldn't guess, so I'll ask.`, final: `I couldn't find order ${w.ids.join(", ")}. Could you double-check the number? It looks like A-1001.` };

  // 2. anything else I still need to read, all in one turn
  const reading: ToolCall[] = [];
  const reasons: string[] = [];
  if (want.firmware && !w.docs.firmware) {
    reading.push({ name: "searchDocs", query: `firmware ${found[0]?.product ?? ""} ${found[0]?.firmware ?? ""}`.trim() });
    reasons.push(`check the firmware notes for v${found[0]?.firmware ?? "?"}`);
  }
  if (want.topic && !w.docs.topic) {
    reading.push({ name: "searchDocs", query: want.topic.title.toLowerCase() });
    reasons.push("look it up in the docs");
  }
  if (want.refund && !w.policy) {
    reading.push({ name: "getPolicy" });
    reasons.push("read the refund policy before promising anything");
  }
  if (reading.length > 0)
    return { thought: `${reasons.length > 1 ? "Two independent things, so both at once: " : "I need to "}${reasons.join(", and ")}.`, calls: reading };

  // 3. act: refund whatever the policy allows
  if (want.refund) {
    const toRefund = found.filter((o) => eligible(o) && !w.refunded.includes(o.id));
    if (toRefund.length > 0) {
      const skipped = found.filter((o) => !eligible(o)).map((o) => `${o.id} is past ${REFUND_WINDOW_DAYS} days`);
      return {
        thought: `Policy says ${REFUND_WINDOW_DAYS} days. ${toRefund.map((o) => `${o.id} is at day ${o.daysSinceDelivery}`).join(", ")}, so it qualifies.${skipped.length ? ` ${skipped.join(", ")}, so no refund there.` : ""}`,
        calls: toRefund.map((o) => ({ name: "issueRefund", id: o.id, amount: o.price })),
      };
    }
  }

  // 4. nothing left to do: answer
  return { thought: found.length + Object.keys(w.docs).length > 0 ? "I have everything I need. Time to answer." : "Nothing to look up for this one. I can answer directly.", final: compose(w, found) };
}

function compose(w: Window, found: Order[]): string {
  const want = wants(w.text);
  const parts: string[] = [];
  if (want.status) for (const o of found) parts.push(o.status === "shipped" ? `Order ${o.id} (${o.product}) is on its way and should arrive ${o.eta}.` : `Order ${o.id} (${o.product}) was delivered ${o.daysSinceDelivery} days ago.`);
  if (want.refund)
    for (const o of found)
      parts.push(w.refunded.includes(o.id) ? `I've refunded $${o.price} for ${o.id} (${o.product}); it'll show up in 3–5 business days.` : `${o.id} (${o.product}) is past the ${REFUND_WINDOW_DAYS}-day refund window, but the 1-year warranty covers a free repair.`);
  if (want.firmware && w.docs.firmware) {
    const buggy = found.some((o) => o.product === "Aria 500" && o.firmware === "2.3.1");
    parts.push(buggy ? "And yes, firmware 2.3.1 has a known bug where the right earcup stops pairing after sleep. Updating to 2.3.2 fixes it." : "Your firmware has no known issues.");
  }
  if (want.topic && w.docs.topic) parts.push(w.docs.topic.body);
  if (parts.length === 0) return "Hi! I can check an order, sort out a refund, or answer questions about your Aria headphones. What do you need?";
  return parts.join("\n\n");
}

// ───────────── the tools: hard-coded lookups ─────────────

const callLabel = (c: ToolCall) =>
  c.name === "getOrder" ? `getOrder("${c.id}")` : c.name === "searchDocs" ? `searchDocs("${c.query}")` : c.name === "getPolicy" ? "getPolicy()" : `issueRefund("${c.id}", ${c.amount})`;

function toolStep(c: ToolCall, w: Window): StepSpec {
  switch (c.name) {
    case "getOrder": {
      const order = ORDERS[c.id] ?? null;
      w.orders[c.id] = order;
      return { kind: "tool", label: callLabel(c), ms: 800, result: order ? `${order.product}, ${order.status}` : "not found", tone: order ? "ok" : "bad", output: JSON.stringify(order ?? { error: "no such order" }, null, 2) };
    }
    case "searchDocs": {
      const q = c.query.toLowerCase();
      const doc = [...DOCS].sort((a, b) => b.keywords.filter((k) => q.includes(k)).length - a.keywords.filter((k) => q.includes(k)).length)[0];
      w.docs[doc === DOCS[0] ? "firmware" : "topic"] = doc;
      w.searches++;
      return { kind: "tool", label: callLabel(c), ms: 1100, result: `“${doc.title}”`, output: doc.body };
    }
    case "getPolicy":
      w.policy = true;
      return { kind: "tool", label: callLabel(c), ms: 600, result: `${REFUND_WINDOW_DAYS}-day refund window`, output: REFUND_POLICY };
    case "issueRefund":
      w.refunded.push(c.id);
      return { kind: "tool", label: callLabel(c), ms: 900, result: `refunded $${c.amount}`, output: `{ "refundId": "R-77${c.id.slice(-2)}", "status": "issued" }` };
  }
}

// ───────────── the loop ─────────────

async function respond(text: string, run: Run) {
  const ids = [...text.matchAll(/\b(?:A-?)?(\d{4})\b/gi)].map((m) => `A-${m[1]}`);
  const want = wants(text);
  const w: Window = {
    text,
    ids: ids.length > 0 ? ids : want.refund || want.firmware || want.status ? [DEFAULT_ORDER_ID] : [],
    orders: {},
    docs: {},
    policy: false,
    refunded: [],
    searches: 0,
    messages: 1,
  };
  let toolCalls = 0;

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    // 1. call the model with the whole window
    const reply = fakeModel(w);
    const done = "final" in reply;
    await run.step({
      kind: "model",
      label: `Turn ${turn} · callModel(messages, tools)`,
      ms: 1200,
      result: done ? `stop_reason: "end_turn"` : `stop_reason: "tool_use" → ${reply.calls.map((c) => c.name).join(" + ")}`,
      tone: done ? "ok" : "info",
      input: `messages: ${w.messages}   tools: ${TOOL_NAMES}`,
      output: done ? reply.final : reply.calls.map(callLabel).join("\n"),
    });
    run.note(`💭 ${reply.thought}`, "think");

    // 2. end_turn: the model decided it's finished
    if (done) {
      run.note(`${turn} turn${turn > 1 ? "s" : ""} · ${toolCalls} tool call${toolCalls === 1 ? "" : "s"} · the model chose every step`, "info");
      await run.say(reply.final);
      return;
    }

    // 3. tool_use: run every tool it asked for, and append the results to the window
    await Promise.all(reply.calls.map((c) => run.step(toolStep(c, w))));
    toolCalls += reply.calls.length;
    w.messages += 2;
  }

  // 4. the cap: without it, this question would loop forever
  run.note(`Stopped: hit MAX_TURNS (${MAX_TURNS}) without "end_turn". Hand to a person.`, "bad");
  await run.say("I couldn't confirm that from our documentation, so I've passed your question to our support team. They'll reply within one business day.");
}

export default function AgentLoopDemo() {
  return (
    <ChatDemo
      greeting="Hi! I'm the Lumen Audio assistant. I can look up orders, check our docs and issue refunds."
      suggestions={{
        Easy: ["Hi, what can you help with?", "Where is order A-1003?", "How long does the battery last?"],
        Hard: [
          "My Aria 500 broke after 10 days. I want a refund, and is this the firmware bug?",
          "Refund whichever of my orders A-1001 and A-1002 is still eligible",
          "Please refund order A-1009",
          "Is firmware 2.3.2 available in my region yet?",
        ],
      }}
      respond={respond}
    />
  );
}
