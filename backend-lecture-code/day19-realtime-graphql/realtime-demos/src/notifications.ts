// Rare, unpredictable updates: a notification bell, served two ways.
//
//   GET  /notifications?since=3        short polling: answers at once, usually with []
//   GET  /notifications/poll?since=3   long polling: held open until there's news (or 25 s → 204)
//   POST /notifications                someone comments / likes / follows (body: { text? })
//   POST /jobs/export                  a background job; its "done" arrives as a notification
//
// Both bells see the same notifications. The difference is what it costs to see them.
import { EventEmitter } from "node:events";
import { Router } from "express";
import { stats } from "./stats";

export type Notification = { id: number; text: string; at: string };

const LONG_POLL_TIMEOUT_MS = 25_000;
const JOB_MS = Number(process.env.JOB_MS ?? 15_000);

const SOMEONE_DID_SOMETHING = [
  "Ana commented on your post",
  "Ben liked your photo",
  "Chen started following you",
  "Dana replied to your comment",
  "Eli mentioned you in a thread",
];

const notifications: Notification[] = [];
const news = new EventEmitter();
news.setMaxListeners(0); // one listener per held long poll

function addNotification(text: string): Notification {
  const notification = { id: notifications.length + 1, text, at: new Date().toISOString() };
  notifications.push(notification);
  console.log(`🔔 #${notification.id} ${text}`);
  news.emit("new", notification);
  return notification;
}

const after = (since: number) => notifications.filter((n) => n.id > since);

export const notificationsRouter = Router();

// ── Short polling: answer right now, even if the answer is "nothing" ────────
notificationsRouter.get("/notifications", (req, res) => {
  stats.bellShortRequests++;
  const fresh = after(Number(req.query.since ?? 0));
  if (fresh.length === 0) stats.bellShortEmpty++;
  res.json(fresh);
});

// ── Long polling: hold the request until there's news ──────────────────────
notificationsRouter.get("/notifications/poll", (req, res) => {
  stats.bellLongRequests++;

  // Already something newer than what the browser has? Answer straight away.
  const fresh = after(Number(req.query.since ?? 0));
  if (fresh.length > 0) {
    res.json(fresh);
    return;
  }

  // Otherwise park the request. Whichever comes first ends it:
  // a new notification, the timeout, or the browser going away.
  stats.bellLongOpen++;
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    stats.bellLongOpen--;
    clearTimeout(timer);
    news.off("new", onNew);
  };
  const onNew = (notification: Notification) => {
    finish();
    res.json([notification]);
  };
  const timer = setTimeout(() => {
    finish();
    res.status(204).end(); // "nothing new" — the browser just asks again
  }, LONG_POLL_TIMEOUT_MS);

  news.on("new", onNew);
  res.on("close", finish); // tab closed, navigated away
});

// ── Simulators ──────────────────────────────────────────────────────────────
notificationsRouter.post("/notifications", (req, res) => {
  const text = typeof req.body?.text === "string" && req.body.text.trim() ? req.body.text.trim() : SOMEONE_DID_SOMETHING[notifications.length % SOMEONE_DID_SOMETHING.length];
  res.status(201).json(addNotification(text));
});

let jobs = 0;
notificationsRouter.post("/jobs/export", (_req, res) => {
  const jobId = `job-${++jobs}`;
  console.log(`⚙️  ${jobId} processing, done in ${JOB_MS / 1000}s`);
  setTimeout(() => addNotification(`Your report export is ready (${jobId})`), JOB_MS);
  res.status(202).json({ jobId, status: "processing", doneInMs: JOB_MS });
});
