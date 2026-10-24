import type { Response } from "express";

// A model call can fail (no key, rate limit). Tell the page instead of crashing the server.
export function sendFailure(res: Response, error: unknown) {
  console.error(error);
  res.status(500).json({ error: error instanceof Error ? error.message : "Something went wrong" });
}

export function isMode(mode: string): mode is "vulnerable" | "safe" {
  return mode === "vulnerable" || mode === "safe";
}
