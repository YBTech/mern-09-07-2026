import Anthropic from "@anthropic-ai/sdk";
import { EASY_REFUND, lookUpOrder, searchPolicy } from "../lib/support";
import { cyan, dim, green, magenta, red, title, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: the prompt chain
// ════════════════════════════════════════════════════════════════════════════════════════════════

async function runChain(email: string) {
  let tokens = 0;
  const count = (usage: Anthropic.Usage) =>
    (tokens += usage.input_tokens + usage.output_tokens);
  const step = (label: string) => console.log(yellow(`  ${label}`));

  // 1. look up the order (forced tool call)
  step("1 look up the order (tool call)");
  const { orderId, order, usage: lookUpUsage } = await findOrder(email);
  count(lookUpUsage);
  handOffLog(JSON.stringify(order));
  if ("error" in order)
    return console.log(red(`\nheld back for a person > ${order.error}`));

  // 2. retrieve the refund policy: plain code. This is RAG in a small form: fetch the relevant
  //    document and put it in the next prompt. A real shop would search a vector store here.
  step("2 retrieve the refund policy (code)");
  const policy = searchPolicy("refund");
  handOffLog(policy);

  // 3. decide (model), then OUR CODE branches on its answer. Both paths meet again at step 4
  step("3 decide (model reads order + policy)");
  const { ruling, usage: decideUsage } = await decideRefund(
    email,
    order,
    policy,
  );
  count(decideUsage);
  let decision: string;
  if (ruling.eligible) {
    console.log(
      green(
        "      ✓ eligible: work out the amount (code), then process the refund (tool)",
      ),
    );
    decision = refundOrder(orderId!, order, ruling);
  } else {
    console.log(red("      ✗ not eligible: deny the return (code)"));
    decision = denyReturn(ruling);
  }
  handOffLog(decision);

  // 4. draft the reply from the facts of steps 1-3
  step("4 draft");
  const draft = await draftReply(
    email,
    `Order: ${JSON.stringify(order)}\nPolicy: ${policy}\nDecision: ${decision}`,
  );
  count(draft.usage);
  handOffLog(draft.reply);

  // 5. check the tone (model) and the length (code)
  step("5 check tone + length");
  const check = await checkReply(draft.reply);
  count(check.usage);

  console.log(
    check.ok
      ? green(`\nreply > ${draft.reply}`)
      : red(`\nheld back for a person > ${draft.reply}`),
  );
  console.log(
    dim(
      `      4 model calls (two of them forced tool calls) + code steps, ${tokens} tokens`,
    ),
  );
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

// The refund tool. In a real shop this would call the payment provider.
function processRefund(orderId: string, amount: number) {
  return { refundId: `R-${orderId}`, orderId, amount, status: "sent" };
}

const text = (r: Anthropic.Message) =>
  r.content.find((b) => b.type === "text")?.text ?? "";
// Print the exact value one step hands to the next
function handOffLog(value: string) {
  console.log(
    magenta(
      `      ↓ hands to the next step: ${value.replace(/\s+/g, " ").slice(0, 110)}`,
    ),
  );
}

const lookUpOrderTool: Anthropic.Tool = {
  name: "look_up_order",
  description: "Look up an order by its ID, such as A1042.",
  input_schema: {
    type: "object",
    properties: { orderId: { type: "string" } },
    required: ["orderId"],
  },
};

// Step 3's answer shape: the model fills these fields instead of writing free text
const decideRefundTool: Anthropic.Tool = {
  name: "decide_refund",
  description: "Record whether this return is allowed under the policy.",
  input_schema: {
    type: "object",
    properties: {
      eligible: { type: "boolean" },
      feePercent: {
        type: "number",
        description: "Restocking fee from the policy, 0 if none",
      },
      reason: {
        type: "string",
        description: "One sentence, quoting the rule that applies",
      },
    },
    required: ["eligible", "feePercent", "reason"],
  },
};

type Ruling = { eligible: boolean; feePercent: number; reason: string };
type Order = { item: string; deliveredDaysAgo: number; total: number };

// 1. look up the order: a tool call, but tool_choice FORCES this tool.
//    The model only reads the order ID out of the email; it does not decide what happens next.
async function findOrder(email: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" }, // no hidden reasoning: cheaper, and token counts stay comparable
    max_tokens: 100,
    tools: [lookUpOrderTool],
    tool_choice: { type: "tool", name: "look_up_order" },
    messages: [{ role: "user", content: email }],
  });
  const call = response.content.find((b) => b.type === "tool_use");
  const { orderId } = (call?.input ?? {}) as { orderId?: string };
  console.log(
    dim(`      model filled in look_up_order(${JSON.stringify(call?.input)})`),
  );
  return { orderId, order: lookUpOrder(orderId), usage: response.usage };
}

// 3. decide: the MODEL applies the retrieved policy to this order and this email.
//    It answers through a forced tool call, so the ruling comes back as fields our code can branch on.
async function decideRefund(email: string, order: Order, policy: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 200,
    system: `Decide if this return is allowed, using only this policy:\n${policy}\n\nOrder: ${JSON.stringify(order)}`,
    tools: [decideRefundTool],
    tool_choice: { type: "tool", name: "decide_refund" },
    messages: [{ role: "user", content: email }],
  });
  const ruling = response.content.find((b) => b.type === "tool_use")
    ?.input as Ruling;
  console.log(dim(`      model decided ${JSON.stringify(ruling)}`));
  return { ruling, usage: response.usage };
}

// 3a. eligible: money math stays in code (the model gave the fee, code does the arithmetic), then call the refund tool
function refundOrder(orderId: string, order: Order, ruling: Ruling) {
  const amount = Number(
    (order.total * (1 - ruling.feePercent / 100)).toFixed(2),
  );
  const refund = processRefund(orderId, amount);
  console.log(
    dim(
      `      process_refund(${orderId}, ${amount}) → ${JSON.stringify(refund)}`,
    ),
  );
  return `Refund ${refund.refundId} sent: $${amount} of $${order.total} (${ruling.feePercent}% fee). ${ruling.reason}`;
}

// 3b. not eligible: deny, and keep the model's reason for the reply
function denyReturn(ruling: Ruling) {
  return `Return denied. ${ruling.reason} The 1-year warranty still covers faults.`;
}

// 4. draft: gets the email plus only the facts from steps 1-3
async function draftReply(email: string, facts: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 400,
    system: `You are Lumen Audio support. Reply in under 100 words, plain text, using only these facts:\n${facts}`,
    messages: [{ role: "user", content: email }],
  });
  return { reply: text(response), usage: response.usage };
}

// 5. check: one small model call for the tone, and one rule we can test without a model (length)
async function checkReply(reply: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 60,
    system:
      "You review the TONE of support replies only, not the facts (those were checked already). Reply PASS if it is polite and clear, otherwise FAIL: <one short reason>.",
    messages: [{ role: "user", content: reply }],
  });
  const verdict = text(response).trim();
  const words = reply.split(/\s+/).length;
  console.log(
    dim(
      `      tone: ${verdict}   length: ${words} words ${words <= 120 ? "(ok)" : "(too long)"}`,
    ),
  );
  return {
    ok: verdict.startsWith("PASS") && words <= 120,
    usage: response.usage,
  };
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

const DEFECTIVE =
  "Hi, my Aria 500 from order A1044 arrived 3 days ago and the left ear cup is cracked. Can I send it back?";
const LATE_REFUND =
  "Hi, I'd like to return my Nova speaker, order A1043. It just isn't loud enough for my room.";

for (const email of [EASY_REFUND, DEFECTIVE, LATE_REFUND]) {
  title("Returns form email");
  console.log(cyan(email));
  await runChain(email);
}

console.log(
  dim(
    "\nAll three emails ran the same fixed steps. At step 3 the model applied the retrieved policy, and our code branched on its answer.",
  ),
);
console.log(
  dim(
    "The model judged (which order, which rule, which fee). Our code picked every step and did the money math.",
  ),
);
