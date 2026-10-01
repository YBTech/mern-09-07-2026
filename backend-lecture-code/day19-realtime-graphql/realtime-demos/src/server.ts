// Four real-time features, each built with the mechanism that fits it.
//
//   short polling   GET  /metrics                      monitoring dashboard   (metrics.ts)
//   short polling   GET  /notifications?since=…        notification bell      (notifications.ts)
//   long polling    GET  /notifications/poll?since=…   the same bell, held    (notifications.ts)
//   WebSocket       ws://localhost:4600/chat?user=…    chat room              (chat.ts)
//   SSE             GET  /match/events                 live match commentary  (match.ts)
//
//   GET /stats, POST /stats/reset    what each mechanism costs the server
import express from "express";
import { createServer } from "node:http";
import { attachChat } from "./chat";
import { matchRouter } from "./match";
import { metricsRouter } from "./metrics";
import { notificationsRouter } from "./notifications";
import { resetStats, stats } from "./stats";

const PORT = Number(process.env.PORT ?? 4600);

const app = express();

// The lecture page runs on another port.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type, last-event-id");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});
app.use(express.json());

app.use(metricsRouter);
app.use(notificationsRouter);
app.use(matchRouter);

app.get("/stats", (_req, res) => {
  res.json(stats);
});

app.post("/stats/reset", (_req, res) => {
  resetStats();
  res.json(stats);
});

// WebSocket shares the same HTTP server and port: it starts life as an HTTP
// request asking to "upgrade" the connection.
const server = createServer(app);
attachChat(server);

server.listen(PORT, () => console.log(`realtime-demos on http://localhost:${PORT} (chat WebSocket at ws://localhost:${PORT}/chat)`));
