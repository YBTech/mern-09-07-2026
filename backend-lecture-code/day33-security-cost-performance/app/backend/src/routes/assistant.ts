import { Router } from "express";
import { articles, orders } from "../db.js";
import { runAssistant, type Guards } from "../demos/assistant.js";
import { sendFailure } from "./util.js";

// The store assistant demo: its chat endpoint, plus CRUD for the knowledge base (RAG) and the orders (tool data).

// ── the chat: POST /api/assistant/chat { message, guards } ──
export const chatRouter = Router();
chatRouter.post("/", async (req, res) => {
  const message = String(req.body.message ?? "").trim();
  if (!message) {
    res.status(400).json({ error: "Send a message" });
    return;
  }
  const g = req.body.guards ?? {};
  const guards: Guards = {
    keywordFilter: !!g.keywordFilter,
    intentJudge: !!g.intentJudge,
    ragScreen: !!g.ragScreen,
    toolScreen: !!g.toolScreen,
    outputGuard: !!g.outputGuard,
  };
  try {
    res.json(await runAssistant(message, guards));
  } catch (error) {
    sendFailure(res, error);
  }
});

// ── the knowledge base (articles): the RAG channel ──
export const kbRouter = Router();
kbRouter.get("/", (_req, res) => res.json(articles.list()));
kbRouter.post("/reset", (_req, res) => {
  articles.reset();
  res.json(articles.list());
});
kbRouter.post("/", (req, res) => {
  const title = String(req.body.title ?? "").trim();
  const body = String(req.body.body ?? "").trim();
  if (!title || !body) {
    res.status(400).json({ error: "An article needs a title and some text" });
    return;
  }
  res.status(201).json(articles.create(title, body));
});
kbRouter.put("/:id", (req, res) => {
  const title = String(req.body.title ?? "").trim();
  const body = String(req.body.body ?? "").trim();
  const updated = title && body ? articles.update(Number(req.params.id), title, body) : undefined;
  if (!updated) {
    res.status(title && body ? 404 : 400).json({ error: title && body ? "No such article" : "An article needs a title and some text" });
    return;
  }
  res.json(updated);
});
kbRouter.delete("/:id", (req, res) => res.status(articles.remove(Number(req.params.id)) ? 200 : 404).json({ deleted: true }));

// ── the orders (tool data): the tool-output channel. Only the note is editable (that's the poisonable field). ──
export const ordersRouter = Router();
ordersRouter.get("/", (_req, res) => res.json(orders.list()));
ordersRouter.post("/reset", (_req, res) => {
  orders.reset();
  res.json(orders.list());
});
ordersRouter.put("/:id", (req, res) => {
  const existing = orders.getById(Number(req.params.id));
  if (!existing) {
    res.status(404).json({ error: "No such order" });
    return;
  }
  const note = String(req.body.note ?? "");
  res.json(orders.update(existing.id, existing.order_id, existing.item, existing.status, note));
});
