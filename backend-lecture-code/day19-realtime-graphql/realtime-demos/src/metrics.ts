// Short polling done right: a server monitoring dashboard.
//
//   GET /metrics    whatever is true right now: CPU, memory, requests per second
//
// The numbers change every second, so a page asking every 2 s gets fresh data on
// almost every request. Nothing is wasted, and 2 s of delay doesn't matter.
import { Router } from "express";
import { stats } from "./stats";

export type Metrics = { cpu: number; memory: number; rps: number; version: number; at: string };

const TICK_MS = 1000;

let current: Metrics = { cpu: 35, memory: 52, rps: 120, version: 0, at: new Date().toISOString() };

// A random walk, so the chart wanders like a real server's would.
const drift = (value: number, step: number, min: number, max: number) =>
  Math.round(Math.min(max, Math.max(min, value + (Math.random() - 0.5) * 2 * step)));

setInterval(() => {
  current = {
    cpu: drift(current.cpu, 12, 3, 98),
    memory: drift(current.memory, 3, 30, 90),
    rps: drift(current.rps, 40, 10, 400),
    version: current.version + 1,
    at: new Date().toISOString(),
  };
}, TICK_MS);

export const metricsRouter = Router();

metricsRouter.get("/metrics", (_req, res) => {
  stats.metricsRequests++;
  res.json(current);
});
