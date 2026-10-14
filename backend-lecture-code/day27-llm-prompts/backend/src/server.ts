import express from "express";
import { chatRoute } from "./routes/chat";
import { chatStreamRoute } from "./routes/chat-stream";
import { extractEventRoute } from "./routes/extract-event";
import { evalRoute } from "./routes/eval";

const app = express();
app.use(express.json());

app.post("/api/chat", chatRoute);
app.post("/api/chat-stream", chatStreamRoute);
app.post("/api/extract-event", extractEventRoute);
app.post("/api/eval", evalRoute);

app.listen(3001, () => console.log("Backend on http://localhost:3001"));
