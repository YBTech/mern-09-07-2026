import express from "express";
import { MODEL } from "./ask.js";
import { assistantInfo } from "./demos/assistant.js";
import { invoice } from "./demos/invoice.js";
import { translate } from "./demos/translate.js";
import { chatRouter, kbRouter, ordersRouter } from "./routes/assistant.js";
import { router as commentsRouter } from "./routes/comments.js";
import { router as invoicesRouter } from "./routes/invoices.js";

const app = express();
app.use(express.json());

// The home page lists the three demos in this order
app.get("/api/demos", (_req, res) => {
  res.json({ model: MODEL, demos: [translate.info, assistantInfo, invoice.info] });
});

app.use("/api/comments", commentsRouter); // translate: a comment section
app.use("/api/invoices", invoicesRouter); // invoice: accounts payable
app.use("/api/assistant/chat", chatRouter); // assistant: the chatbot + guardrail pipeline
app.use("/api/kb", kbRouter); // assistant: the RAG knowledge base
app.use("/api/orders", ordersRouter); // assistant: the orders a tool looks up

const PORT = Number(process.env.PORT ?? 3034);
app.listen(PORT, () => console.log(`Injection demos on http://localhost:${PORT}  (model: ${MODEL})`));
