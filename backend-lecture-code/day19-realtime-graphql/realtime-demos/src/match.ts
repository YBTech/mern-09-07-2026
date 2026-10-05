// The server streams, the browser only listens: live match commentary over SSE.
//
//   GET  /match            plain request: the score right now (the stale page)
//   GET  /match/events     SSE: every event so far, then each new one as it happens
//   POST /match/start      kick off: one scripted event every STEP_MS
//   POST /match/drop       cut every open stream, to show the browser reconnecting
//                          and the server replaying what it missed (Last-Event-ID)
import { EventEmitter } from "node:events";
import { Router, type Response } from "express";
import { stats } from "./stats";

export type MatchEvent = { id: number; minute: number; text: string; score: string };

const STEP_MS = Number(process.env.STEP_MS ?? 2500);
// Tell the browser to wait this long before reconnecting, so a dropped stream
// visibly misses an event or two that then get replayed.
const RETRY_MS = 4000;

const SCRIPT: Omit<MatchEvent, "id">[] = [
  { minute: 0, text: "Kick-off", score: "0–0" },
  { minute: 12, text: "Chance! A header just wide", score: "0–0" },
  { minute: 23, text: "GOAL! Silva curls it into the top corner", score: "1–0" },
  { minute: 35, text: "Yellow card for Becker", score: "1–0" },
  { minute: 41, text: "GOAL! Okafor equalises", score: "1–1" },
  { minute: 45, text: "Half-time", score: "1–1" },
  { minute: 58, text: "Save! The keeper tips it over the bar", score: "1–1" },
  { minute: 67, text: "GOAL! Silva again", score: "2–1" },
  { minute: 80, text: "Substitution: Reds bring on Park", score: "2–1" },
  { minute: 90, text: "Full time", score: "2–1" },
];

let events: MatchEvent[] = [];
let timer: NodeJS.Timeout | undefined;
const feed = new EventEmitter();
feed.setMaxListeners(0); // one listener per open stream
const openStreams = new Set<Response>();

function startMatch() {
  clearInterval(timer);
  events = [];
  let next = 0;
  const publish = () => {
    const event = { id: next + 1, ...SCRIPT[next] };
    events.push(event);
    console.log(`⚽ ${event.minute}' ${event.text} (${event.score})`);
    feed.emit("event", event);
    next++;
    if (next === SCRIPT.length) clearInterval(timer);
  };
  publish();
  timer = setInterval(publish, STEP_MS);
}

export const matchRouter = Router();

// ── Plain request: whatever is true right now, and then nothing ─────────────
matchRouter.get("/match", (_req, res) => {
  stats.matchPlainRequests++;
  const last = events.at(-1);
  res.json({ score: last?.score ?? "0–0", minute: last?.minute ?? 0, started: events.length > 0 });
});

// ── SSE: one response, written to for as long as the browser listens ──────
matchRouter.get("/match/events", (req, res) => {
  stats.matchStreamsOpen++;
  stats.matchStreamsOpened++;
  openStreams.add(res);

  res.writeHead(200, {
    "Content-Type": "text/event-stream", // tells the browser: this is an SSE stream
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write(`retry: ${RETRY_MS}\n\n`);

  // Each event is "id:" and "data:" lines, ended by a blank line.
  // The id is what the browser sends back as Last-Event-ID when it reconnects.
  const send = (event: MatchEvent, replayed = false) => {
    stats.matchEventsSent++;
    if (replayed) stats.matchEventsReplayed++;
    res.write(`id: ${event.id}\ndata: ${JSON.stringify({ ...event, replayed })}\n\n`);
  };

  // Reconnecting? The browser says which event it saw last: replay everything after it.
  // First visit (or an id from a match that has since restarted)? Send everything so far,
  // so the page starts with the current state.
  const lastId = req.headers["last-event-id"];
  if (lastId !== undefined && Number(lastId) <= events.length) {
    const missed = events.filter((e) => e.id > Number(lastId));
    console.log(`↻ stream reconnected after #${lastId}: replaying ${missed.length}`);
    missed.forEach((e) => send(e, true));
  } else {
    events.forEach((e) => send(e));
  }

  const onEvent = (event: MatchEvent) => send(event);
  feed.on("event", onEvent);

  // A comment line every 15 s keeps proxies from closing an "idle" connection.
  const heartbeat = setInterval(() => res.write(": keep-alive\n\n"), 15_000);

  res.on("close", () => {
    stats.matchStreamsOpen--;
    openStreams.delete(res);
    feed.off("event", onEvent);
    clearInterval(heartbeat);
  });
});

// ── Lecture controls ────────────────────────────────────────────────────────
matchRouter.post("/match/start", (_req, res) => {
  startMatch();
  res.json({ started: true, stepMs: STEP_MS });
});

matchRouter.post("/match/drop", (_req, res) => {
  const dropped = openStreams.size;
  for (const stream of openStreams) stream.end(); // the browser sees the stream end, and reconnects
  console.log(`✂️  dropped ${dropped} stream(s)`);
  res.json({ dropped, reconnectAfterMs: RETRY_MS });
});
