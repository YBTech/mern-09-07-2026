import express from "express";
import { Command } from "@langchain/langgraph";
import { AIMessage, AIMessageChunk, HumanMessage } from "langchain";
import { graph } from "./graph";
import { cartTotal } from "./shop";

// Three routes. All the agent logic is in graph.ts; this file only moves messages in and events out.
const app = express();
app.use(express.json());

type Res = express.Response;
const send = (res: Res, event: string, data: unknown) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
const textOf = (content: unknown) =>
  typeof content === "string" ? content : Array.isArray(content) ? content.map((b) => b?.text ?? "").join("") : "";

// Which model calls write text the customer reads. "model_request" is the model step INSIDE the order agent.
// (classify also streams text, but it is JSON for our code, so it is not on this list.)
const SPEAKING_NODES = ["answer", "model_request"];

// Streaming: one chat message → the graph runs → Server-Sent Events: which node ran, the reply as it is written, and the end state
app.post("/api/chat", async (req, res) => {
  const { threadId, message } = req.body as { threadId?: string; message?: string };
  if (!threadId || !message?.trim()) return void res.status(400).json({ error: "threadId and message are required" });

  // Human in the loop: a paused checkout must be answered first: the thread is waiting on a Confirm / Cancel
  if ((await pendingApproval(threadId)) !== null) return void res.status(409).json({ error: "Answer the pending checkout first" });

  await runGraph(res, threadId, { messages: [new HumanMessage(message)] });
});

// Human in the loop: the customer pressed Confirm or Cancel → resume the paused graph with their answer
app.post("/api/chat/resume", async (req, res) => {
  const { threadId, approved } = req.body as { threadId?: string; approved?: boolean };
  if (!threadId || typeof approved !== "boolean") return void res.status(400).json({ error: "threadId and approved are required" });
  if ((await pendingApproval(threadId)) === null) return void res.status(409).json({ error: "Nothing is waiting for approval" });

  await runGraph(res, threadId, new Command({ resume: approved }));
});

// Persistence: on a page reload (or after a server restart), rebuild the chat from the checkpoint the graph already saved
app.get("/api/chat/:threadId", async (req, res) => {
  const state = await graph.getState({ configurable: { thread_id: req.params.threadId } });
  const messages = (state.values.messages ?? []).flatMap((m: unknown) =>
    HumanMessage.isInstance(m)
      ? [{ role: "user", content: textOf(m.content) }]
      : AIMessage.isInstance(m)
        ? [{ role: "assistant", content: textOf(m.content) }]
        : [],
  );
  const cart = state.values.cart ?? [];
  res.json({ messages, cart, total: cartTotal(cart), pending: await pendingApproval(req.params.threadId) });
});

async function runGraph(res: Res, threadId: string, input: Parameters<typeof graph.stream>[0]) {
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  // thread_id picks which saved conversation the graph loads and updates
  const config = { configurable: { thread_id: threadId }, streamMode: ["updates", "messages"] as ("updates" | "messages")[] };

  try {
    // Consume the graph's stream: it yields events while the graph runs, and we forward each one to the browser
    for await (const [mode, chunk] of await graph.stream(input, config)) {
      // A node just finished: tell the UI which one (this feeds the "classify → answer" path under each reply)
      if (mode === "updates") {
        for (const node of Object.keys(chunk)) if (!node.startsWith("__")) send(res, "node", { node });
      }
      // The model wrote a piece of text: forward it as a token (only from nodes the customer reads, not classify)
      if (mode === "messages") {
        const [piece, meta] = chunk as [unknown, { langgraph_node?: string }];
        const text = AIMessageChunk.isInstance(piece) ? textOf(piece.content) : "";
        if (text && SPEAKING_NODES.includes(meta.langgraph_node ?? "")) send(res, "token", { text });
      }
    }
    // The stream has ended: read the saved end state and send the closing event (done, or interrupt if checkout is paused)
    const state = await graph.getState({ configurable: { thread_id: threadId } });
    const pending = await pendingApproval(threadId);
    // `reply` is the final text, so the UI can replace anything partial it streamed (e.g. "Let me add that…" before a tool call)
    const last = state.values.messages?.at(-1);
    const reply = !pending && AIMessage.isInstance(last) ? textOf(last.content) : null;
    const cart = state.values.cart ?? [];
    send(res, pending ? "interrupt" : "done", { cart, total: cartTotal(cart), pending, reply });
  } catch (error) {
    console.error(error);
    send(res, "error", { message: error instanceof Error ? error.message : String(error) });
  }
  res.end();
}

// Human in the loop: is this thread paused at an interrupt()? If so, return what it is asking.
async function pendingApproval(threadId: string) {
  const state = await graph.getState({ configurable: { thread_id: threadId } });
  const interrupted = state.tasks.flatMap((task) => task.interrupts)[0];
  return interrupted ? (interrupted.value as { question: string; cart: unknown[]; total: number }) : null;
}

app.listen(3031, () => console.log("Pizza API on http://localhost:3031"));
