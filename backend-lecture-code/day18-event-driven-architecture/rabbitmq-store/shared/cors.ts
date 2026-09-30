import type { RequestHandler } from "express";

// The lecture's React page runs on one port and calls these services on
// others, so the browser needs permission for cross-origin requests. Fine for
// a localhost demo; a real service would allow specific origins, not "*".
export const allowBrowser: RequestHandler = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    // The preflight the browser sends before a POST with a JSON body.
    res.status(204).end();
    return;
  }
  next();
};
