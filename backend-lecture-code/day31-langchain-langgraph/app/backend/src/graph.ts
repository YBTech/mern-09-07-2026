import { StateGraph, StateSchema, MessagesValue, START, END, interrupt } from "@langchain/langgraph";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
import { AIMessage, SystemMessage, createAgent, initChatModel, modelCallLimitMiddleware, tool } from "langchain";
import { mkdirSync } from "node:fs";
import { z } from "zod";
import { retriever } from "./knowledge";
import { MENU_TEXT, ORDERS, OrderItem, cartTotal, describeCart, nextOrderId, priceOf } from "./shop";

// The whole chatbot is this one graph. LangGraph decides WHAT RUNS NEXT; LangChain parts do the work inside each node.
// Read it top to bottom: state → graph (the drawing) → nodes (the work) → tools.
//
//   START → classify ─┬─ question     → answer (RAG) ────────────────────────┐
//                     ├─ order        → orderAgent (agent loop) ─────────────┤
//                     ├─ checkout     → confirm (human approval) → placeOrder ┼→ END
//                     │                                         └→ cancel ───┤
//                     └─ order_status → orderStatus (plain code) ────────────┘

// LangChain: one model interface. Haiku everywhere, thinking off (cheap, fast, predictable for a demo)
const model = await initChatModel("anthropic:claude-haiku-5-5", {
  thinking: { type: "disabled" },
  maxTokens: 500, 
});

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: state and the graph
// ════════════════════════════════════════════════════════════════════════════════════════════════

// Graph state: the one object every node reads. A node returns only the keys it changes.
export const PizzaState = new StateSchema({
  messages: MessagesValue, // reducer: new messages are appended to the list
  intent: z.enum(["question", "order", "checkout", "order_status"]).optional(), // last write wins
  cart: z.array(OrderItem).default(() => []), // last write wins: a node returns the whole new cart
  confirmed: z.boolean().default(false), // the customer's answer at checkout
});
type State = typeof PizzaState.State;

// Persistence: the checkpointer saves the state after every node, keyed by thread_id (one id per chat).
// Restart the server and every chat, cart and pending approval is still there.
mkdirSync("runs", { recursive: true });
const checkpointer = SqliteSaver.fromConnString("runs/app.db");

// Workflow: nodes are the steps, edges are the arrows between them
export const graph = new StateGraph(PizzaState)
  .addNode("classify", classify)
  .addNode("answer", answer)
  .addNode("orderAgent", orderAgent)
  .addNode("confirm", confirm)
  .addNode("placeOrder", placeOrder)
  .addNode("cancel", cancel)
  .addNode("orderStatus", orderStatus)
  .addEdge(START, "classify")
  // Routing (workflow pattern): the classifier's answer picks the path. Our code decides, not the model.
  .addConditionalEdges("classify", routeByIntent, ["answer", "orderAgent", "confirm", "orderStatus"])
  // Human in the loop: the answer at checkout picks "place" or "cancel"
  .addConditionalEdges("confirm", (state) => (state.confirmed ? "placeOrder" : "cancel"), ["placeOrder", "cancel"])
  .addEdge("answer", END)
  .addEdge("orderAgent", END)
  .addEdge("placeOrder", END)
  .addEdge("cancel", END)
  .addEdge("orderStatus", END)
  .compile({ checkpointer });

function routeByIntent(state: State) {
  // Guardrail in code: checking out an empty cart never reaches the payment steps
  if (state.intent === "checkout" && state.cart.length === 0) return "answer";
  const next = { question: "answer", order: "orderAgent", checkout: "confirm", order_status: "orderStatus" } as const;
  return next[state.intent!];
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Nodes (skim): each one is a function that takes the state and returns an update
// ════════════════════════════════════════════════════════════════════════════════════════════════

const lastText = (state: State) => String(state.messages.at(-1)?.content ?? "");
const recent = (state: State, count: number) => state.messages.slice(-count);

// Structured output + routing: the model fills a zod schema, our code branches on the result
async function classify(state: State) {
  const Intent = z.object({
    intent: z.enum(["question", "order", "checkout", "order_status"]).describe(
      "order = add or remove items, or change the cart. checkout = they are ready to pay or place the order. " +
        "order_status = where is an order that was already placed. question = anything else: menu, allergens, hours, delivery, cart contents.",
    ),
  });
  // method "jsonSchema" = the provider's native structured output. (The default tool-call method fails when
  // the graph streams tokens in this version, because it tries to parse the empty first chunk.)
  const { intent } = await model.withStructuredOutput(Intent, { method: "jsonSchema" }).invoke([
    new SystemMessage("Classify the customer's LAST message in this pizza-shop chat."),
    ...recent(state, 4),
  ]);
  return { intent };
}

// RAG: retrieve the chunks closest to the question, then generate an answer from only those chunks
async function answer(state: State, config: LangGraphRunnableConfig) {
  const chunks = await retriever.invoke(lastText(state));
  const sources = chunks.map((c) => c.pageContent).join("\n---\n");
  const reply = await model.invoke(
    [
      new SystemMessage(
        "You are Slice Pizza's order bot. Answer in one to three short sentences, using only the facts below. " +
          "If the facts do not cover it, say you are not sure.\n\n" +
          `Prices:\n${MENU_TEXT}\n\nCustomer's cart: ${describeCart(state.cart)}\n\nShop documents:\n${sources}`,
      ),
      ...recent(state, 6),
    ],
    config,
  );
  return { messages: [reply] };
}

// Agentic loop: createAgent runs model → tools → model → … until the model has nothing left to ask for
async function orderAgent(state: State, config: LangGraphRunnableConfig) {
  const cart = [...state.cart]; // the tools below edit this copy; we hand it back as the new cart
  const agent = createAgent({
    model,
    tools: cartTools(cart),
    systemPrompt:
      "You manage the cart for Slice Pizza. Use the tools for every change; never guess prices or totals. " +
      "If a size is missing for a pizza, ask which size. Reply in one or two short sentences.",
    // Guardrail: a hard cap on model calls, so a confused agent cannot loop forever
    middleware: [modelCallLimitMiddleware({ runLimit: 6 })],
  });
  const result = await agent.invoke({ messages: recent(state, 8) }, config);
  return { cart, messages: [result.messages.at(-1)!] };
}

// Human in the loop: interrupt() saves a checkpoint and pauses here until the customer answers.
// When it resumes, this whole node runs again from the top, so nothing with a side effect goes above the interrupt().
async function confirm(state: State) {
  const approved = interrupt({
    question: "Place this order?",
    cart: state.cart,
    total: cartTotal(state.cart),
  });
  return { confirmed: approved === true };
}

// Plain code step: the side effect (charging the card) lives AFTER the approval, in its own node
async function placeOrder(state: State) {
  const orderId = nextOrderId();
  const total = cartTotal(state.cart);
  ORDERS[orderId] = "in the oven, about 20 minutes to go";
  console.log(`💳 charged $${total.toFixed(2)} for ${orderId}`);
  return {
    cart: [],
    messages: [new AIMessage(`Order ${orderId} is placed: ${describeCart(state.cart)}. It's ${ORDERS[orderId]}.`)],
  };
}

async function cancel() {
  return { messages: [new AIMessage("No problem, I haven't charged anything. Your cart is still here if you change your mind.")] };
}

// Plain code step: no model at all. A node is just a function.
async function orderStatus(state: State) {
  const id = lastText(state).match(/S-\d{4}/i)?.[0].toUpperCase();
  const status = id ? ORDERS[id] : undefined;
  const text = status ? `Order ${id} is ${status}.` : "I couldn't find that order. Send me the order number, like S-1001.";
  return { messages: [new AIMessage(text)] };
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🧰 Tools (skim): what the order agent is allowed to do
// ════════════════════════════════════════════════════════════════════════════════════════════════

// Tool calling: each tool is a function + a description + a zod input schema. Prices and the cart stay in code.
function cartTools(cart: OrderItem[]) {
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

