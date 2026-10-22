import { HumanMessage } from "langchain";
import { Intent, classify, orderStatus, placeOrder } from "../src/agents/v2";
import type { State } from "../src/agents/v2";
import { cartTools } from "../src/cart-tools";
import { retriever } from "../src/knowledge";
import { ORDERS } from "../src/shop";
import type { OrderItem } from "../src/shop";
import { saveReport } from "./report";
import type { Row } from "./report";
import { finish } from "./run-agent";

// 04 · NODE EVALUATORS (one step at a time)
// Files 01–03 run the whole agent end to end, like E2E tests: when one fails you know THAT something broke.
// This file tests the steps on their own, like unit tests: one input in, one output out, no other steps.
// Most of them use no model at all, so they are instant, free and always give the same answer.
// When one fails, you know exactly WHICH step is broken. These test agent v2's steps (v1 is one big agent, so
// it has no separate steps to test).

let total = 0;
let passed = 0;
const rows: Row[] = [];

// A minimal conversation state: one customer message, an empty cart
const stateFor = (message: string): State => ({ messages: [new HumanMessage(message)], intent: undefined, cart: [], confirmed: false });

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. The router (classify node): uses a model. Checks the output's shape (schema) and the route (exact match).
// ─────────────────────────────────────────────────────────────────────────────────────────────────
console.log("\nROUTER · classify node\n");

const routerTasks = [
  { message: "Is the Margherita vegetarian?", expectedIntent: "question" },
  { message: "Two large pepperonis please", expectedIntent: "order" },
  { message: "Actually, remove the coke", expectedIntent: "order" },
  { message: "That's everything, I'm ready to pay", expectedIntent: "checkout" },
  { message: "Where is my order S-1002?", expectedIntent: "order_status" },
  { message: "Write me a poem about cats", expectedIntent: "off_topic" },
];

for (const task of routerTasks) {
  const output = await classify(stateFor(task.message));

  const validShape = Intent.safeParse(output).success; // schema: the shape the rest of the graph expects
  const rightIntent = output.intent === task.expectedIntent; // exact match: the right route
  const pass = validShape && rightIntent;

  total++;
  if (pass) passed++;
  console.log(`${pass ? "✅" : "❌"} "${task.message}" → ${output.intent}${rightIntent ? "" : ` (wanted ${task.expectedIntent})`}`);
  rows.push({ kind: "Router", task: task.message, pass, score: `→ ${output.intent}`, detail: `Wanted: ${task.expectedIntent}` });
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. The retrieval step (the RAG search): no model. Does the search find the chunk that holds the answer?
//    When an answer is wrong, this separates "the search missed it" from "the model ignored it".
// ─────────────────────────────────────────────────────────────────────────────────────────────────
console.log("\nRETRIEVAL · the RAG search (top 3 chunks)\n");

const retrievalTasks = [
  { question: "I have coeliac disease, can I have the gluten-free crust?", mustFind: "NOT safe for people with coeliac disease" },
  { question: "Is the Veggie Garden safe for a nut allergy?", mustFind: "pine nuts" },
  { question: "What if my pizza arrives late?", mustFind: "more than 60 minutes" },
  { question: "How much is delivery?", mustFind: "$3.99" },
];

for (const task of retrievalTasks) {
  const chunks = await retriever.invoke(task.question);
  const pass = chunks.some((chunk) => chunk.pageContent.includes(task.mustFind));

  total++;
  if (pass) passed++;
  console.log(`${pass ? "✅" : "❌"} "${task.question}" → ${pass ? "found" : "MISSED"} "${task.mustFind}"`);
  rows.push({
    kind: "Retrieval",
    task: task.question,
    pass,
    score: pass ? "found" : "MISSED",
    detail: `Must find: ${task.mustFind}\n\nTop 3 chunks:\n${chunks.map((chunk) => "• " + chunk.pageContent.slice(0, 120).replace(/\n/g, " ")).join("\n")}`,
  });
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. The cart tools: no model. Call the tool function directly with fixed arguments, then check the cart.
//    (In the full agent, the model decides when to call these. Here we test only what each tool does.)
// ─────────────────────────────────────────────────────────────────────────────────────────────────
console.log("\nTOOLS · cart tools called directly\n");

const toolTasks = [
  {
    name: "add_to_cart adds a line",
    calls: [{ tool: "add_to_cart", args: { item: "pepperoni", size: "large", quantity: 2 } }],
    expectedCart: ["2 large pepperoni"],
  },
  {
    name: "adding the same pizza twice merges the quantities",
    calls: [
      { tool: "add_to_cart", args: { item: "pepperoni", size: "large", quantity: 2 } },
      { tool: "add_to_cart", args: { item: "pepperoni", size: "large", quantity: 1 } },
    ],
    expectedCart: ["3 large pepperoni"],
  },
  {
    name: "add_to_cart rejects an item that is not on the menu",
    calls: [{ tool: "add_to_cart", args: { item: "hawaiian", size: "large", quantity: 1 } }],
    expectedCart: [],
  },
  {
    name: "remove_from_cart removes the item",
    calls: [
      { tool: "add_to_cart", args: { item: "coke", quantity: 1 } },
      { tool: "remove_from_cart", args: { item: "coke" } },
    ],
    expectedCart: [],
  },
];

for (const task of toolTasks) {
  const cart: OrderItem[] = [];
  const tools = cartTools(cart);

  for (const call of task.calls) {
    // (the cast just tells TypeScript that every tool can be invoked with a plain object)
    const tool = tools.find((t) => t.name === call.tool) as unknown as { invoke: (args: object) => Promise<string> };
    await tool.invoke(call.args);
  }

  const actualCart = cart.map((line) => `${line.quantity} ${line.size ? line.size + " " : ""}${line.item}`);
  const pass = JSON.stringify(actualCart) === JSON.stringify(task.expectedCart);

  total++;
  if (pass) passed++;
  console.log(`${pass ? "✅" : "❌"} ${task.name}${pass ? "" : ` → cart was ${JSON.stringify(actualCart)}`}`);
  rows.push({ kind: "Tool", task: task.name, pass, score: JSON.stringify(actualCart), detail: `Wanted cart: ${JSON.stringify(task.expectedCart)}` });
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 4. Plain-code nodes (orderStatus, placeOrder): no model. A node is just a function, so call it.
// ─────────────────────────────────────────────────────────────────────────────────────────────────
console.log("\nPLAIN-CODE NODES · orderStatus and placeOrder\n");

// orderStatus: returns the status only, never the customer's personal details (expected values come from the order data)
const order = ORDERS["S-1003"];
const statusOutput = await orderStatus(stateFor("Where is order S-1003?"));
const statusReply = String(statusOutput.messages[0].content);
const statusPass =
  statusReply.includes(order.status) &&
  !statusReply.includes(order.customer.name) &&
  !statusReply.includes(order.customer.phone) &&
  !statusReply.includes(order.customer.address);
total++;
if (statusPass) passed++;
console.log(`${statusPass ? "✅" : "❌"} orderStatus returns the status and no personal details`);
rows.push({ kind: "Plain code", task: "orderStatus returns the status and no personal details", pass: statusPass, reply: statusReply });

// orderStatus: an unknown order number is handled, not a crash
const unknownOutput = await orderStatus(stateFor("Where is order S-9999?"));
const unknownPass = String(unknownOutput.messages[0].content).includes("couldn't find");
total++;
if (unknownPass) passed++;
console.log(`${unknownPass ? "✅" : "❌"} orderStatus handles an order number that does not exist`);
rows.push({ kind: "Plain code", task: "orderStatus handles an order number that does not exist", pass: unknownPass, reply: String(unknownOutput.messages[0].content) });

// placeOrder: saves exactly one new order, and empties the cart
const ordersBefore = Object.keys(ORDERS).length;
const placeState = { ...stateFor("yes"), cart: [{ item: "pepperoni", size: "large" as const, quantity: 2 }] };
const placeOutput = await placeOrder(placeState);
const placePass = Object.keys(ORDERS).length === ordersBefore + 1 && placeOutput.cart.length === 0;
total++;
if (placePass) passed++;
console.log(`${placePass ? "✅" : "❌"} placeOrder saves exactly one order and empties the cart`);
rows.push({ kind: "Plain code", task: "placeOrder saves exactly one order and empties the cart", pass: placePass });

console.log(`\n${passed} / ${total} passed`);
saveReport("node", rows, "v2"); // these tests call v2's steps directly, whatever AGENT_VERSION is
await finish();
