// What each mechanism costs the server, so the lecture page can show it.
// "…Open" numbers are connections or requests held open right now; the rest only go up.
export const stats = {
  // short polling: the monitoring dashboard
  metricsRequests: 0,
  // short polling: the notification bell, asked every 2 s
  bellShortRequests: 0,
  bellShortEmpty: 0, // answered "nothing new"
  // long polling: the same bell, held until there's news
  bellLongRequests: 0,
  bellLongOpen: 0,
  // WebSocket: the chat room
  chatSocketsOpen: 0,
  chatMessagesIn: 0,
  chatMessagesOut: 0,
  // SSE: the live match
  matchPlainRequests: 0,
  matchStreamsOpen: 0,
  matchStreamsOpened: 0,
  matchEventsSent: 0,
  matchEventsReplayed: 0,
};

/** Zero the running totals; leave the "open right now" gauges alone. */
export function resetStats() {
  for (const key of Object.keys(stats) as (keyof typeof stats)[]) {
    if (!key.endsWith("Open")) stats[key] = 0;
  }
}
