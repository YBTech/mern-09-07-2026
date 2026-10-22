import { StateGraph, StateSchema, MessagesValue, START, END } from "@langchain/langgraph";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
import { createAgent, initChatModel, tool } from "langchain";
import { mkdirSync } from "node:fs";
import { z } from "zod";
import { cartTools } from "../cart-tools";
import { MENU_TEXT, ORDERS, OrderItem, saveOrder } from "../shop";

// ════════════════════════════════════════════════════════════════════════════════════════════════
// Agent v1: built on vibes.
// One agent, one friendly prompt, every tool. We tried it ourselves ("two pepperonis", "where's my order?")
// and it worked great, so we shipped it. Then real customers arrived. Its problems:
//
//   1. No shop documents (no RAG). It only knows prices, so allergy and FAQ questions are answered
//      from the model's general knowledge: confident, and sometimes wrong.
//   2. No topic guard. "Help the customer with whatever they ask" means it will write a React component.
//   3. lookup_order returns the WHOLE order record, so it reads out a stranger's name, phone and address.
//   4. place_order charges the card as soon as the customer says "check out". Nobody confirms anything.
// ════════════════════════════════════════════════════════════════════════════════════════════════

const model = await initChatModel("anthropic:claude-haiku-5-5", { thinking: { type: "disabled" }, maxTokens: 800 });

const SYSTEM_PROMPT = `You are a friendly, helpful assistant for Slice Pizza. Help the customer with whatever they ask.

Menu:
${MENU_TEXT}`;

// Problem 3: returns everything we store about the order, personal details included
const lookupOrder = tool(async ({ orderId }) => JSON.stringify(ORDERS[orderId.toUpperCase()] ?? "No such order"), {
  name: "lookup_order",
  description: "Look up an order by its number, like S-1001.",
  schema: z.object({ orderId: z.string() }),
});

// Problem 4: the model decides when to charge the card, with no confirmation step
function placeOrderTool(cart: OrderItem[]) {
  return tool(
    async () => {
      if (cart.length === 0) return "The cart is empty.";
      const orderId = saveOrder(cart);
      cart.splice(0);
      return `Order ${orderId} placed and the card was charged.`;
    },
    { name: "place_order", description: "Place the order and charge the customer's card.", schema: z.object({}) },
  );
}

// The same state shape as v2 (messages + cart), so the server and the evals can talk to either agent
const State = new StateSchema({
  messages: MessagesValue,
  cart: z.array(OrderItem).default(() => []),
});

mkdirSync("runs", { recursive: true });

export const agentV1 = new StateGraph(State)
  .addNode("agent", runAgent)
  .addEdge(START, "agent")
  .addEdge("agent", END)
  .compile({ checkpointer: SqliteSaver.fromConnString("runs/v1.db") });

// The whole "design": hand the conversation to one agent with every tool, and let it figure things out
async function runAgent(state: typeof State.State, config: LangGraphRunnableConfig) {
  const cart = [...state.cart];
  const agent = createAgent({
    model,
    tools: [...cartTools(cart), lookupOrder, placeOrderTool(cart)] as const,
    systemPrompt: SYSTEM_PROMPT,
  });
  const result = await agent.invoke({ messages: state.messages }, config);
  return { cart, messages: [result.messages.at(-1)!] };
}
